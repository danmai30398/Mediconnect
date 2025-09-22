<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Doctor;
use App\Models\MediUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User as LaravelUser;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roleMap = [1 => 'Admin', 2 => 'Doctor', 3 => 'Patient'];
        $mediUsers = MediUser::with(['doctor', 'patient'])->get()->map(function ($u) {
            return [
                'source' => 'medi_users',
                'user_id' => $u->user_id,
                'username' => $u->username,
                'role_id' => $u->role_id,
                'role_label' => match ((int) ($u->role_id ?? 0)) { 1 => 'Admin', 2 => 'Doctor', 3 => 'Patient', default => null},
                'email' => $u->doctor?->email ?? $u->patient?->email ?? $u->email ?? null,
                'name' => $u->doctor?->name ?? $u->patient?->name ?? null,
                'phone' => $u->doctor?->phone ?? $u->patient?->phone ?? null,
                'address' => $u->patient?->address ?? null,
                'is_active' => $u->is_active ?? true,
                'locked_until' => $u->locked_until,
            ];
        });

        $laravelUsers = \App\Models\User::query()->get()->map(function ($u) {
            return [
                'source' => 'users',
                'id' => $u->id,
                'username' => $u->name,
                'role_id' => isset($u->role_id) ? $u->role_id : null,
                'role_label' => match ((int) ($u->role_id ?? 0)) { 1 => 'Admin', 2 => 'Doctor', 3 => 'Patient', default => null},
                'email' => $u->email,
                'name' => $u->name,
                'is_active' => isset($u->is_active) ? (bool) $u->is_active : true,
            ];
        });

        $all = $mediUsers->concat($laravelUsers)->values();

        return response()->json($all);
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
                'role_id' => 3,
            ]);

            //2. Create profile
            $user->patient()->create($validated['profile']);
        });

        return response()->json(['message' => 'Create a user successfully']);
    }


    public function insert(Request $request)
    {
        //create and store 
        $validated = $request->validate([
            'username' => 'required|string|unique:medi_users,username',
            'password' => 'required|string|min:6',
            'role' => 'required|int',
        ]);

        DB::transaction(function () use ($validated) {
            //  Create user
            $user = MediUser::create([
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'role_id' => $validated['role'],
            ]);

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
        if ($user->doctor === null) {
            $user = MediUser::with('patient')->find($id);
            // Log::info('patient: ' . $user);
        }

        // Log::info('Patient image path:', [$user->patient->image]);

        $user->makeHidden(['password']);

        return response()->json([
            'user' => $user,
            'image' => asset(Storage::url($user->patient->image)),
        ]);

        // return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            Log::info('User update request', [
                'id' => $id,
                'method' => $request->method(),
                'all_data' => $request->all(),
                'query_source' => $request->query('source'),
                'input_source' => $request->input('source'),
                'is_active_raw' => $request->input('is_active'),
                'is_active_type' => gettype($request->input('is_active')),
                'has_is_active' => $request->has('is_active')
            ]);

            // Allow updating Laravel users table too when source=users
            if ($request->query('source') === 'users' || $request->input('source') === 'users') {
                $u = \App\Models\User::findOrFail($id);
                $validated = $request->validate([
                    'name' => 'sometimes|string|max:255',
                    'email' => 'sometimes|email|max:255|unique:users,email,' . $u->id,
                    'password' => 'sometimes|string|min:6',
                    'role_id' => 'nullable|integer',
                    'is_active' => 'nullable|boolean',
                ]);
                if (isset($validated['name']))
                    $u->name = $validated['name'];
                if (isset($validated['email']))
                    $u->email = $validated['email'];
                if (isset($validated['password']))
                    $u->password = Hash::make($validated['password']);
                if (isset($validated['role_id']))
                    $u->role_id = (int) $validated['role_id'];
                if ($request->has('is_active')) {
                    $u->is_active = $request->input('is_active') === null ? null : (bool) $request->boolean('is_active');
                }
                $u->save();
                return response()->json(['message' => 'Cập nhật user (users) thành công']);
            }

            $user = MediUser::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'username' => 'sometimes|string|unique:medi_users,username,' . $user->user_id . ',user_id',
                'password' => 'sometimes|string|min:6',
                'role_id' => 'sometimes|in:1,2,3',
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255',
                'is_active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                Log::error('User update validation failed', [
                    'errors' => $validator->errors(),
                    'input_data' => $request->all()
                ]);
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $validated = $validator->validated();

            return DB::transaction(function () use ($user, $validated, $request) {
                Log::info('Starting user update transaction', [
                    'user_id' => $user->user_id,
                    'validated_data' => $validated
                ]);

                // Update base user
                if (isset($validated['username']))
                    $user->username = $validated['username'];
                if (isset($validated['password']))
                    $user->password = Hash::make($validated['password']);
                if (isset($validated['role_id']))
                    $user->role_id = (int) $validated['role_id'];
                if ($request->has('is_active')) {
                    $user->is_active = $request->input('is_active') === null ? null : (bool) $request->boolean('is_active');
                }
                $user->save();

                Log::info('User base updated', [
                    'user_id' => $user->user_id,
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'is_active' => $user->is_active
                ]);

                // Handle profile updates
                if ($user->doctor) {
                    if (isset($validated['name']))
                        $user->doctor->name = $validated['name'];
                    if (isset($validated['email']))
                        $user->doctor->email = $validated['email'];
                    $user->doctor->save();
                } else if ($user->patient) {
                    if (isset($validated['name']))
                        $user->patient->name = $validated['name'];
                    if (isset($validated['email']))
                        $user->patient->email = $validated['email'];
                    $user->patient->save();
                }

                return response()->json(['message' => 'Cập nhật user thành công']);
            });

        } catch (\Exception $e) {
            Log::error('User update error: ' . $e->getMessage(), [
                'id' => $id,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to update user: ' . $e->getMessage()], 500);
        }
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
        // 1) Ưu tiên đăng nhập tài khoản admin (bảng users) khi cung cấp email
        if ($request->filled('email')) {
            $userLaravel = LaravelUser::where('email', $request->email)->first();
            if ($userLaravel) {
                if (isset($userLaravel->is_active) && !$userLaravel->is_active) {
                    return response()->json(['message' => 'Your account has been deactivated.'], 423);
                }
                if (!Hash::check($request->password, $userLaravel->password)) {
                    return response()->json(['message' => 'Invalid credentials'], 401);
                }
                $role = $userLaravel->role_id ?? 1;
                Log::info("Login API - User: {$userLaravel->email}, Role ID from DB: {$userLaravel->role_id}, Final Role: {$role}");
                $token = $userLaravel->createToken('auth_token')->plainTextToken;
                return response()->json([
                    'status' => 'success',
                    'token' => $token,
                    'user' => [
                        'id' => $userLaravel->id,
                        'role_id' => $role,
                    ]
                ]);
            }
        }

        // 2) MediUser: tìm qua email/phone trong hồ sơ hoặc username
        $user = MediUser::whereHas('patient', function ($query) use ($request) {
            $query->where('email', $request->email)
                ->orWhere('phone', $request->phone);
            ;
        })->orwhereHas('doctor', function ($query) use ($request) {
            $query->where('email', $request->email)
                ->orWhere('phone', $request->phone);
            ;
        })
            ->with(['patient', 'doctor'])
            ->first();

        // Fallback: allow admin (or any user) login by username when no profile match
        if (!$user && ($request->filled('email') || $request->filled('phone') || $request->filled('username'))) {
            $loginIdentifier = $request->username ?? $request->email ?? $request->phone;
            $user = MediUser::where('username', $loginIdentifier)->first();
        }

        if ($user) {
            if (isset($user->is_active) && $user->is_active === 0) {
                return response()->json(['message' => 'Your account has been deactivated.'], 423);
            }
            // Kiểm tra tài khoản có đang bị khoá không
            if ($user->locked_until) {
                // Tự động unlock nếu đã hết thời gian khóa
                if (now()->gte($user->locked_until)) {
                    $user->login_attempts = 0;
                    $user->locked_until = null;
                    $user->save();
                    Log::info('Account automatically unlocked', [
                        'user_id' => $user->user_id,
                        'username' => $user->username
                    ]);
                } else {
                    // Vẫn còn thời gian khóa
                    $remainingMinutes = now()->diffInMinutes($user->locked_until);
                    return response()->json([
                        'message' => "Your account has been locked. Please wait {$remainingMinutes} minutes or contact admin for support."
                    ], 423);
                }
            }

            if (!Hash::check($request->password, $user->password)) {
                // Sai mật khẩu, tăng login_attempts
                $user->login_attempts = ($user->login_attempts ?? 0) + 1;

                if ($user->login_attempts >= 5) {
                    // Khoá tài khoản 5 phút
                    $user->locked_until = now()->addMinutes(5);
                }

                $user->save();

                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Đăng nhập thành công, reset login_attempts
            $user->login_attempts = 0;
            $user->locked_until = null;
            $user->save();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'token' => $token,
                'user' => [
                    'id' => $user->user_id,
                    'name' => $user->doctor?->name ?? $user->patient?->name ?? $user->username,
                    'email' => $user->doctor?->email ?? $user->patient?->email ?? null,
                    'role_id' => $user->role_id,
                ]
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    /**
     * Unlock user account (Admin only)
     */
    public function unlock(Request $request, $id)
    {
        try {
            $user = MediUser::find($id);
            
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Reset lock status
            $user->login_attempts = 0;
            $user->locked_until = null;
            $user->save();

            Log::info('User account unlocked by admin', [
                'user_id' => $id,
                'username' => $user->username
            ]);

            return response()->json([
                'message' => 'Account unlocked successfully',
                'user' => [
                    'id' => $user->user_id,
                    'username' => $user->username,
                    'locked_until' => null,
                    'login_attempts' => 0
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Unlock user error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to unlock account'], 500);
        }
    }

    public function checkUsername(Request $request)
    {
        $exists = MediUser::whereRaw('BINARY username = ?', [$request->username])->exists();
        $id = MediUser::where('user_id', $request->userId)
            ->whereRaw('BINARY username = ?', [$request->username])->first();

        if ($id != null) {
            return response()->json(['exists' => false]);
        } else {
            return response()->json(['exists' => $exists]);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            Log::info('Me API called', [
                'user_type' => get_class($user),
                'user_id' => $user->id ?? $user->user_id ?? 'unknown'
            ]);

            // Handle MediUser
            if ($user instanceof MediUser) {
                $user->load(['doctor', 'patient']);

                return response()->json([
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'doctor' => $user->doctor ? [
                        'id' => $user->doctor->doctor_id,
                        'name' => $user->doctor->name,
                        'email' => $user->doctor->email,
                        'phone' => $user->doctor->phone,
                        'specialization' => $user->doctor->specialization,
                        'experience' => $user->doctor->experience,
                        'qualification' => $user->doctor->qualification,
                        'gender' => $user->doctor->gender,
                        'dob' => $user->doctor->dob,
                        'image' => $user->doctor->image,
                        'description' => $user->doctor->description,
                        'city' => $user->doctor->city
                    ] : null,
                    'patient' => $user->patient ? [
                        'id' => $user->patient->patient_id,
                        'name' => $user->patient->name,
                        'email' => $user->patient->email,
                        'phone' => $user->patient->phone,
                        'address' => $user->patient->address,
                        'gender' => $user->patient->gender,
                        'dob' => $user->patient->dob,
                        'image' => $user->patient->image
                    ] : null
                ]);
            }

            // Handle Laravel User (Admin)
            return response()->json([
                'username' => $user->name,
                'role_id' => $user->role_id ?? 1,
                'email' => $user->email,
                'doctor' => null,
                'patient' => null
            ]);
        } catch (\Exception $e) {
            Log::error('Error in me API: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get current authenticated doctor
     */
    public function me_doctor(Request $request)
    {
        $mediUser = $request->user();
        $doctor = Doctor::where('user_id', $mediUser->user_id)->with('city')->first();

        return response()->json($doctor);
    }

    /**
     * Get available cities for registration
     */
    public function getCities()
    {
        $cities = City::all();
        return response()->json($cities);
    }

    public function updatePatient(Request $request, string $id)
    {
        // Log::info($request->all());
        // Log::info('=== API UPDATE USER ===');
        // Log::info('REQUEST all:', $request->all());
        // Log::info('FILES:', $request->allFiles());
        $user = MediUser::with('patient')->findOrFail($id);

        $data = $request->except(['patient']);

        // check password
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // update bảng patient
        $user->update($data);

        if ($user->patient && $request->has('patient')) {
            $patientData = $request->input('patient');

            // Kiem tra neu co anh moi
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('avatars', 'public');
                $patientData['image'] = $path;
                Log::info('Đã upload ảnh mới: ' . $path);
            }
            $user->patient->update($patientData);
        }
        // Reload relationship to get the newest data
        $user->load('patient');

        return response()->json($user);
    }

    /**
     * Gửi email reset password
     */
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|max:255'
            ]);

            $email = $request->email;
            
            // Tìm user trong bảng users (admin)
            $user = \App\Models\User::where('email', $email)->first();
            
            // Nếu không tìm thấy, tìm trong MediUser
            if (!$user) {
                $mediUser = MediUser::whereHas('patient', function ($query) use ($email) {
                    $query->where('email', $email);
                })->orWhereHas('doctor', function ($query) use ($email) {
                    $query->where('email', $email);
                })->first();
                
                if ($mediUser) {
                    $user = $mediUser;
                }
            }

            if (!$user) {
                return response()->json([
                    'message' => 'Email không tồn tại trong hệ thống'
                ], 404);
            }

            // Tạo reset token
            $resetToken = Str::random(60);
            $expiresAt = now()->addMinutes(10); // Token hết hạn sau 10 phút

            // Lưu token vào cache hoặc database
            cache()->put("password_reset_{$resetToken}", [
                'user_id' => $user->id ?? $user->user_id,
                'email' => $email,
                'type' => $user instanceof \App\Models\User ? 'admin' : 'medi_user'
            ], $expiresAt);

            // Gửi email (trong môi trường thực tế, sử dụng Mail facade)
            // Mail::to($email)->send(new ResetPasswordMail($resetToken));
            
            // Tạm thời log token để test
            Log::info("Reset password token for {$email}: {$resetToken}");

            return response()->json([
                'message' => 'Mã reset password đã được gửi đến email của bạn',
                'token' => $resetToken, // Chỉ để test, trong thực tế không trả về
                'expires_at' => $expiresAt->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Forgot password error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau'
            ], 500);
        }
    }

    /**
     * Reset password với token
     */
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required|string',
                'password' => 'required|string|min:6|confirmed'
            ]);

            $token = $request->token;
            $password = $request->password;

            // Lấy thông tin từ cache
            $resetData = cache()->get("password_reset_{$token}");
            
            if (!$resetData) {
                return response()->json([
                    'message' => 'Token không hợp lệ hoặc đã hết hạn'
                ], 400);
            }

            // Tìm user
            if ($resetData['type'] === 'admin') {
                $user = \App\Models\User::find($resetData['user_id']);
            } else {
                $user = MediUser::find($resetData['user_id']);
            }

            if (!$user) {
                return response()->json([
                    'message' => 'Người dùng không tồn tại'
                ], 404);
            }

            // Cập nhật password
            $user->password = Hash::make($password);
            $user->save();

            // Xóa token khỏi cache
            cache()->forget("password_reset_{$token}");

            return response()->json([
                'message' => 'Mật khẩu đã được đặt lại thành công'
            ]);

        } catch (\Exception $e) {
            Log::error('Reset password error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra, vui lòng thử lại sau'
            ], 500);
        }
    }

}
