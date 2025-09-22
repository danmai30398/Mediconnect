<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AvailabilityScheduling;
use App\Models\Notification;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Get available time slots for a specific doctor and date
     */
    public function getAvailableSlots(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:doctors,doctor_id',
            'date' => 'required|date|after_or_equal:today'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $availableSlots = AvailabilityScheduling::where('doctor_id', $request->doctor_id)
            ->where('available_date', $request->date)
            ->where('status', 'available')
            ->orderBy('available_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $availableSlots
        ]);
    }

    /**
     * Book an appointment
     */
    
    public function bookAppointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,patient_id',
            'availability_id' => 'required|exists:availability_schedulings,availability_id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Check slot còn tồn tại
            $availability = AvailabilityScheduling::findOrFail($request->availability_id);

            // Tạo appointment pending
            $appointment = Appointment::create([
                'patient_id' => $request->patient_id,
                'availability_id' => $request->availability_id,
                'status' => 'pending'
            ]);
            // Đánh dấu slot là booked ngay khi patient đặt - doing
            $availability->update(['status' => 'booked']);

            // Lấy thông tin doctor & patient để notify
            $doctor = Doctor::find($availability->doctor_id);
            $patient = Patient::find($request->patient_id);

            Notification::create([
                'doctor_id' => $availability->doctor_id,
                'title' => 'New Appointment Request',
                'message' => "Patient {$patient->name} has requested an appointment for {$availability->available_date} at {$availability->available_time}",
                'type' => 'appointment_request',
                'is_read' => false
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Appointment request created successfully',
                'data' => $appointment->load(['patient', 'availability.doctor'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create appointment request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get appointments for a doctor
     */
    public function getDoctorAppointments(Request $request)
    {
        $mediUser = $request->user();
        $doctor = Doctor::where('user_id', $mediUser->user_id)->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor profile not found'
            ], 404);
        }

        $appointments = Appointment::whereHas('availability', function ($query) use ($doctor) {
            $query->where('doctor_id', $doctor->doctor_id);
        })
            ->with(['patient', 'availability'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                if ($item->availability) {
                    // format date: YYYY-MM-DD
                    $item->availability->available_date = date('Y-m-d', strtotime($item->availability->available_date));
                    // format time: HH:MM
                    $item->availability->available_time = date('H:i', strtotime($item->availability->available_time));
                }
                return $item;
            });

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }


    /**
     * Update appointment status (for doctor)
     */
    
    public function updateAppointmentStatus(Request $request, $appointmentId)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,completed,cancelled_by_doctor,cancelled_by_patient,no_show,rescheduled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $appointment = Appointment::findOrFail($appointmentId);
            $mediUser = $request->user();
            $doctor = Doctor::where('user_id', $mediUser->user_id)->first();

            if (!$doctor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor profile not found'
                ], 404);
            }

            // Check quyền
            if ($appointment->availability->doctor_id !== $doctor->doctor_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this appointment'
                ], 403);
            }

            DB::beginTransaction();

            // Cập nhật status
            $appointment->update(['status' => $request->status]);
/*
            // Nếu doctor confirm → slot đổi thành booked + hủy các pending khác
            if ($request->status === 'confirmed') {
                $appointment->availability->update(['status' => 'booked']);

                Appointment::where('availability_id', $appointment->availability_id)
                    ->where('appointment_id', '!=', $appointment->appointment_id)
                    ->where('status', 'pending')
                    ->update(['status' => 'cancelled_by_doctor']);
            }
*/
            // Nếu cancelled/rescheduled/completed/no_show → slot mở lại
            if (in_array($request->status, ['cancelled_by_doctor', 'cancelled_by_patient', 'rescheduled', 'no_show'])) {
                $appointment->availability->update(['status' => 'available']);
            }

            // Notify cho patient
            $patient = $appointment->patient;
            $statusMessage = $this->getStatusMessage($request->status);

            Notification::create([
                'doctor_id' => $doctor->doctor_id,
                'user_id' => $patient->user_id,
                'patient_id' => $patient->patient_id,
                'role_id' => $patient->user->role_id,
                'title' => "Update Appointment",
                'message' => "Your appointment status has been updated to: {$statusMessage}",
                'type' => 'appointment_update',
                'is_read' => false
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Appointment status updated successfully',
                'data' => $appointment->load(['patient', 'availability'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update appointment status', [
                'error_message' => $e->getMessage(),
                'error_trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update appointment status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get status message for notifications
     */
    private function getStatusMessage($status)
    {
        $messages = [
            'pending' => 'Pending Confirmation',
            'confirmed' => 'Confirmed',
            'completed' => 'Completed',
            'cancelled_by_doctor' => 'Cancelled by Doctor',
            'cancelled_by_patient' => 'Cancelled by Patient',
            'no_show' => 'No Show',
            'rescheduled' => 'Rescheduled'
        ];

        return $messages[$status] ?? $status;
    }
}
