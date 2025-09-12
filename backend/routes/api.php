<?php

use App\Http\Controllers\ContentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactMessageController;

// content - homepage
Route::get('/categories/{id}/contents', [ContentController::class, 'getByCategory']);
Route::get('/contents/{id}', [ContentController::class, 'show']);
Route::get('/search', [ContentController::class, 'search']);

// contact-messages
Route::apiResource('contact-messages', ContactMessageController::class);
