<?php

namespace App\Observers;

use App\Models\Appointment;
use App\Services\AppointmentMailService;

class AppointmentObserver
{
    protected $mailService;

    public function __construct()
    {
        $this->mailService = app(AppointmentMailService::class);
    }

    public function updating(Appointment $appointment)
    {
        if ($appointment->isDirty('status')) {
            $this->mailService->sendStatusChanged($appointment);
        }
    }
}

