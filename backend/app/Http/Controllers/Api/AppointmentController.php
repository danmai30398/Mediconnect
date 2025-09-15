<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with(['patient', 'availability.doctor'])->orderByDesc('appointment_id')->get();
        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|integer|exists:patients,patient_id',
            'availability_id' => 'required|integer|exists:availability_schedulings,availability_id',
            'status' => 'required|in:pending,confirmed,completed,cancelled_by_patient,cancelled_by_doctor,no_show,rescheduled',
        ]);
        
        $appointment = Appointment::with(['patient', 'availability.doctor'])->create($validated);
        
        // Tạo notification khi có appointment mới
        if ($appointment) {
            $patientName = $appointment->patient ? $appointment->patient->name : 'Unknown Patient';
            $doctorName = $appointment->availability && $appointment->availability->doctor 
                ? $appointment->availability->doctor->name 
                : 'Unknown Doctor';
            
            Notification::createAppointmentNotification(
                'appointment_created',
                $appointment,
                '📅 New Appointment Booking',
                "{$patientName} has booked an appointment with Dr. {$doctorName}",
                ['action' => 'view_appointment']
            );
        }
        
        return response()->json($appointment, 201);
    }

    public function show(string $id)
    {
        $appointment = Appointment::with(['patient', 'availability.doctor'])->findOrFail($id);
        return response()->json($appointment);
    }

    public function update(Request $request, string $id)
    {
        $appointment = Appointment::with(['patient', 'availability.doctor'])->findOrFail($id);
        $oldStatus = $appointment->status;
        
        $validated = $request->validate([
            'patient_id' => 'sometimes|integer|exists:patients,patient_id',
            'availability_id' => 'sometimes|integer|exists:availability_schedulings,availability_id',
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled_by_patient,cancelled_by_doctor,no_show,rescheduled',
        ]);
        
        $appointment->update($validated);
        
        // Tạo notification khi status thay đổi
        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            $patientName = $appointment->patient ? $appointment->patient->name : 'Unknown Patient';
            $doctorName = $appointment->availability && $appointment->availability->doctor 
                ? $appointment->availability->doctor->name 
                : 'Unknown Doctor';
            
            $statusMessages = [
                'confirmed' => "Appointment confirmed: {$patientName} with Dr. {$doctorName}",
                'cancelled_by_patient' => "Appointment cancelled by patient: {$patientName}",
                'cancelled_by_doctor' => "Appointment cancelled by doctor: Dr. {$doctorName}",
                'rescheduled' => "Appointment rescheduled: {$patientName} with Dr. {$doctorName}",
                'completed' => "Appointment completed: {$patientName} with Dr. {$doctorName}",
                'no_show' => "Patient no-show: {$patientName}"
            ];
            
            $statusTitles = [
                'confirmed' => '✅ Appointment Confirmed',
                'cancelled_by_patient' => '❌ Appointment Cancelled by Patient',
                'cancelled_by_doctor' => '❌ Appointment Cancelled by Doctor',
                'rescheduled' => '🔄 Appointment Rescheduled',
                'completed' => '✅ Appointment Completed',
                'no_show' => '⚠️ Patient No-Show'
            ];
            
            $newStatus = $validated['status'];
            if (isset($statusMessages[$newStatus])) {
                Notification::createAppointmentNotification(
                    'appointment_' . $newStatus,
                    $appointment,
                    $statusTitles[$newStatus],
                    $statusMessages[$newStatus],
                    ['action' => 'view_appointment', 'old_status' => $oldStatus]
                );
            }
        }
        
        return response()->json($appointment);
    }

    public function destroy(string $id)
    {
        Appointment::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}


