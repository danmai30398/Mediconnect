<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\MediUser;
use App\Models\ContactMessage;
use App\Models\Content;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalDoctors = Doctor::count();
        $totalPatients = Patient::count();
        // Tính số lịch hẹn hôm nay dựa trên slot lịch có ngày hôm nay
        $todayAppointments = DB::table('appointments')
            ->join('availability_schedulings', 'appointments.availability_id', '=', 'availability_schedulings.availability_id')
            ->whereDate('availability_schedulings.available_date', now()->toDateString())
            ->count();

        return response()->json([
            'total_doctors' => $totalDoctors,
            'total_patients' => $totalPatients,
            'today_appointments' => $todayAppointments,
        ]);
    }

    public function recentActivities()
    {
        try {
            $activities = collect();

            // Skip user activities - not needed in Recent Activities
            $recentUsers = collect();

            // Recent appointments - limit to 2 to avoid duplicates
            $recentAppointments = collect();
            try {
                $recentAppointments = Appointment::with(['patient', 'availability.doctor'])
                    ->orderBy('created_at', 'desc')
                    ->limit(2)
                    ->get()
                    ->map(function ($appointment) {
                        $patientName = $appointment->patient ? $appointment->patient->name : 'Unknown Patient';
                        return [
                            'type' => 'appointment_booking',
                            'message' => "New appointment booked by {$patientName}",
                            'time' => $appointment->created_at,
                            'icon' => 'fas fa-calendar-plus',
                            'color' => 'primary'
                        ];
                    });
            } catch (\Exception $e) {
                Log::error('Error fetching appointments: ' . $e->getMessage());
            }

            // Recent contact messages
            $recentMessages = collect();
            try {
                $recentMessages = ContactMessage::orderBy('created_at', 'desc')
                    ->limit(2)
                    ->get()
                    ->map(function ($message) {
                        return [
                            'type' => 'contact_message',
                            'message' => "New contact message from {$message->name}",
                            'time' => $message->created_at,
                            'icon' => 'fas fa-envelope',
                            'color' => 'info'
                        ];
                    });
            } catch (\Exception $e) {
                Log::error('Error fetching messages: ' . $e->getMessage());
            }

            // Recent content activities (both created and updated)
            $recentContents = collect();
            try {
                // Get recent content activities - prioritize updates over creations
                $recentContents = Content::where('created_at', '>=', now()->subDays(7))
                    ->orderBy('updated_at', 'desc')
                    ->limit(2)
                    ->get()
                    ->map(function ($content) {
                        // Check if this is an update (updated_at > created_at) or creation
                        $isUpdate = $content->updated_at > $content->created_at;
                        
                        return [
                            'type' => $isUpdate ? 'content_updated' : 'content_created',
                            'message' => $isUpdate 
                                ? "Medical content updated: {$content->title}"
                                : "New medical content published: {$content->title}",
                            'time' => $isUpdate ? $content->updated_at : $content->created_at,
                            'icon' => $isUpdate ? 'fas fa-edit' : 'fas fa-file-medical',
                            'color' => $isUpdate ? 'info' : 'warning'
                        ];
                    });
            } catch (\Exception $e) {
                Log::error('Error fetching content: ' . $e->getMessage());
            }

            // Merge all activities and sort
            $allActivities = collect();
            $allActivities = $allActivities->merge($recentUsers);
            $allActivities = $allActivities->merge($recentAppointments);
            $allActivities = $allActivities->merge($recentMessages);
            $allActivities = $allActivities->merge($recentContents);

            // Convert all times to Carbon objects first, then sort
            $activities = $allActivities
                ->map(function($activity) {
                    try {
                        $time = $activity['time'];
                        if (is_string($time)) {
                            // Normalize time format
                            $normalized = str_replace(['T', 'Z'], ' ', $time);
                            $normalized = preg_replace('/\.\d+/', '', $normalized); // Remove microseconds
                            $activity['time'] = \Carbon\Carbon::parse($normalized);
                        } else {
                            $activity['time'] = \Carbon\Carbon::now();
                        }
                    } catch (\Exception $e) {
                        $activity['time'] = \Carbon\Carbon::now();
                    }
                    return $activity;
                })
                ->sortByDesc('time')
                ->take(8)
                ->values();

            return response()->json($activities);
        } catch (\Exception $e) {
            Log::error('Error in recentActivities: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    public function notifications()
    {
        try {
            // Lấy TẤT CẢ appointments mới nhất - đơn giản hóa
            $notifications = collect();
            
            try {
                $appointments = Appointment::with(['patient', 'availability.doctor'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get();
                
                $notifications = $appointments->map(function ($appointment) {
                    $patientName = $appointment->patient ? $appointment->patient->name : 'Unknown Patient';
                    $doctorName = $appointment->availability && $appointment->availability->doctor 
                        ? $appointment->availability->doctor->name 
                        : 'Unknown Doctor';
                    
                    $statusMessages = [
                        'pending' => "New appointment booking from {$patientName} with Dr. {$doctorName}",
                        'confirmed' => "Appointment confirmed: {$patientName} with Dr. {$doctorName}",
                        'cancelled_by_patient' => "Appointment cancelled by patient: {$patientName}",
                        'cancelled_by_doctor' => "Appointment cancelled by doctor: Dr. {$doctorName}",
                        'rescheduled' => "Appointment rescheduled by {$patientName}",
                        'completed' => "Appointment completed: {$patientName} with Dr. {$doctorName}"
                    ];
                    
                    $statusIcons = [
                        'pending' => 'fas fa-calendar-plus',
                        'confirmed' => 'fas fa-check-circle',
                        'cancelled_by_patient' => 'fas fa-calendar-times',
                        'cancelled_by_doctor' => 'fas fa-calendar-times',
                        'rescheduled' => 'fas fa-calendar-alt',
                        'completed' => 'fas fa-check-double'
                    ];
                    
                    $statusColors = [
                        'pending' => 'primary',
                        'confirmed' => 'success',
                        'cancelled_by_patient' => 'danger',
                        'cancelled_by_doctor' => 'danger',
                        'rescheduled' => 'warning',
                        'completed' => 'success'
                    ];
                    
                    return [
                        'type' => 'appointment_' . $appointment->status,
                        'message' => $statusMessages[$appointment->status] ?? "Appointment: {$appointment->status}",
                        'time' => $appointment->created_at,
                        'icon' => $statusIcons[$appointment->status] ?? 'fas fa-calendar',
                        'color' => $statusColors[$appointment->status] ?? 'info',
                        'action_url' => '/admin/appointments'
                    ];
                });
            } catch (\Exception $e) {
                Log::error('Error fetching notifications: ' . $e->getMessage());
            }

            // Sort by time and take only the 5 most recent
            $notifications = $notifications
                ->sortByDesc(function($notification) {
                    // Convert all time formats to Carbon for proper sorting
                    $time = $notification['time'];
                    if (is_string($time)) {
                        return \Carbon\Carbon::parse($time)->timestamp;
                    }
                    return 0;
                })
                ->take(5)
                ->values();

            return response()->json($notifications);
        } catch (\Exception $e) {
            Log::error('Error in notifications: ' . $e->getMessage());
            return response()->json([]);
        }
    }
}