<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AvailabilityScheduling;

class AvailabilitySchedulingSeeder extends Seeder
{
    public function run(): void
    {
        if (!AvailabilityScheduling::where(['doctor_id' => 1, 'available_date' => '2025-09-01', 'available_time' => '10:00:00'])->exists()) {
            AvailabilityScheduling::create([
                'doctor_id'      => 1,
                'available_date' => '2025-09-01',
                'available_time' => '10:00:00',
            ]);
        }

        if (!AvailabilityScheduling::where(['doctor_id' => 1, 'available_date' => '2025-09-01', 'available_time' => '14:00:00'])->exists()) {
            AvailabilityScheduling::create([
                'doctor_id'      => 1,
                'available_date' => '2025-09-01',
                'available_time' => '14:00:00',
            ]);
        }

        if (!AvailabilityScheduling::where(['doctor_id' => 2, 'available_date' => '2025-09-02', 'available_time' => '09:30:00'])->exists()) {
            AvailabilityScheduling::create([
                'doctor_id'      => 2,
                'available_date' => '2025-09-02',
                'available_time' => '09:30:00',
            ]);
        }
    }
}
