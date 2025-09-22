<?php

use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ViewDoctorsController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DoctorAvailabilityController;
use App\Http\Controllers\DoctorProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


// Content - Homepage
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

    // Notification Routes
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
});

Route::get('doctors/specializations', [ViewDoctorsController::class, 'specializations']);

// Mapping User với Profile
Route::post('login', [UserController::class, 'login']);
Route::post('users/{id}/create-profile', [UserController::class, 'createProfile']);
Route::post('users/insert', [UserController::class, 'insert']);
Route::post('users/{id}/unlock', [UserController::class, 'unlock']);
Route::post('contact-messages/{id}/status', [ContactMessageController::class, 'updateStatus']);
// Public read endpoints
Route::apiResource('cities', CityController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('contents', ContentController::class)->only(['index', 'show']);
Route::apiResource('contact-messages', ContactMessageController::class)->only(['index', 'show']);
Route::apiResource('appointments', AppointmentController::class)->only(['index', 'show', 'store']);

// Thêm route patients từ Thuan - CRUD operations cho patients
Route::apiResource('patients', PatientController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
Route::apiResource('users', UserController::class);

Route::get('dashboard/stats', [DashboardController::class, 'stats']);
Route::get('dashboard/recent-activities', [DashboardController::class, 'recentActivities']);
Route::get('dashboard/notifications', [DashboardController::class, 'notifications']);
Route::get('availabilities', [AvailabilityController::class, 'index']);
Route::get('/doctors', [DoctorController::class, 'index']);

// Public - contact form (dan)
Route::post('/contact-messages', [ContactMessageController::class, 'store']);

// Admin-protected Write Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('doctors', ViewDoctorsController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('cities', CityController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('contact-messages', ContactMessageController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::apiResource('appointments', AppointmentController::class)->only(['update', 'destroy']);
    Route::post('availabilities', [AvailabilityController::class, 'store']);
    Route::delete('availabilities/{id}', [AvailabilityController::class, 'destroy']);
});

// Temporarily Remove Auth for Contents to Test
Route::apiResource('contents', ContentController::class)->only(['store', 'update', 'destroy']);
Route::post('contents/{id}/upload-image', [ContentController::class, 'uploadImage']);

//Phan cua Duyen - Start
Route::apiResource('user', UserController::class);
Route::put('update/patient/{id}', [UserController::class, 'updatePatient']);
Route::get('/check-username', [UserController::class, 'checkUsername']);
Route::apiResource('doc', ViewDoctorsController::class);
Route::apiResource('appointments', AppointmentController::class);
Route::get('/appointments/patient/{patient_id}', [AppointmentController::class, 'getByPatient']);
Route::patch('/appointments/reschedule/{id}', [AppointmentController::class, 'reschedule']);

//Phan cua Duyen - End

Route::get('/cities', [UserController::class, 'getCities']);
Route::get('/available-slots', [BookingController::class, 'getAvailableSlots']);
Route::post('/book-appointment', [BookingController::class, 'bookAppointment']);


// ===== FORGOT PASSWORD ROUTES =====
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);

//Dan start
// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/doctor/me', [App\Http\Controllers\DoctorController::class, 'me']);
    Route::get('/doctor/dashboard', [App\Http\Controllers\DoctorController::class, 'dashboard']);
    Route::get('/doctor/patients', [App\Http\Controllers\DoctorController::class, 'getPatients']);
    Route::get('/doctor/stats', [App\Http\Controllers\DoctorController::class, 'getStats']);
    Route::post('/doctor/avatar', [App\Http\Controllers\DoctorController::class, 'uploadAvatar']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('/doctor/update', [DoctorProfileController::class, 'update']);

    // Booking routes
    Route::get('/appointments', [BookingController::class, 'getDoctorAppointments']);
    Route::post('/appointments/{appointmentId}/status', [BookingController::class, 'updateAppointmentStatus']);

    // Availability routes
    Route::get('/doctor/availability', [DoctorAvailabilityController::class, 'index']);
    Route::post('/doctor/availability', [DoctorAvailabilityController::class, 'store']);
    Route::put('/doctor/availability/{id}', [DoctorAvailabilityController::class, 'update']);
    Route::delete('/doctor/availability/{id}', [DoctorAvailabilityController::class, 'destroy']);
});
// Dan end