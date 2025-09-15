<?php

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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('doctors', ViewDoctorsController::class);
Route::apiResource('user', UserController::class);

// contact-messages
Route::apiResource('contact-messages', ContactMessageController::class);
Route::post('login', [UserController::class, 'login']);
