<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AvailabilityScheduling;

class AvailabilitySchedulingSeeder extends Seeder
{
    public function run(): void
    {
        AvailabilityScheduling::create([
            'doctor_id'      => 3,             
            'available_date' => '2025-09-16',
            'available_time' => '10:00',
        ]);

        AvailabilityScheduling::create([
            'doctor_id'      => 3,
            'available_date' => '2025-09-18',
            'available_time' => '14:00',
        ]);

        AvailabilityScheduling::create([
            'doctor_id'      => 3,              
            'available_date' => '2025-09-19',
            'available_time' => '09:00',
        ]);

        AvailabilityScheduling::create([
            'doctor_id'      => 3,              
            'available_date' => '2025-09-17',
            'available_time' => '15:00',
        ]);
    }
}
