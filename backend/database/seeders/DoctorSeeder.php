<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        Doctor::create([
    'doctor_id' => 3,
    'name'      => 'Dr. Example',
    'qualification' => 'MD',
    'experience' => '10',
    'phone'     => '0123456789',
    'email'     => 'doctor3@example.com',
    'specialization' => 'Cardiology',
    'gender'    => 'Male',
    'dob'       => '1980-01-01',
    'city_id'   => 1,
    'user_id'   => 3,
]);
    }
}
