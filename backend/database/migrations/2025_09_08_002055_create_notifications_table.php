<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // appointment_created, appointment_cancelled, appointment_rescheduled
            $table->string('title'); // Tiêu đề thông báo
            $table->text('message'); // Nội dung thông báo
            $table->json('data')->nullable(); // Dữ liệu bổ sung (appointment_id, user_id, etc.)
            $table->integer('user_id')->nullable(); // User nhận thông báo (null = tất cả)
            $table->integer('role_id')->nullable(); // Role nhận thông báo (1=Admin, 2=Doctor, 3=Patient)
            $table->boolean('is_read')->default(false); // Đã đọc chưa
            $table->timestamp('read_at')->nullable(); // Thời gian đọc
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->unsignedBigInteger('patient_id')->nullable();
            $table->unsignedBigInteger('appointment_id')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_read']);
            $table->index(['role_id', 'is_read']);
            $table->index('created_at');

            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
            $table->foreign('patient_id')->references('patient_id')->on('patients')->onDelete('set null');
            $table->foreign('appointment_id')->references('appointment_id')->on('appointments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
