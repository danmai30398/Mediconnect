<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Doctor extends Model
{
    // Define the associated table name
    protected $table = 'doctors';

    // Set the primary key column
    protected $primaryKey = 'doctor_id';

    // Define the fields that are mass assignable
    protected $fillable = [
        'name',
        'qualification',
        'experience',
        'phone',
        'email',
        'specialization',
        'gender',
        'dob',
        'image',
        'description',
        'city_id',
        'user_id',
    ];

    //Disable default timestamps
    public $timestamps = false;

    // Auto append computed URL for image in API responses
    protected $appends = ['image_url'];


    //Each doctor belongs to one city
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }

    //Each doctor is linked to one user account
    public function user()
    {
        return $this->belongsTo(MediUser::class, 'user_id', 'user_id');
    }

    //One doctor has many availability schedulings
    public function availabilitySchedulings()
    {
        return $this->hasMany(AvailabilityScheduling::class, 'doctor_id', 'doctor_id');
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }
        $relative = 'doctor-images/' . $this->image;
        if (Storage::disk('public')->exists($relative)) {
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
        // Khi doctor được cập nhật
        static::updated(function ($doctor) {
            // Kiểm tra nếu email thay đổi
            if ($doctor->isDirty('email')) {
                // Đồng bộ email sang bảng medi_users
                $doctor->user->update(['email' => $doctor->email]);
            }
        });

        // Khi doctor được tạo mới
        static::created(function ($doctor) {
            // Nếu có email, đồng bộ sang medi_users
            if ($doctor->email && $doctor->user) {
                $doctor->user->update(['email' => $doctor->email]);
            }
        });
    }
}
