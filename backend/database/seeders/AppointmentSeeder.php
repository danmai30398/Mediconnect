<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // Create only if patient/availability exist
        if (\App\Models\Patient::where('patient_id', 1)->exists() && \App\Models\AvailabilityScheduling::where('availability_id', 1)->exists()) {
            Appointment::updateOrCreate(['patient_id' => 1, 'availability_id' => 1], ['status' => 'pending']);
        }

        if (\App\Models\Patient::where('patient_id', 2)->exists() && \App\Models\AvailabilityScheduling::where('availability_id', 3)->exists()) {
            Appointment::updateOrCreate(['patient_id' => 2, 'availability_id' => 3], ['status' => 'confirmed']);
        }


    }
}
