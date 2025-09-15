<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ViewDoctorsController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Http\Request;
use App\Http\Controllers\ContentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ViewDoctorsController;
use Illuminate\Http\Request;


// content - homepage
Route::get('/categories/{id}/contents', [ContentController::class, 'getByCategory']);
Route::get('/contents/{id}', [ContentController::class, 'show']);
Route::get('/search', [ContentController::class, 'search']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('me', [UserController::class, 'me']);
    Route::post('logout', [UserController::class, 'logout']);
    Route::post('change-password', [UserController::class, 'changePassword']);
    Route::get('doctor/appointments', [DoctorController::class, 'appointments']);
    Route::get('patient/appointments', [PatientController::class, 'appointments']);
    Route::post('patients/{id}/upload-image', [PatientController::class, 'uploadImage']);
    Route::put('patients/{id}/profile', [PatientController::class, 'updateProfile']);
    Route::post('doctors/{id}/upload-image', [DoctorController::class, 'uploadImage']);
    Route::put('doctors/{id}/profile', [DoctorController::class, 'update']);
    
    // Notification routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
});

Route::apiResource('doctors', ViewDoctorsController::class)->only(['index', 'show']);
Route::get('doctors/specializations', [ViewDoctorsController::class, 'specializations']);
Route::apiResource('users', UserController::class);

// Mapping user với profile
Route::post('users/{id}/create-profile', [UserController::class, 'createProfile']);
Route::post('login', [UserController::class, 'login']);
Route::post('users/{id}/unlock', [UserController::class, 'unlock']);
Route::post('contact-messages/{id}/status', [ContactMessageController::class, 'updateStatus']);
// Public read endpoints
Route::apiResource('cities', CityController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('contents', ContentController::class)->only(['index', 'show']);
Route::apiResource('contact-messages', ContactMessageController::class)->only(['index', 'show']);
Route::apiResource('patients', PatientController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
Route::apiResource('appointments', AppointmentController::class)->only(['index', 'show', 'store']);
Route::get('dashboard/stats', [DashboardController::class, 'stats']);
Route::get('dashboard/recent-activities', [DashboardController::class, 'recentActivities']);
Route::get('dashboard/notifications', [DashboardController::class, 'notifications']);
Route::get('availabilities', [AvailabilityController::class, 'index']);

// Admin-protected write endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('doctors', ViewDoctorsController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('cities', CityController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('contact-messages', ContactMessageController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('appointments', AppointmentController::class)->only(['update', 'destroy']);
    Route::post('availabilities', [AvailabilityController::class, 'store']);
    Route::delete('availabilities/{id}', [AvailabilityController::class, 'destroy']);
});

// Temporarily remove auth for contents to test
Route::apiResource('contents', ContentController::class)->only(['store', 'update', 'destroy']);
Route::post('contents/{id}/upload-image', [ContentController::class, 'uploadImage']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('doctors', ViewDoctorsController::class);
Route::apiResource('user', UserController::class);

// contact-messages
Route::apiResource('contact-messages', ContactMessageController::class);
Route::post('login', [UserController::class, 'login']);
