<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            // Allow NULL for all optional fields
            $table->string('qualification')->nullable()->change();
            $table->string('specialization')->nullable()->change();
            $table->text('description')->nullable()->change();
            $table->unsignedBigInteger('city_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            // Revert to NOT NULL
            $table->string('qualification')->nullable(false)->change();
            $table->string('specialization')->nullable(false)->change();
            $table->text('description')->nullable(false)->change();
            $table->unsignedBigInteger('city_id')->nullable(false)->change();
        });
    }
};
