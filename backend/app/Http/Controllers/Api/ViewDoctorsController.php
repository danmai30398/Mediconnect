<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\MediUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ViewDoctorsController extends Controller
{
    /**
     * Lấy danh sách tất cả bác sĩ
     * Bao gồm thông tin thành phố của từng bác sĩ
     */
    public function index()
    {
        // Lấy tất cả bác sĩ kèm thông tin thành phố
        $doctors = Doctor::with('city')->get();

        return response()->json($doctors);
    }

    /**
     * Lấy danh sách các chuyên khoa y tế
     * Trả về danh sách các chuyên khoa duy nhất từ bác sĩ
     */
    public function specializations()
    {
        $specs = Doctor::whereNotNull('specialization')
            ->distinct()
            ->orderBy('specialization')
            ->pluck('specialization')
            ->values();
        return response()->json($specs);
    }

    /**
     * Tạo bác sĩ mới trong hệ thống
     * Tự động tạo tài khoản MediUser nếu chưa có
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'experience' => 'required|integer|min:0',
            'phone' => 'required|string|max:50|unique:doctors,phone',
            'email' => 'required|email|max:255|unique:doctors,email',
            'specialization' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'dob' => 'required|date',
            'description' => 'nullable|string',
            'city_id' => 'required|integer|exists:cities,city_id',
            'user_id' => 'nullable|integer|exists:medi_users,user_id',
            'image' => 'nullable|image|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $path = Storage::disk('public')->putFile('doctor-images', $request->file('image'));
            $validated['image'] = basename($path);
        }

        // Auto-create MediUser if not provided
        if (empty($validated['user_id'])) {
            $baseUsername = explode('@', $validated['email'])[0] ?? 'doctor';
            $username = $baseUsername;
            $suffix = 1;
            while (MediUser::where('username', $username)->exists()) {
                $username = $baseUsername . $suffix++;
            }
            $user = MediUser::create([
                'username' => $username,
                'password' => Hash::make('doctor123'),
                'role_id'  => 2,
            ]);
            $validated['user_id'] = $user->user_id;
        }

        $doctor = Doctor::create($validated);
        return response()->json($doctor, 201);
    }

    /**
     * Hiển thị thông tin chi tiết của một bác sĩ
     * Bao gồm thông tin thành phố
     */
    public function show(string $id)
    {
        // Lấy thông tin chi tiết bác sĩ kèm thành phố
        $doctors = Doctor::with('city')->findOrFail($id);
        return response()->json($doctors);
    }

    /**
     * Cập nhật thông tin bác sĩ
     * Hỗ trợ upload ảnh đại diện mới
     */
    public function update(Request $request, string $id)
    {
        Log::info('Doctor update request:', [
            'id' => $id,
            'method' => $request->method(),
            'all_data' => $request->all(),
            'has_file' => $request->hasFile('image'),
            'content_type' => $request->header('Content-Type'),
            'form_data' => $request->input()
        ]);
        
        $doctor = Doctor::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'qualification' => 'sometimes|string|max:255',
            'experience' => 'sometimes|integer|min:0',
            'phone' => 'sometimes|string|max:50|unique:doctors,phone,' . $doctor->doctor_id . ',doctor_id',
            'email' => 'sometimes|email|max:255|unique:doctors,email,' . $doctor->doctor_id . ',doctor_id',
            'specialization' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:Male,Female,Other',
            'dob' => 'sometimes|date',
            'description' => 'nullable|string',
            'city_id' => 'sometimes|integer|exists:cities,city_id',
            'user_id' => 'nullable|integer|exists:medi_users,user_id',
            'image' => 'nullable|image|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $path = Storage::disk('public')->putFile('doctor-images', $request->file('image'));
            $validated['image'] = basename($path);
        }

        $doctor->update($validated);
        Log::info('Doctor updated successfully:', [
            'id' => $doctor->doctor_id,
            'name' => $doctor->name,
            'updated_data' => $validated
        ]);
        return response()->json($doctor);
    }

    /**
     * Xóa bác sĩ khỏi hệ thống
     * Xóa cả thông tin bác sĩ và tài khoản liên kết
     */
    public function destroy(string $id)
    {
        // Xóa bác sĩ khỏi database
        Doctor::destroy($id);
        return response()->json(['message'=> 'Deleted successfully']);
    }
}
