<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ViewDoctorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //liệt kê các thông tin trong bảng user (model UserProfile)
        // return Doctor::all();
        // Lấy tất cả sản phẩm kèm thông tin category
        $doctors = Doctor::with('city')->get();

        return response()->json($doctors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //create sản phẩm và store lại trong db
        return Doctor::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //show chi tiết từng sản phẩm
        $doctors = Doctor::with('city')->findOrFail($id);
        return response()->json($doctors);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //cập nhật thông tin sản phẩm
        $product = Doctor::findOrFail($id);
        $product->update($request->all());
        return $product;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //xoá sản phẩm khỏi db
        Doctor::destroy($id);
        return response()->json(['message'=> 'Deleted successfully']);
    }

   
}
