<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\AvailabilityScheduling;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'email' => 'required|email|unique:doctors,email',
                'phone' => 'nullable|string|max:20',
                'specialization' => 'nullable|string|max:255',
                'experience' => 'nullable|integer|min:0',
                'qualification' => 'nullable|string|max:255',
                'gender' => 'required|string|in:Male,Female',
                'dob' => 'required|date',
                'city_id' => 'nullable|integer|exists:cities,city_id',
                'description' => 'nullable|string',
            ]);

            // Tự động tạo user_id nếu không có
            if (!isset($validated['user_id'])) {
                $firstUser = \App\Models\MediUser::first();
                $validated['user_id'] = $firstUser ? $firstUser->user_id : 1;
            }

            $doctor = Doctor::create($validated);

            return response()->json([
                'message' => 'Doctor created successfully',
                'doctor' => $doctor
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create doctor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show chi iet tung bac sy va lich available cua bac sy
        $doctors = Doctor::with(['city', 'availabilitySchedulings'])->findOrFail($id);
        return response()->json($doctors);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $doctor = Doctor::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:doctors,email,' . $id . ',doctor_id',
                'phone' => 'sometimes|string|max:20',
                'specialization' => 'sometimes|string|max:255',
                'experience' => 'sometimes|integer|min:0',
                'qualification' => 'sometimes|string|max:255',
                'gender' => 'sometimes|string|in:Male,Female',
                'dob' => 'sometimes|date',
                'city_id' => 'sometimes|integer|exists:cities,city_id',
                'description' => 'nullable|string',
            ]);

            $doctor->update($validated);

            return response()->json([
                'message' => 'Doctor updated successfully',
                'doctor' => $doctor->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update doctor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $doctor = Doctor::findOrFail($id);
            $userId = $doctor->user_id;
            
            // Xóa doctor record trước
            $doctor->delete();
            
            // Xóa user tương ứng
            if ($userId) {
                $user = \App\Models\MediUser::find($userId);
                if ($user) {
                    $user->delete();
                }
            }
            
            return response()->json(['message' => 'Doctor and user deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete doctor'], 500);
        }
    }
}