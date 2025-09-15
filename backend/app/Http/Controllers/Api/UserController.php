<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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
                'role_label' => match((int)($u->role_id ?? 0)) { 1 => 'Admin', 2 => 'Doctor', 3 => 'Patient', default => null },
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
                'role_label' => match((int)($u->role_id ?? 0)) { 1 => 'Admin', 2 => 'Doctor', 3 => 'Patient', default => null },
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
        try {
            Log::info('User store request', [
                'method' => $request->method(),
                'all_data' => $request->all(),
                'content_type' => $request->header('Content-Type')
            ]);
            
            // Tạo tài khoản người dùng mới và lưu vào database
            $validated = $request->validate([
            'username' => 'required|string|unique:medi_users,username',
            'password' => 'required|string|min:6',
            'role_id'  => 'required|in:2,3',
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $created = DB::transaction(function () use ($validated, $request) {
            Log::info('Creating user with data:', $validated);
            
            $user = MediUser::create([
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'role_id'  => $validated['role_id'],
                'email' => $validated['email'],
            ]);

            Log::info('User created successfully:', ['user_id' => $user->user_id, 'username' => $user->username, 'email' => $user->email]);

            // Tự động tạo profile cơ bản
            if ($user->role_id == 2) {
                // Tạo doctor profile với thông tin cơ bản
                $user->doctor()->create([
                    'name' => $validated['name'], // Dùng name thực tế
                    'email' => $validated['email'],
                    'phone' => null,
                    'address' => null,
                    'gender' => 'Other',
                    'dob' => now()->toDateString(),
                    'qualification' => 'Not specified',
                    'experience' => 0,
                    'specialization' => 'General',
                    'description' => '',
                    'city_id' => 1,
                ]);
            } elseif ($user->role_id == 3) {
                // Tạo patient profile với thông tin cơ bản
                $user->patient()->create([
                    'name' => $validated['name'], // Dùng name thực tế
                    'email' => $validated['email'],
                    'phone' => null,
                    'address' => null,
                    'gender' => 'Other',
                    'dob' => now()->toDateString(),
                ]);
            }
            
            return $user;
        });

        return response()->json(['message' => 'Tạo người dùng thành công', 'user' => $created], 201);
        
        } catch (\Exception $e) {
            Log::error('User store error: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to create user: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Support reading from Laravel users table
        if (request()->query('source') === 'users') {
            $u = \App\Models\User::findOrFail($id);
            return response()->json([
                'id' => $u->id,
                'source' => 'users',
                'username' => $u->name,
                'name' => $u->name,
                'email' => $u->email,
                'role_id' => property_exists($u, 'role_id') ? $u->role_id : null,
            ]);
        }

        $u = MediUser::with(['doctor','patient'])->findOrFail($id);
        $profile = $u->doctor ?? $u->patient;
        return response()->json([
            'user_id' => $u->user_id,
            'source' => 'medi_users',
            'username' => $u->username,
            'role_id' => $u->role_id,
            'name' => $profile->name ?? null,
            'email' => $profile->email ?? null,
            'phone' => $profile->phone ?? null,
            'address' => $profile->address ?? null,
        ]);
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
                'input_source' => $request->input('source')
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
            if (isset($validated['name'])) $u->name = $validated['name'];
            if (isset($validated['email'])) $u->email = $validated['email'];
            if (isset($validated['password'])) $u->password = Hash::make($validated['password']);
            if (isset($validated['role_id'])) $u->role_id = (int) $validated['role_id'];
            if ($request->has('is_active')) $u->is_active = (bool) $request->boolean('is_active');
            $u->save();
            return response()->json(['message' => 'Cập nhật user (users) thành công']);
        }

        $user = MediUser::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|string|unique:medi_users,username,' . $user->user_id . ',user_id',
            'password' => 'sometimes|string|min:6',
            'role_id'  => 'sometimes|in:2,3',
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

            // Check role change BEFORE updating user
            $newRoleId = (int) ($validated['role_id'] ?? $user->role_id);
            $oldRoleId = (int) $user->role_id;
            $isRoleChanged = $newRoleId !== $oldRoleId;
            
            Log::info('Role change check', [
                'user_id' => $user->user_id,
                'old_role_id' => $oldRoleId,
                'new_role_id' => $newRoleId,
                'is_role_changed' => $isRoleChanged
            ]);

            // Update base user
            if (isset($validated['username'])) $user->username = $validated['username'];
            if (isset($validated['password'])) $user->password = Hash::make($validated['password']);
            if (isset($validated['role_id'])) $user->role_id = (int) $validated['role_id'];
            if ($request->has('is_active')) $user->is_active = (bool) $request->boolean('is_active');
            $user->save();

            Log::info('User base updated', [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'role_id' => $user->role_id,
                'is_active' => $user->is_active
            ]);

            // Handle profile updates and role changes
            
            // Get existing profile data for migration
            $existingProfile = null;
            if ($user->doctor) {
                $existingProfile = $user->doctor;
            } elseif ($user->patient) {
                $existingProfile = $user->patient;
            }
            
            // If role changed, delete old profile and create new one
            if ($isRoleChanged) {
                // Delete old profile
                if ($user->doctor) {
                    $user->doctor()->delete();
                    Log::info('Deleted old doctor profile', ['user_id' => $user->user_id]);
                }
                if ($user->patient) {
                    $user->patient()->delete();
                    Log::info('Deleted old patient profile', ['user_id' => $user->user_id]);
                }
                
                // Create new profile based on new role
                if ($newRoleId === 2) {
                    // Create doctor profile
                    $doctorData = [
                        'name' => $validated['name'] ?? $existingProfile?->name ?? 'Doctor',
                        'email' => $validated['email'] ?? $existingProfile?->email ?? $user->email,
                        'phone' => $existingProfile?->phone ?? null,
                        'address' => null, // Doctors don't have address
                        'gender' => $existingProfile?->gender ?? 'Other',
                        'dob' => $existingProfile?->dob ?? now()->toDateString(),
                        'qualification' => 'Not specified',
                        'experience' => 0,
                        'specialization' => 'General',
                        'description' => '',
                        'city_id' => 1,
                    ];
                    $user->doctor()->create($doctorData);
                    Log::info('Created new doctor profile after role change', [
                        'user_id' => $user->user_id,
                        'name' => $doctorData['name'],
                        'email' => $doctorData['email']
                    ]);
                } elseif ($newRoleId === 3) {
                    // Create patient profile
                    $patientData = [
                        'name' => $validated['name'] ?? $existingProfile?->name ?? 'Patient',
                        'email' => $validated['email'] ?? $existingProfile?->email ?? $user->email,
                        'phone' => $existingProfile?->phone ?? null,
                        'address' => $existingProfile?->address ?? null,
                        'gender' => $existingProfile?->gender ?? 'Other',
                        'dob' => $existingProfile?->dob ?? now()->toDateString(),
                    ];
                    $user->patient()->create($patientData);
                    Log::info('Created new patient profile after role change', [
                        'user_id' => $user->user_id,
                        'name' => $patientData['name'],
                        'email' => $patientData['email']
                    ]);
                }
            } else {
                // Same role, just update existing profile
                if (isset($validated['name']) || isset($validated['email'])) {
                    $isDoctor = $newRoleId === 2;

                    if ($isDoctor) {
                        $doctor = $user->doctor;
                        if (!$doctor) {
                            $doctor = $user->doctor()->create([
                                'name' => $validated['name'] ?? 'Doctor',
                                'email' => $validated['email'] ?? $user->email,
                                'phone' => null,
                                'address' => null,
                                'gender' => 'Other',
                                'dob' => now()->toDateString(),
                                'qualification' => 'Not specified',
                                'experience' => 0,
                                'specialization' => 'General',
                                'description' => '',
                                'city_id' => 1,
                            ]);
                        } else {
                            if (isset($validated['name'])) $doctor->name = $validated['name'];
                            if (isset($validated['email'])) $doctor->email = $validated['email'];
                            $doctor->save();
                        }
                    } else {
                        $patient = $user->patient;
                        if (!$patient) {
                            $patient = $user->patient()->create([
                                'name' => $validated['name'] ?? 'Patient',
                                'email' => $validated['email'] ?? $user->email,
                                'phone' => null,
                                'address' => null,
                                'gender' => 'Other',
                                'dob' => now()->toDateString(),
                            ]);
                        } else {
                            if (isset($validated['name'])) $patient->name = $validated['name'];
                            if (isset($validated['email'])) $patient->email = $validated['email'];
                            $patient->save();
                        }
                    }
                    
                    Log::info('Profile updated (same role)', [
                        'user_id' => $user->user_id,
                        'is_doctor' => $isDoctor,
                        'name' => $validated['name'] ?? 'not provided',
                        'email' => $validated['email'] ?? 'not provided'
                    ]);
                }
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
        // Xóa tài khoản người dùng khỏi database
        MediUser::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function me(Request $request)
    {
        $authUser = $request->user();
        
        if ($authUser instanceof MediUser) {
            $user = MediUser::with(['patient', 'doctor'])->find($authUser->user_id);
            
            // Format response to match frontend expectations
            return response()->json([
                'id' => $user->user_id,
                'username' => $user->username,
                'role_id' => $user->role_id,
                'patient' => $user->patient ? [
                    'name' => $user->patient->name,
                    'email' => $user->patient->email,
                    'phone' => $user->patient->phone,
                    'address' => $user->patient->address,
                    'dob' => $user->patient->dob,
                    'gender' => $user->patient->gender,
                    'image' => $user->patient->image
                ] : null,
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
                    'description' => $user->doctor->description,
                    'image' => $user->doctor->image,
                    'city' => $user->doctor->city
                ] : null
            ]);
        }
        return response()->json($authUser);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function unlock(string $id)
    {
        $user = MediUser::findOrFail($id);
        $user->login_attempts = 0;
        $user->locked_until = null;
        $user->save();
        return response()->json(['message' => 'User unlocked successfully']);
    }

    public function changePassword(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Validate input
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Check current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['error' => 'Current password is incorrect'], 400);
            }

            // Update password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json(['message' => 'Password changed successfully']);

        } catch (\Exception $e) {
            Log::error('Error changing password: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to change password'], 500);
        }
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
                        'name' => $userLaravel->name,
                        'email' => $userLaravel->email,
                        'role_id' => $role,
                    ]
                ]);
            }
        }

        // 2) MediUser: tìm qua email/phone trong hồ sơ hoặc username
        $user = MediUser::whereHas('patient', function ($query) use ($request) {
            $query->where('email', $request->email)
                ->orWhere('phone', $request->phone);;
        })->orwhereHas('doctor', function ($query) use ($request) {
            $query->where('email', $request->email)
                ->orWhere('phone', $request->phone);;
        })
            ->with(['patient', 'doctor'])
            ->first();

        // Fallback: allow admin (or any user) login by username when no profile match
        if (!$user && ($request->filled('email') || $request->filled('phone') || $request->filled('username'))) {
            $loginIdentifier = $request->username ?? $request->email ?? $request->phone;
            $user = MediUser::where('username', $loginIdentifier)->first();
        }

        // Nếu vẫn không có MediUser phù hợp, đã xử lý users ở trên rồi

        if ($user) {
            if (isset($user->is_active) && $user->is_active === 0) {
                return response()->json(['message' => 'Your account has been deactivated.'], 423);
            }
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

    public function createProfile(Request $request, $id)
    {
        try {
            $user = MediUser::find($id);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'gender' => 'nullable|string|in:Male,Female,Other',
                'dob' => 'nullable|date',
            ]);

            if ($user->role_id == 2) {
                // Tạo doctor profile
                $doctorData = array_merge($validated, [
                    'email' => $user->email,
                    'qualification' => $request->input('qualification', 'Not specified'),
                    'experience' => $request->input('experience', 0),
                    'specialization' => $request->input('specialization', 'General'),
                    'description' => $request->input('description', ''),
                    'city_id' => $request->input('city_id', 1),
                ]);
                
                $user->doctor()->create($doctorData);
                return response()->json(['message' => 'Doctor profile created successfully'], 201);
                
            } elseif ($user->role_id == 3) {
                // Tạo patient profile
                $patientData = array_merge($validated, [
                    'email' => $user->email,
                ]);
                
                $user->patient()->create($patientData);
                return response()->json(['message' => 'Patient profile created successfully'], 201);
            }

            return response()->json(['message' => 'Invalid role for profile creation'], 400);

        } catch (\Exception $e) {
            Log::error('Create profile error: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating profile: ' . $e->getMessage()], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Lấy tất cả sản phẩm kèm thông tin category
        // $patients = MediUser::with('user')->get();

        // return response()->json($patients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //create sản phẩm và store lại trong db
        $validated = $request->validate([
            'username' => 'required|string|unique:medi_users,username',
            'password' => 'required|string|min:6',
            'profile.name' => 'required|string|max:255',
            'profile.phone' => 'nullable|string|max:20|unique:patients,name',
            'profile.email' => 'nullable|email|max:255|unique:patients,email',
            'profile.address' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Tạo user
            $user = MediUser::create([
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'role_id'  => 3,
            ]);

            //2. Tạo profile
            $user->patient()->create($validated['profile']);
        });

        return response()->json(['message' => 'Tạo người dùng thành công']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = MediUser::with('patients')->findOrFail($id);
        return response()->json($user);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //cập nhật thông tin sản phẩm
        $product = MediUser::findOrFail($id);
        $product->update($request->all());
        return $product;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //xoá sản phẩm khỏi db
        MediUser::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }

    /**
     * login by email and password.
     */
    public function login(Request $request)
    {
        $user = MediUser::whereHas('patient', function ($query) use ($request) {
            $query->where('email', $request->email)
            ->orWhere('phone', $request->phone);;
        })->with('patient')->first() ;


        if ($user) {
            // Kiểm tra tài khoản có đang bị khoá không
            if ($user->locked_until && now()->lt($user->locked_until)) {
                return response()->json(['message' => 'Tài khoản bị khoá. Vui lòng thử lại sau.'], 423);
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
                    'username' => $user->username,
                    'name' => $user->patient->name,
                    'address' => $user->patient->address,
                    'phone' => $user->patient->phone,
                    'dob' => $user->patient->dob,
                    'email' => $user->patient->email,
                    'gender' => $user->patient->gender,
                    'image' => $user->patient->image,
                ]
            ]);
        }

            return response()->json(['message' => 'Invalid credentials'], 401);
    }

        
}