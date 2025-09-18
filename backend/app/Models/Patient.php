<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    // Define the associated table name
    protected $table = 'patients';

    // Set the primary key column
    protected $primaryKey = 'patient_id';

    // Define the fields that are mass assignable
    protected $fillable = [
        'name',
        'address',
        'phone',
        'dob',
        'email',
        'gender',
        'image',
        'user_id',
    ];

    //Disable default timestamps
    public $timestamps = false;

    //Each patient belongs to one user
    public function user()
    {
        return $this->belongsTo(MediUser::class, 'user_id', 'user_id');
    }

    /**
     * One-to-many relationship with appointments table
     * One patient can have many appointments
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'patient_id');
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) return null;
        $relative = 'patient-images/' . $this->image;
        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($relative)) {
            return url('storage/' . $relative);
        }
        return null;
    }

    /**
     * Boot method để thiết lập Model Events
     * Tự động đồng bộ email với bảng medi_users khi có thay đổi
     */
    protected static function booted()
    {
        // Khi patient được cập nhật
        static::updated(function ($patient) {
            // Kiểm tra nếu email thay đổi
            if ($patient->isDirty('email')) {
                // Đồng bộ email sang bảng medi_users
                $patient->user->update(['email' => $patient->email]);
            }
        });

        // Khi patient được tạo mới
        static::created(function ($patient) {
            // Nếu có email, đồng bộ sang medi_users
            if ($patient->email) {
                $patient->user->update(['email' => $patient->email]);
            }
        });
    }
}
