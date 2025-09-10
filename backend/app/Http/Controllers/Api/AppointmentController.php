<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
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
        $appointment = Appointment::create($validated);
        return response()->json($appointment, 201);
    }

    public function show(string $id)
    {
        $appointment = Appointment::with(['patient', 'availability.doctor'])->findOrFail($id);
        return response()->json($appointment);
    }

    public function update(Request $request, string $id)
    {
        $appointment = Appointment::findOrFail($id);
        $validated = $request->validate([
            'patient_id' => 'sometimes|integer|exists:patients,patient_id',
            'availability_id' => 'sometimes|integer|exists:availability_schedulings,availability_id',
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled_by_patient,cancelled_by_doctor,no_show,rescheduled',
        ]);
        $appointment->update($validated);
        return response()->json($appointment);
    }

    public function destroy(string $id)
    {
        Appointment::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}


