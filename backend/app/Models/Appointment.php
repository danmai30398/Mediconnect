<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    // Define the associated table
    protected $table = 'appointments';

    // Define the primary key of the table
    protected $primaryKey = 'appointment_id';

    // Specify which fields are mass assignable
    protected $fillable = [
        'patient_id',
        'availability_id',
        'status',
    ];

    //enable default timestamps
    public $timestamps = true;

    /**
     * Each appointment belongs to one patient
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    /**
     * Each appointment belongs to one available time slot
     */
    public function availability()
    {
        return $this->belongsTo(AvailabilityScheduling::class, 'availability_id', 'availability_id');
    }

    //to link from appointment to doctor
    public function doctor()
    {
        return $this->availability?->doctor;
    }

    //to link from appointment to city
    public function city()
    {
        return $this->availability?->doctor?->city;
    }
}
