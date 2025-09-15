<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Log::info('appointment request:' .$request);

        $request->validate([
            'availability_id' => 'required|integer',
            'patient_id' => 'required|integer',
        ]);

        $slotId = $request->input('availability_id');
        $patientId = $request->input('patient_id');

        try {
            DB::transaction(function () use ($slotId, $patientId) {
                // Cập nhật status của slot
                $updated = DB::table('availability_schedulings')
                    ->where('availability_id', $slotId)
                    ->where('status', 'available')
                    ->update(['status' => 'booked']);

                if ($updated === 0) {
                    throw new \Exception('This time slot is no longer available.');
                }

                // Tạo appointment mới
                Appointment::create([
                    'availability_id' => $slotId,
                    'patient_id' => $patientId,
                    'status' => 'pending',
                ]);
            });

            return response()->json([
                'status'  => 'success',
                'message' => 'Appointment booked successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'availability_id' => 'required|integer',
        ]);

        $slotId = $request->input('availability_id');

        try {
            DB::transaction(function () use ($id, $slotId) {
                // Find the appointment
                $appointment = Appointment::findOrFail($id);

                // If the appointment was already cancelled by the doctor
                if ($appointment->status === 'cancelled_by_doctor') {
                    throw new \Exception('This appointment was already cancelled by the doctor.');
                }

                // Only allow cancellation if status is pending or confirmed
                if (in_array($appointment->status, ['pending', 'confirmed'])) {
                    // Cancel the appointment (by the patient)
                    $appointment->status = 'cancelled_by_patient';
                    $appointment->save();

                    // Set the availability slot back to 'available'
                    DB::table('availability_schedulings')
                        ->where('availability_id', $slotId)
                        ->update(['status' => 'available']);
                } else {
                    throw new \Exception('This appointment cannot be cancelled in its current status.');
                }
            });

            return response()->json([
                'status'  => 'success',
                'message' => 'Appointment was successfully cancelled by the patient.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Show appointments of specified patient.
     */
    public function getByPatient($patient_id)
    {
        $appointments = Appointment::with(['patient', 'availability.doctor.city'])
            ->where('patient_id', $patient_id)
            ->get();
        $doctors = $appointments->map(function ($appointment) {
            return $appointment->availability->doctor;
        });

        $cities = $doctors->map(function ($doc) {
            return $doc->city;
        });

        return response()->json([
            'appointments' => $appointments,
            'doctors' => $doctors,
            'cities' => $cities
        ]);
    }

    /**
     * Edit status of appointment to rescheduled.
     */
    public function reschedule(Request $request, string $id)
    {
        $request->validate([
            'availability_id' => 'required|integer',
        ]);

        $slotId = $request->input('availability_id');

        try {
            DB::transaction(function () use ($id, $slotId) {
                // Find the appointment
                $appointment = Appointment::findOrFail($id);

                // If the appointment was already cancelled by the doctor
                if ($appointment->status === 'cancelled_by_doctor') {
                    throw new \Exception('Sorry! This appointment has already been cancelled by the doctor. Please schedule a new one.');
                }

                // Only allow cancellation if status is pending or confirmed
                if (in_array($appointment->status, ['pending', 'confirmed'])) {
                    // Cancel the appointment (by the patient)
                    $appointment->status = 'rescheduled';
                    $appointment->save();

                    // Set the availability slot back to 'available'
                    DB::table('availability_schedulings')
                        ->where('availability_id', $slotId)
                        ->update(['status' => 'available']);
                } else {
                    throw new \Exception('This appointment cannot be rescheduled in its current status.');
                }
            });

            return response()->json([
                'status'  => 'success',
                'message' => 'Appointment was successfully rescheduled by the patient.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}