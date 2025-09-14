<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MediUser;

class MediUserSeeder extends Seeder
{
    public function run(): void
    {
        MediUser::create([
            'username' => 'patient01',
            'password' => bcrypt('patient123'),
            'role_id'  => 3, 
        ]);

        MediUser::create([
            'username' => 'patient02',
            'password' => bcrypt('patient123'),
            'role_id'  => 3, 
        ]);

        MediUser::create([
            'username' => 'patient03',
            'password' => bcrypt('patient123'),
            'role_id'  => 3, 
        ]);

        MediUser::create([
            'username' => 'patient04',
            'password' => bcrypt('patient123'),
            'role_id'  => 3, 
        ]);
    }
}
