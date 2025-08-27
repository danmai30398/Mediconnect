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
         Schema::create('medical_records', function (Blueprint $table) {
            $table->id('record_id_int');
            $table->unsignedBigInteger('appointment_id_int');
            $table->text('diagnosis');
            $table->text('notes')->nullable();
            $table->dateTime('date');
            $table->foreign('appointment_id_int')->references('appointment_id_int')->on('appointments')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
