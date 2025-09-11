<?php

use App\Http\Controllers\ContentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DoctorProfileController;

Route::get('/doctor/me', [DoctorController::class, 'me']);
Route::post('/doctor/avatar', [DoctorController::class, 'uploadAvatar']);
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/doctor/update', [DoctorProfileController::class, 'update']);

Route::get('/categories',        [ContentController::class,'listCategories']);     
Route::get('/categories/{slug}', [ContentController::class,'getByCategory']);      
Route::get('/post/{id}',         [ContentController::class,'getPost']);

//content - homepage
Route::get('/categories/{id}/contents', [ContentController::class, 'getByCategory']);
Route::get('/contents/{id}', [ContentController::class, 'show']);