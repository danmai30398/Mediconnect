<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalRecord;

class MedicalRecordSeeder extends Seeder
{
    public function run(): void
    {
        if (\App\Models\Appointment::where('appointment_id', 1)->exists()) {
            MedicalRecord::updateOrCreate(
                ['appointment_id' => 1],
                [
                    'diagnosis' => 'Cảm cúm nhẹ',
                    'notes' => 'Nghỉ ngơi, uống nhiều nước',
                    'date' => now(),
                ]
            );
        }
    }
}
