<?php

use Illuminate\Support\Facades\Route;
// use App\Models\MediUser; //- test

Route::get('/', function () {
    return view('welcome');
});

