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
         Schema::create('availability_schedulings', function (Blueprint $table) {
            $table->id('availability_id');
            $table->unsignedBigInteger('doctor_id_int');
            $table->date('available_date');
            $table->time('available_time');
            $table->foreign('doctor_id_int')->references('doctor_id_int')->on('doctors')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availability_schedulings');
    }
};
