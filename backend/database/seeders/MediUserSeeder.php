<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MediUser;

class MediUserSeeder extends Seeder
{
    public function run(): void
    {
        if (!MediUser::where('user_id', 1)->exists()) {
            MediUser::create([
                'username' => 'doctor01',
                'password' => bcrypt('doctor123'),
                'role_id'  => 2,
            ]);
        }

        if (!MediUser::where('user_id', 2)->exists()) {
            MediUser::create([
                'username' => 'doctor02',
                'password' => bcrypt('doctor123'),
                'role_id'  => 2,
            ]);
        }

        if (!MediUser::where('user_id', 3)->exists()) {
            MediUser::create([
                'username' => 'patient01',
                'password' => bcrypt('patient123'),
                'role_id'  => 3,
            ]);
        }

        if (!MediUser::where('user_id', 4)->exists()) {
            MediUser::create([
                'username' => 'patient02',
                'password' => bcrypt('patient123'),
                'role_id'  => 3,
            ]);
        }
    }
}
