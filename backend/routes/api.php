<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DoctorProfileController;

Route::get('/doctor/me', [DoctorController::class, 'me']);
Route::post('/doctor/avatar', [DoctorController::class, 'uploadAvatar']);
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/doctor/update', [DoctorProfileController::class, 'update']);

