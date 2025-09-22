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
                'address' => '123 Hai Ba Trung Street, Hanoi',
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
                'address' => '456 Le Loi Street, Da Nang',
                'phone' => '0911222333',
                'dob' => '1997-02-02',
                'gender' => 'Female',
                'image' => null,
                'user_id' => 4,
            ]
        );

        Patient::updateOrCreate(
            ['email' => 'ntc@example.com'],
            [
                'name' => 'Nguyen Thi C',
                'address' => '789 Tran Phu Street, Hai Phong',
                'phone' => '0933444555',
                'dob' => '1995-03-03',
                'gender' => 'Female',
                'image' => null,
                'user_id' => 6,
            ]
        );

    }
}
