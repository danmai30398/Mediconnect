<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //create and store 
        $validated = $request->validate([
            'username' => 'required|string|unique:medi_users,username',
            'password' => 'required|string|min:6',
            'profile.name' => 'required|string|max:255',
            'profile.phone' => 'nullable|string|max:20|unique:patients,name',
            'profile.email' => 'nullable|email|max:255|unique:patients,email',
            'profile.address' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Create user
            $user = MediUser::create([
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'role_id'  => 3,
            ]);

            //2. Create profile
            $user->patient()->create($validated['profile']);
        });

        return response()->json(['message' => 'Create a user successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = MediUser::with('doctor')->find($id);
        // Log::info('doctor: ' . $user);
        if($user->doctor === null){
            $user = MediUser::with('patient')->find($id);
            // Log::info('patient: ' . $user);
        }
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = MediUser::with('doctor')->find($id);
        if($user->doctor === null){
            $user = MediUser::with('patient')->find($id);
        }
        $user->update($request->all());
        return $user;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * login by email and password.
     */
    public function login(Request $request)
    {
        $user = MediUser::whereHas('patient', function ($query) use ($request) {
            $query->where('email', $request->email)
                ->orWhere('phone', $request->phone);;
        })->orwhereHas('doctor', function ($query) use ($request) {
            $query->where('email', $request->email)
                ->orWhere('phone', $request->phone);;
        })
            ->with(['patient', 'doctor'])
            ->first();

        if ($user) {
            // Kiểm tra tài khoản có đang bị khoá không
            if ($user->locked_until && now()->lt($user->locked_until)) {
                return response()->json(['message' => 'Your account has been locked. Please try again later..'], 423);
            }

            if (!Hash::check($request->password, $user->password)) {
                // Sai mật khẩu, tăng login_attempts
                $user->login_attempts = ($user->login_attempts ?? 0) + 1;

                if ($user->login_attempts >= 5) {
                    // Khoá tài khoản 15 phút
                    $user->locked_until = now()->addMinutes(15);
                }

                $user->save();

                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Đăng nhập thành công, reset login_attempts
            $user->login_attempts = 0;
            $user->locked_until = null;
            $user->save();

            // Thực hiện tạo token hoặc session ở đây
            // ...

            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->user_id,
                    'role' => $user->role_id,
                ]
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
}
