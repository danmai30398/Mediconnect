<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    public function appointments(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Get doctor's appointments
            $appointments = DB::table('appointments')
                ->join('availability_schedulings', 'appointments.availability_id', '=', 'availability_schedulings.id')
                ->join('patients', 'appointments.patient_id', '=', 'patients.id')
                ->join('doctors', 'availability_schedulings.doctor_id', '=', 'doctors.id')
                ->where('doctors.user_id', $user->id)
                ->select(
                    'appointments.*',
                    'patients.name as patient_name',
                    'patients.phone as patient_phone',
                    'patients.email as patient_email',
                    'availability_schedulings.available_date',
                    'availability_schedulings.available_time',
                    'doctors.name as doctor_name'
                )
                ->orderBy('availability_schedulings.available_date', 'desc')
                ->orderBy('availability_schedulings.available_time', 'desc')
                ->get();

            // Format the response
            $formattedAppointments = $appointments->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'status' => $appointment->status,
                    'created_at' => $appointment->created_at,
                    'updated_at' => $appointment->updated_at,
                    'patient' => [
                        'name' => $appointment->patient_name,
                        'phone' => $appointment->patient_phone,
                        'email' => $appointment->patient_email,
                    ],
                    'availability_scheduling' => [
                        'available_date' => $appointment->available_date,
                        'available_time' => $appointment->available_time,
                    ],
                    'doctor' => [
                        'name' => $appointment->doctor_name,
                    ]
                ];
            });

            return response()->json($formattedAppointments);

        } catch (\Exception $e) {
            Log::error('Error fetching doctor appointments: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch appointments'], 500);
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

            // Find doctor by user_id
            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;
            $doctor = Doctor::where('user_id', $userId)->first();
            
            if (!$doctor) {
                return response()->json(['error' => 'Doctor not found'], 404);
            }

            // Delete old image if exists
            if ($doctor->image && Storage::disk('public')->exists('doctor-images/' . $doctor->image)) {
                Storage::disk('public')->delete('doctor-images/' . $doctor->image);
            }

            // Store new image
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('doctor-images', $imageName, 'public');

            // Update doctor record
            $doctor->image = $imageName;
            $doctor->save();

            return response()->json([
                'message' => 'Image uploaded successfully',
                'image' => $imageName,
                'image_url' => asset('storage/' . $imagePath)
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading doctor image: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to upload image'], 500);
        }
    }

    /**
     * Update doctor profile
     */
    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Find doctor by user_id
            $userId = $user->id ?? $user->user_id;
            $doctor = Doctor::where('user_id', $userId)->first();
            
            if (!$doctor) {
                return response()->json(['error' => 'Doctor not found'], 404);
            }

            // Validate input
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|nullable|string|max:255',
                'email' => 'sometimes|nullable|email|max:255',
                'phone' => 'sometimes|nullable|string|max:20',
                'specialization' => 'sometimes|nullable|string|max:255',
                'experience' => 'sometimes|nullable|integer|min:0',
                'qualification' => 'sometimes|nullable|string|max:255',
                'gender' => 'sometimes|nullable|string|in:Male,Female,Other',
                'dob' => 'sometimes|nullable|date',
                'description' => 'sometimes|nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed', ['errors' => $validator->errors()]);
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Update doctor
            $updateData = $request->only([
                'name', 'email', 'phone', 'specialization', 
                'experience', 'qualification', 'gender', 'dob', 'description'
            ]);
            
            $doctor->update($updateData);

            return response()->json([
                'message' => 'Doctor profile updated successfully',
                'doctor' => $doctor->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating doctor profile: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update doctor profile'], 500);
        }
    }
}





