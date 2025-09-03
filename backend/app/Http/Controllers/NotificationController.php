<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('doctor_id', 1) // sau này dùng auth()->id()
            ->latest()
            ->get(['message']);

        return response()->json($notifications);
    }
}
