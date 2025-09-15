<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        return response()->json(City::orderBy('city_name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'city_name' => 'required|string|max:255|unique:cities,city_name',
        ]);

        $city = City::create($validated);
        return response()->json($city, 201);
    }

    public function show(string $id)
    {
        $city = City::findOrFail($id);
        return response()->json($city);
    }

    public function update(Request $request, string $id)
    {
        $city = City::findOrFail($id);
        $validated = $request->validate([
            'city_name' => 'required|string|max:255|unique:cities,city_name,' . $city->city_id . ',city_id',
        ]);
        $city->update($validated);
        return response()->json($city);
    }

    public function destroy(string $id)
    {
        City::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}


