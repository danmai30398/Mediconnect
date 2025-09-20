<?php

namespace App\Services;

use App\Mail\AppointmentStatusChanged;
use App\Models\Appointment;
use Illuminate\Support\Facades\Mail;

class AppointmentMailService
{
    public function sendStatusChanged(Appointment $appointment)
    {
        // Kiểm tra status chỉ gửi mail khi là confirmed hoặc cancelled
        if (in_array($appointment->status, ['rescheduled'])) {
            // Giả sử bạn gửi mail đến user liên quan (bạn sửa lại tùy model của bạn)
            $email = $appointment->patient->email ?? null;

            if ($email) {
                Mail::to($email)->send(new AppointmentStatusChanged($appointment));
            }
        }
    }
}
