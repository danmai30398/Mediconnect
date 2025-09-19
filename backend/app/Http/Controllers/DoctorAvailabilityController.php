<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityScheduling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DoctorAvailabilityController extends Controller
{
    /**
     * Get availabilities for a doctor
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,doctor_id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $availabilities = AvailabilityScheduling::where('doctor_id', $request->doctor_id)
            ->orderBy('available_date')
            ->orderBy('available_time')
            ->get()
            ->map(function ($item) {
                // chuẩn hóa format để FE match
                $item->available_date = date('Y-m-d', strtotime($item->available_date));
                $item->available_time = date('H:i', strtotime($item->available_time));
                $item->status = strtolower($item->status ?? 'available');
                return $item;
            });

        return response()->json([
            'success' => true,
            'data' => $availabilities
        ]);
    }


    /**
     * Create new availability slot
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,doctor_id',
            'available_date' => 'required|date|after_or_equal:today',
            'available_time' => 'required|date_format:H:i',
            'status' => 'nullable|in:available,booked'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        // Check if slot already exists
        $existing = AvailabilityScheduling::where('doctor_id', $request->doctor_id)
            ->where('available_date', $request->available_date)
            ->where('available_time', $request->available_time)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'This time slot already exists'
            ], 400);
        }

        $availability = AvailabilityScheduling::create([
            'doctor_id' => $request->doctor_id,
            'available_date' => $request->available_date,
            'available_time' => $request->available_time,
            'status' => $request->status ?? 'available'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Availability slot created successfully',
            'data' => $availability
        ]);
    }

    /**
     * Update availability slot
     */
    public function update(Request $request, $id)
    {
        Log::info('Updating availability for ID: ' . $id);
        $validator = Validator::make($request->all(), [
            'available_date' => 'sometimes|date',
            'available_time' => 'sometimes|date_format:H:i',
            'status' => 'sometimes|in:available,booked'
        ]);


        if ($validator->fails()) {
            \Log::info('err: ' . $validator->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $availability = AvailabilityScheduling::findOrFail($id);

        // Check quyền sở hữu
        $doctorId = $request->user()->doctor->doctor_id;
        if ($availability->doctor_id !== $doctorId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this availability'
            ], 403);
        }

        // Nếu slot đã có appointment pending/confirmed → không cho update
        $hasActiveAppointment = $availability->appointments()
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($hasActiveAppointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot edit slot with existing appointment requests.'
            ], 400);
        }

        // Nếu slot trống → cho update
        if ($request->has('status')) {
            $availability->status = $request->status;
        }
        if ($request->has('available_date')) {
            $availability->available_date = $request->available_date;
        }
        if ($request->has('available_time')) {
            $availability->available_time = $request->available_time;
        }

        $availability->save();

        return response()->json([
            'success' => true,
            'message' => 'Availability slot updated successfully',
            'data' => $availability
        ]);
    }



    /**
     * Delete availability slot
     */
    public function destroy(Request $request, $id)
    {
        $availability = AvailabilityScheduling::findOrFail($id);

        // Check if this availability belongs to the authenticated doctor
        $doctorId = $request->user()->doctor->doctor_id;
        if ($availability->doctor_id !== $doctorId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this availability'
            ], 403);
        }

        // Check if slot is booked
        if ($availability->status === 'booked') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a booked slot. Please cancel the appointment first, then the slot will become available for deletion.'
            ], 400);
        }

        // Only block deletion if there are active appointments (pending, confirmed)
        $hasActiveAppointment = $availability->appointments()
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($hasActiveAppointment) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete slot with active appointments.'
            ], 400);
        }

        // If we reach here, slot is safe to delete
        $availability->delete();

        return response()->json([
            'success' => true,
            'message' => 'Availability slot deleted successfully'
        ]);
    }

}