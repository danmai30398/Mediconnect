<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ViewDoctorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Lấy tất cả bác sỹ kèm thông tin city
        $doctors = Doctor::with('city')->get();
        $doctors->makeHidden(['password', 'dob', 'phone', 'email', 'gender']);
        return response()->json($doctors);
    }

    /**
     * Lấy danh sách các chuyên khoa y tế
     * Trả về danh sách các chuyên khoa duy nhất từ bác sĩ
     */
    public function specializations()
    {
        $specs = Doctor::whereNotNull('specialization')
            ->distinct()
            ->orderBy('specialization')
            ->pluck('specialization')
            ->values();
        return response()->json($specs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'qualification' => 'nullable|string|max:255',
                'experience' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255|unique:doctors,email',
                'specialization' => 'nullable|string|max:255',
                'gender' => 'nullable|in:Male,Female,Other',
                'dob' => 'nullable|date',
                'description' => 'nullable|string',
                'city_id' => 'nullable|integer|exists:cities,city_id',
                'image' => 'nullable|file|image|max:10240',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('doctor-images', 'public');
            }

            $doctor = Doctor::create(array_merge($validated, [
                'image' => $imagePath
            ]));

            return response()->json($doctor, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Doctor validation failed:', [
                'input' => $request->all(),
                'errors' => $e->errors()
            ]);

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Doctor creation error:', [
                'input' => $request->all(),
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Doctor creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $doctors = Doctor::with(['city', 'availabilitySchedulings'])->findOrFail($id);
        return response()->json($doctors);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $doctor = Doctor::findOrFail($id);

        try {
            Log::info('Request method', [$request->method()]);
Log::info('Request content type', [$request->header('Content-Type')]);
Log::info('Request all data', $request->all());
Log::info('Request post', $request->post());
Log::info('Request input', $request->input());
Log::info('Request files', $request->allFiles());
Log::info('Request raw', [$request->getContent()]);


            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'qualification' => 'nullable|string|max:255',
                'experience' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255|unique:doctors,email,' . $doctor->doctor_id . ',doctor_id',
                'specialization' => 'nullable|string|max:255',
                'gender' => 'nullable|in:Male,Female,Other',
                'dob' => 'nullable|date',
                'description' => 'nullable|string',
                'city_id' => 'nullable|integer|exists:cities,city_id',
                'image' => 'nullable|file|image|max:10240',
            ]);


            if ($request->hasFile('image')) {
                if ($doctor->image && \Storage::disk('public')->exists($doctor->image)) {
                    \Storage::disk('public')->delete($doctor->image);
                }

                $validated['image'] = $request->file('image')->store('doctor-images', 'public');
            }

            $doctor->update($validated);

            return response()->json($doctor->fresh());

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Doctor update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //xoá sản phẩm khỏi db
        Doctor::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }


}