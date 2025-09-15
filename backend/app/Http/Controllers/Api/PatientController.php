<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::with(['user'])->get()->map(function ($patient) {
            return [
                'id' => $patient->patient_id,
                'name' => $patient->name,
                'email' => $patient->email,
                'phone' => $patient->phone,
                'address' => $patient->address,
                'gender' => $patient->gender,
                'dob' => $patient->dob,
                'image' => $patient->image,
                'image_url' => $patient->image ? asset('storage/patient-images/' . $patient->image) : null,
                'user_id' => $patient->user_id
            ];
        });

        return response()->json($patients);
    }

    public function store(Request $request)
    {
        try {
            Log::info('Creating new patient', [
                'request_data' => $request->all(),
                'has_image' => $request->hasFile('image')
            ]);

            // Validate request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:patients,email',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'gender' => 'nullable|string|in:Male,Female,Other',
                'dob' => 'nullable|date',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            ]);

            if ($validator->fails()) {
                Log::error('Patient validation failed', ['errors' => $validator->errors()]);
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $validated = $validator->validated();

            // Create user account first
            $user = \App\Models\MediUser::create([
                'username' => $validated['email'], // Use email as username
                'password' => \Illuminate\Support\Facades\Hash::make('123456'), // Default password
                'role_id' => 3, // Patient role
                'email' => $validated['email'],
                'is_active' => true,
            ]);

            Log::info('User created for patient', ['user_id' => $user->user_id, 'email' => $user->email]);

            // Create patient data
            $patientData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'gender' => $validated['gender'] ?? 'Other',
                'dob' => $validated['dob'] ?? now()->toDateString(),
                'user_id' => $user->user_id, // Link to user account
            ];

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('patient-images', $imageName, 'public');
                $patientData['image'] = $imageName;
                
                Log::info('Patient image stored: ' . $imageName);
            }

            // Create patient
            $patient = Patient::create($patientData);
            $patient->image_url = $patient->image ? asset('storage/patient-images/' . $patient->image) : null;

            Log::info('Patient created successfully', ['patient_id' => $patient->patient_id]);

            return response()->json([
                'message' => 'Patient created successfully',
                'patient' => $patient
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating patient: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create patient'], 500);
        }
    }

    public function appointments(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Get the correct user_id for MediUser
            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;

            Log::info('Fetching appointments for user_id: ' . $userId);

            // Simple query first - just get appointments
            $appointments = DB::table('appointments')
                ->where('patient_id', $userId)
                ->get();

            Log::info('Found appointments: ' . $appointments->count());

            // Return appointments array directly for frontend compatibility
            return response()->json($appointments->toArray());

        } catch (\Exception $e) {
            Log::error('Error fetching patient appointments: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch appointments'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Log request details
            Log::info('Patient update request: ' . json_encode([
                'id' => $id,
                'method' => $request->method(),
                'all_data' => $request->all(),
                'has_file' => $request->hasFile('image'),
                'content_type' => $request->header('Content-Type'),
                'form_data' => $request->except(['image'])
            ]));

            // Validate input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'address' => 'nullable|string|max:500',
                'dob' => 'nullable|date',
                'gender' => 'nullable|string|in:Male,Female,Other',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240'
            ]);

            if ($validator->fails()) {
                Log::error('Patient update validation failed: ' . json_encode($validator->errors()));
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Find patient by ID
            $patient = Patient::find($id);
            
            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }

            // Prepare update data
            $updateData = [
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
                'dob' => $request->dob,
                'gender' => $request->gender
            ];

            // Handle image upload
            if ($request->hasFile('image')) {
                Log::info('Patient image upload detected');
                
                // Delete old image if exists
                if ($patient->image && Storage::disk('public')->exists('patient-images/' . $patient->image)) {
                    Storage::disk('public')->delete('patient-images/' . $patient->image);
                    Log::info('Old patient image deleted: ' . $patient->image);
                }

                // Store new image
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('patient-images', $imageName, 'public');
                $updateData['image'] = $imageName;
                
                Log::info('New patient image stored: ' . $imageName . ' at ' . $imagePath);
            } else {
                Log::info('No image file in patient update request');
            }

            // Update patient data
            $patient->update($updateData);

            // Add image_url to response
            $patient->image_url = $patient->image ? asset('storage/patient-images/' . $patient->image) : null;

            return response()->json([
                'message' => 'Patient updated successfully',
                'patient' => $patient
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating patient: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update patient'], 500);
        }
    }

    public function updateProfile(Request $request, $id)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            Log::info('Update patient request', [
                'user_id' => $user->id,
                'user_type' => get_class($user),
                'requested_id' => $id,
                'user_data' => $user->toArray()
            ]);

            // Validate input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'address' => 'nullable|string|max:500',
                'dob' => 'nullable|date',
                'gender' => 'nullable|string|in:Male,Female,Other'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Find patient by user_id - handle both MediUser and Laravel User
            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;
            $patient = Patient::where('user_id', $userId)->first();
            
            Log::info('Patient search', [
                'searching_user_id' => $userId,
                'patient_found' => $patient ? true : false,
                'patient_id' => $patient ? $patient->patient_id : null,
                'all_patients' => Patient::all()->pluck('user_id', 'patient_id')->toArray()
            ]);
            
            // If not found by user_id, try to find by the ID passed in URL
            if (!$patient) {
                $patient = Patient::find($id);
                Log::info('Patient search by ID', [
                    'searching_id' => $id,
                    'patient_found' => $patient ? true : false,
                    'patient_id' => $patient ? $patient->patient_id : null
                ]);
            }
            
            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }

            // Update patient data
            $patient->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
                'dob' => $request->dob,
                'gender' => $request->gender
            ]);

            return response()->json([
                'message' => 'Patient profile updated successfully',
                'patient' => $patient
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating patient profile: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update profile'], 500);
        }
    }

    public function uploadImage(Request $request, $id)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Validate image
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240'
        ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Find patient by user_id
            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;
            $patient = Patient::where('user_id', $userId)->first();
            
            if (!$patient) {
                return response()->json(['error' => 'Patient not found'], 404);
            }

            // Delete old image if exists
            if ($patient->image && Storage::disk('public')->exists('patient-images/' . $patient->image)) {
                Storage::disk('public')->delete('patient-images/' . $patient->image);
            }

            // Store new image
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('patient-images', $imageName, 'public');

            // Update patient record
            $patient->image = $imageName;
            $patient->save();

            return response()->json([
                'message' => 'Image uploaded successfully',
                'image' => $imageName,
                'image_url' => asset('storage/' . $imagePath)
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading patient image: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to upload image'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            Log::info('Deleting patient', ['patient_id' => $id]);

            $patient = Patient::findOrFail($id);
            
            // Delete associated image if exists
            if ($patient->image && Storage::disk('public')->exists('patient-images/' . $patient->image)) {
                Storage::disk('public')->delete('patient-images/' . $patient->image);
                Log::info('Patient image deleted: ' . $patient->image);
            }

            // Delete patient record
            $patient->delete();
            
            Log::info('Patient deleted successfully', ['patient_id' => $id]);

            return response()->json(['message' => 'Patient deleted successfully']);

        } catch (\Exception $e) {
            Log::error('Error deleting patient: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete patient'], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Lấy tất cả sản phẩm kèm thông tin category
        $patients = Patient::with('user')->get();

        return response()->json($patients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //create sản phẩm và store lại trong db
        return Patient::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show chi tiết từng sản phẩm
        $doctors = Patient::with('city')->findOrFail($id);
        return response()->json($doctors);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //cập nhật thông tin sản phẩm
        $product = Patient::findOrFail($id);
        $product->update($request->all());
        return $product;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //xoá sản phẩm khỏi db
        Patient::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
