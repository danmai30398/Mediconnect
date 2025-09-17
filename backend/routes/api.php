<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DoctorProfileController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DoctorAvailabilityController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/cities', [AuthController::class, 'getCities']);
Route::get('/available-slots', [BookingController::class, 'getAvailableSlots']);
Route::post('/book-appointment', [BookingController::class, 'bookAppointment']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/doctor/me', [DoctorController::class, 'me']);
    Route::get('/doctor/dashboard', [DoctorController::class, 'dashboard']);
    Route::get('/doctor/patients', [DoctorController::class, 'getPatients']);
    Route::get('/doctor/stats', [DoctorController::class, 'getStats']);
    Route::post('/doctor/avatar', [DoctorController::class, 'uploadAvatar']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('/doctor/update', [DoctorProfileController::class, 'update']);

    // Booking routes
    Route::get('/appointments', [BookingController::class, 'getDoctorAppointments']);
Route::post('/appointments/{appointmentId}/status', [BookingController::class, 'updateAppointmentStatus']);

    // Availability routes
    Route::get('/availability', [DoctorAvailabilityController::class, 'index']);
    Route::post('/availability', [DoctorAvailabilityController::class, 'store']);
    Route::put('/availability/{id}', [DoctorAvailabilityController::class, 'update']);
    Route::delete('/availability/{id}', [DoctorAvailabilityController::class, 'destroy']);
});
