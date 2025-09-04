<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medi_users', function (Blueprint $table) {
            $table->integer('login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('medi_users', function (Blueprint $table) {
            $table->dropColumn(['login_attempts', 'locked_until']);
        });
    }
};
