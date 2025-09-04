<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ViewDoctorsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('doctors', ViewDoctorsController::class);
Route::apiResource('user', UserController::class);
Route::post('login', [UserController::class, 'login']);
