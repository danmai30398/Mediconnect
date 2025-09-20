<?php

namespace App\Services;

use App\Models\Appointment;
use App\Mail\AppointmentStatusChanged;
use Illuminate\Support\Facades\Mail;

class AppointmentMailService
{
    public function sendStatusChanged(Appointment $appointment, bool $useQueue = false): void
    {
        $validStatuses = ['pending', 'confirmed', 'cancelled_by_patient', 'cancelled_by_doctor', 'rescheduled'];

        if (!in_array($appointment->status, $validStatuses)) {
            return;
        }

        $email = $appointment->patient->email ?? null;

        if (!$email) {
            return;
        }

        $mailable = new AppointmentStatusChanged($appointment);

        if ($useQueue) {
            Mail::to($email)->queue($mailable);
        } else {
            Mail::to($email)->send($mailable);
        }
    }
}

