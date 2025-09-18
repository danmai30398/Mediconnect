<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo admin user trong bảng users
        User::updateOrCreate(
            ['email' => 'admin@mediconnect.vn'],
            [
                'name' => 'System Administrator',
                'email' => 'admin@mediconnect.vn',
                'password' => Hash::make('admin123'),
                'role_id' => 1, // Admin role
                'is_active' => true,
            ]
        );

        // Tạo thêm admin user khác
        User::updateOrCreate(
            ['email' => 'superadmin@mediconnect.vn'],
            [
                'name' => 'Super Administrator',
                'email' => 'superadmin@mediconnect.vn',
                'password' => Hash::make('superadmin123'),
                'role_id' => 1, // Admin role
                'is_active' => true,
            ]
        );
    }
}
