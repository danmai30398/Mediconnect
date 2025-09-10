<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        // Ensure the role column exists; if not, add it as string
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->nullable()->after('is_active');
            }
        });

        // Backfill role text from role_id mapping: 1 => admin, 2 => doctor, 3 => patient
        DB::table('users')->where('role_id', 1)->update(['role' => 'admin']);
        DB::table('users')->where('role_id', 2)->update(['role' => 'doctor']);
        DB::table('users')->where('role_id', 3)->update(['role' => 'patient']);

        // For any null role but existing string 'user', attempt to infer as admin if id=1 else keep as 'user'
        DB::table('users')->whereNull('role')->where('id', 1)->update(['role' => 'admin']);
        DB::table('users')->whereNull('role')->update(['role' => DB::raw("COALESCE(role, 'user')")]);
    }

    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        // Optionally revert textual role to 'user' if needed
        DB::table('users')->update(['role' => 'user']);
    }
};







