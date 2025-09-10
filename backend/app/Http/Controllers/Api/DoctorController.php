<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
}





