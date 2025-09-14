<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        Patient::insert([
            [
                'name'     => 'John Smith',
                'address'  => '123 Main Street, New York',
                'phone'    => '1234567890',
                'dob'      => '1990-05-10',
                'email'    => 'john.smith@example.com',
                'gender'   => 'Male',
                'image'    => null,
                'user_id'  => 1,
            ],
            [
                'name'     => 'Emily Johnson',
                'address'  => '456 Park Avenue, Los Angeles',
                'phone'    => '0987654321',
                'dob'      => '1992-07-15',
                'email'    => 'emily.johnson@example.com',
                'gender'   => 'Female',
                'image'    => null,
                'user_id'  => 2,
            ],
            [
                'name'     => 'Michael Brown',
                'address'  => '789 Broadway, Chicago',
                'phone'    => '1122334455',
                'dob'      => '1994-03-20',
                'email'    => 'michael.brown@example.com',
                'gender'   => 'Male',
                'image'    => null,
                'user_id'  => 3,
            ],
            [
                'name'     => 'Sophia Davis',
                'address'  => '321 Ocean Drive, Miami',
                'phone'    => '6677889900',
                'dob'      => '1996-09-25',
                'email'    => 'sophia.davis@example.com',
                'gender'   => 'Female',
                'image'    => null,
                'user_id'  => 4,
            ],
        ]);
    }
}
