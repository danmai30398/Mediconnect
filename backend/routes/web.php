<?php

use Illuminate\Support\Facades\Route;
// use App\Models\MediUser; //- test

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sse/appointments', function () {
    return response()->stream(function () {
        while (true) {
            $lastUpdate = cache()->get('last_appointment_update');

            echo "data: " . json_encode(['timestamp' => $lastUpdate]) . "\n\n";
            ob_flush();
            flush();

            sleep(2); // mỗi 2 giây gửi 1 lần
        }
    }, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
        'Connection' => 'keep-alive',
    ]);
});
