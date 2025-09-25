<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        Patient::updateOrCreate(
            ['email' => 'john.doe@example.com'],
            [
                'name' => 'John Doe',
                'address' => '123 Hai Ba Trung Street, Hanoi',
                'phone' => '0987654321',
                'dob' => '1995-01-01',
                'gender' => 'Male',
                'image' => null,
                'user_id' => 3,
            ]
        );

        Patient::updateOrCreate(
            ['email' => 'jane.smith@example.com'],
            [
                'name' => 'Jane Smith',
                'address' => '456 Le Loi Street, Da Nang',
                'phone' => '0911222334',
                'dob' => '1997-02-02',
                'gender' => 'Female',
                'image' => null,
                'user_id' => 4,
            ]
        );

        Patient::updateOrCreate(
            ['email' => 'mary.johnson@example.com'],
            [
                'name' => 'Mary Johnson',
                'address' => '789 Tran Phu Street, Can Tho',
                'phone' => '0933444556',
                'dob' => '1995-03-03',
                'gender' => 'Female',
                'image' => null,
                'user_id' => 6,
            ]
        );

    }
}
