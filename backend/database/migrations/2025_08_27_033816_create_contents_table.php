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
          Schema::create('contents', function (Blueprint $table) {
            $table->id('content_id_int');
            $table->unsignedBigInteger('category_id_int');
            $table->unsignedBigInteger('created_by');
            $table->string('title');
            $table->text('description');
            $table->string('image')->nullable();
            $table->foreign('category_id_int')->references('category_id_int')->on('categories');
            $table->foreign('created_by')->references('user_id_int')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
