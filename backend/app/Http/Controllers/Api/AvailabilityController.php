<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AvailabilityScheduling;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $query = AvailabilityScheduling::query();
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->integer('doctor_id'));
        }
        if ($request->has('date')) {
            $query->where('available_date', $request->get('date'));
        }
        return response()->json($query->orderBy('available_time')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|integer|exists:doctors,doctor_id',
            'available_date' => 'required|date',
            'available_time' => 'required|string',
            'status' => 'nullable|string|max:50',
        ]);
        $slot = AvailabilityScheduling::create($validated);
        return response()->json($slot, 201);
    }

    public function destroy(string $id)
    {
        AvailabilityScheduling::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}







