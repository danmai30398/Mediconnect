<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'doctors';

    protected $primaryKey = 'doctor_id';

    protected $fillable = [
        'name',
        'qualification',
        'experience',
        'phone',
        'email',
        'specialization',
        'gender',
        'dob',
        'city_id',
        'user_id',
    ];

    public $timestamps = false;

    // Quan hệ với City
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }

    // Quan hệ với MediUser
    public function user()
    {
        return $this->belongsTo(MediUser::class, 'user_id', 'user_id');
    }

    // Quan hệ với AvailabilityScheduling
    public function availabilitySchedulings()
    {
        return $this->hasMany(AvailabilityScheduling::class, 'doctor_id', 'doctor_id');
    }
}
