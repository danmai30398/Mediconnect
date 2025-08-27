<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients';

    protected $primaryKey = 'patient_id';

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

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(MediUser::class, 'user_id', 'user_id');
    }

    
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'patient_id');
    }
}
