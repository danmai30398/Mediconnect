<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AvailabilityScheduling extends Model
{
    protected $table = 'availability_schedulings';

    protected $primaryKey = 'availability_id';

    protected $fillable = [
        'doctor_id',
        'available_date',
        'available_time',
    ];

    public $timestamps = false; 

    
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }

    
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'availability_id', 'availability_id');
    }
}
