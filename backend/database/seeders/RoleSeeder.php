<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = [
            ['role_name' => 'Admin', 'slug' => 'admin'],
            ['role_name' => 'Doctor', 'slug' => 'doctor'],
            ['role_name' => 'Patient', 'slug' => 'patient'],
        ];

        $hasSlug = Schema::hasColumn('roles', 'slug');
        foreach ($rows as $r) {
            if ($hasSlug) {
                DB::table('roles')->updateOrInsert(['slug' => $r['slug']], ['role_name' => $r['role_name'], 'slug' => $r['slug']]);
            } else {
                DB::table('roles')->updateOrInsert(['role_name' => $r['role_name']], ['role_name' => $r['role_name']]);
            }
        }
    }
}
