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
        Schema::create('medi_users', function (Blueprint $table) {
            $table->id('user_id_int');
            $table->string('username')->unique();
            $table->string('password');
            $table->unsignedBigInteger('role_id_int');
            $table->foreign('role_id_int')->references('role_id_int')->on('roles')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medi_users');
    }
};
