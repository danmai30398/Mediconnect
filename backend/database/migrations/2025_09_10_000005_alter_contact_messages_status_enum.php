<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('contact_messages')) {
            return;
        }
        // MySQL enum alteration via raw statement
        DB::statement("ALTER TABLE contact_messages MODIFY COLUMN status ENUM('pending','processing','done','closed') NOT NULL DEFAULT 'pending'");
        // Optionally remap old value 'reviewed' -> 'processing'
        DB::table('contact_messages')->where('status', 'reviewed')->update(['status' => 'processing']);
    }

    public function down(): void
    {
        if (!Schema::hasTable('contact_messages')) {
            return;
        }
        // Revert to original enum
        DB::statement("ALTER TABLE contact_messages MODIFY COLUMN status ENUM('pending','reviewed') NOT NULL DEFAULT 'pending'");
    }
};







