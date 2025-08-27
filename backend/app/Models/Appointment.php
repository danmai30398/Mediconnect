<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';

    protected $primaryKey = 'appointment_id';

    protected $fillable = [
        'patient_id',
        'availability_id',
        'status',
    ];

    public $timestamps = false;

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    public function availability()
    {
        return $this->belongsTo(AvailabilityScheduling::class, 'availability_id', 'availability_id');
    }
}
