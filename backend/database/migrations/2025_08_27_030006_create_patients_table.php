<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('patients', function (Blueprint $table) {
            $table->id('patient_id');
            $table->string('name');
            $table->string('address');
            $table->string('phone');
            $table->date('dob');
            $table->string('email');
            $table->string('gender');
            $table->string('image')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('medi_users')->onDelete('cascade');
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('patients');
    }
};
