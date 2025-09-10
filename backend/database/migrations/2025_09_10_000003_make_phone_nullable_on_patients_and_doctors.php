<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Use raw SQL to avoid doctrine/dbal requirement
        DB::statement("ALTER TABLE patients MODIFY phone VARCHAR(255) NULL");
        DB::statement("ALTER TABLE doctors MODIFY phone VARCHAR(255) NULL");
        // Normalize existing empty strings to NULL
        DB::statement("UPDATE patients SET phone = NULL WHERE phone = ''");
        DB::statement("UPDATE doctors SET phone = NULL WHERE phone = ''");
    }

    public function down(): void
    {
        // Revert to NOT NULL (may fail if nulls present). Keep simple.
        DB::statement("UPDATE patients SET phone = '' WHERE phone IS NULL");
        DB::statement("UPDATE doctors SET phone = '' WHERE phone IS NULL");
        DB::statement("ALTER TABLE patients MODIFY phone VARCHAR(255) NOT NULL");
        DB::statement("ALTER TABLE doctors MODIFY phone VARCHAR(255) NOT NULL");
    }
};







