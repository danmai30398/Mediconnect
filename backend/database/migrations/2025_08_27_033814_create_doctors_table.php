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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id('doctor_id_int');
            $table->string('name');
            $table->string('qualification');
            $table->integer('experience');
            $table->string('phone');
            $table->string('email');
            $table->string('specialization');
            $table->string('gender');
            $table->date('dob');
            $table->unsignedBigInteger('city_id_int');
            $table->unsignedBigInteger('user_id_int');
            $table->foreign('city_id_int')->references('city_id_int')->on('cities');
            $table->foreign('user_id_int')->references('user_id_int')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('doctors');
    }
};
