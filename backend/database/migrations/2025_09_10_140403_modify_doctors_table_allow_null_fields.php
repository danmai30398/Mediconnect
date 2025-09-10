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
            // Allow NULL for qualification field
            $table->string('qualification')->nullable()->change();
            
            // Allow NULL for experience field
            $table->integer('experience')->nullable()->change();
            
            // Allow NULL for specialization field  
            $table->string('specialization')->nullable()->change();
            
            // Allow NULL for description field
            $table->text('description')->nullable()->change();
            
            // Allow NULL for city_id field
            $table->unsignedBigInteger('city_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            // Revert qualification to NOT NULL
            $table->string('qualification')->nullable(false)->change();
            
            // Revert experience to NOT NULL
            $table->integer('experience')->nullable(false)->change();
            
            // Revert specialization to NOT NULL
            $table->string('specialization')->nullable(false)->change();
            
            // Revert description to NOT NULL
            $table->text('description')->nullable(false)->change();
            
            // Revert city_id to NOT NULL
            $table->unsignedBigInteger('city_id')->nullable(false)->change();
        });
    }
};
