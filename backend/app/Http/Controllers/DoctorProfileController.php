<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use Illuminate\Support\Facades\Storage;

class DoctorProfileController extends Controller
{
    public function update(Request $request)
    {
        \Log::info('✅ Đã vào DoctorProfileController@update');

        $doctor = Doctor::first(); // sau này thay bằng Auth

        $fields = [
            'name', 'email', 'qualification', 'experience',
            'phone', 'specialization', 'gender', 'dob', 'city_id'
        ];

        foreach ($fields as $field) {
            if ($request->filled($field)) {
                $doctor->$field = $request->input($field);
            }
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('avatars', 'public');
            $doctor->image = '/storage/' . $path;
        }

        $doctor->save();

        return response()->json(['message' => 'Doctor updated successfully.']);
    }
}
