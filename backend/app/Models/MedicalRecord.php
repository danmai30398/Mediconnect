<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    protected $table = 'medical_records';

    protected $primaryKey = 'record_id';

    protected $fillable = [
        'appointment_id',
        'diagnosis',
        'notes',
        'date',
    ];

    public $timestamps = false;

    // Quan hệ với bảng appointments
    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'appointment_id');
    }
}
