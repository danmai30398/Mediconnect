<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title', 
        'message',
        'data',
        'user_id',
        'role_id',
        'is_read',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime'
    ];

    /**
     * Tạo notification cho appointment
     */
    public static function createAppointmentNotification($type, $appointment, $title, $message, $data = [])
    {
        $notificationData = array_merge($data, [
            'appointment_id' => $appointment->id,
            'patient_id' => $appointment->patient_id,
            'doctor_id' => $appointment->availability ? $appointment->availability->doctor_id : null,
            'appointment_date' => $appointment->availability ? $appointment->availability->available_date : null,
            'appointment_time' => $appointment->availability ? $appointment->availability->available_time : null,
        ]);

        // Tạo notification cho Admin (role_id = 1)
        self::create([
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $notificationData,
            'role_id' => 1, // Admin
            'is_read' => false
        ]);

        // Tạo notification cho Doctor (role_id = 2) nếu có doctor
        if ($appointment->availability && $appointment->availability->doctor_id) {
            self::create([
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => $notificationData,
                'role_id' => 2, // Doctor
                'user_id' => $appointment->availability->doctor->user_id,
                'is_read' => false
            ]);
        }

        // Tạo notification cho Patient (role_id = 3)
        if ($appointment->patient_id) {
            $patient = \App\Models\Patient::find($appointment->patient_id);
            if ($patient) {
                self::create([
                    'type' => $type,
                    'title' => $title,
                    'message' => $message,
                    'data' => $notificationData,
                    'role_id' => 3, // Patient
                    'user_id' => $patient->user_id,
                    'is_read' => false
                ]);
            }
        }
    }

    /**
     * Đánh dấu notification đã đọc
     */
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    /**
     * Scope để lấy notifications chưa đọc
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope để lấy notifications theo user
     */
    public function scopeForUser($query, $userId, $roleId = null)
    {
        return $query->where(function($q) use ($userId, $roleId) {
            $q->where('user_id', $userId)
              ->orWhere(function($q2) use ($roleId) {
                  $q2->whereNull('user_id')->where('role_id', $roleId);
              });
        });
    }
}