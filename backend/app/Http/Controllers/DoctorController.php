<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;

class DoctorController extends Controller
{
    
    public function me()
    {
        $doctor = Doctor::with('city')->first(); 

        return response()->json($doctor); 
    }

  
    public function uploadAvatar(Request $request)
    {
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $path = $file->store('avatars', 'public');

            $doctor = Doctor::first(); 
            $doctor->image = "/storage/$path";
            $doctor->save();

            return response()->json([
                'avatar' => $doctor->image
            ]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
