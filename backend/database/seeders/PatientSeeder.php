<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        Patient::updateOrCreate(
            ['email' => 'nva@example.com'],
            [
                'name' => 'Nguyen Van A',
                'address' => '123 Hai Ba Trung, Ha Noi',
                'phone' => '0987654321',
                'dob' => '1995-01-01',
                'gender' => 'Male',
                'image' => null,
                'user_id' => 3,
            ]
        );

        Patient::updateOrCreate(
            ['email' => 'ttb@example.com'],
            [
                'name' => 'Tran Thi B',
                'address' => '456 Le Loi, Da Nang',
                'phone' => '0911222333',
                'dob' => '1997-02-02',
                'gender' => 'Female',
                'image' => null,
                'user_id' => 4,
            ]
        );
    }
}
