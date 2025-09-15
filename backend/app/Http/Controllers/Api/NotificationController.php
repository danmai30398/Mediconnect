<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Lấy danh sách notifications cho user hiện tại
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Lấy role_id của user
            $roleId = null;
            if ($user instanceof \App\Models\MediUser) {
                $roleId = $user->role_id;
            } elseif (isset($user->role_id)) {
                $roleId = $user->role_id;
            }

            // Lấy user_id
            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;

            // Lấy notifications cho user này
            $notifications = Notification::forUser($userId, $roleId)
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->type,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'data' => $notification->data,
                        'is_read' => $notification->is_read,
                        'read_at' => $notification->read_at,
                        'time' => $notification->created_at,
                        'time_ago' => $notification->created_at->diffForHumans()
                    ];
                });

            return response()->json($notifications);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    /**
     * Đánh dấu notification đã đọc
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;
            $roleId = $user instanceof \App\Models\MediUser ? $user->role_id : $user->role_id;

            $notification = Notification::forUser($userId, $roleId)
                ->where('id', $id)
                ->first();

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            $notification->markAsRead();

            return response()->json(['message' => 'Notification marked as read']);
        } catch (\Exception $e) {
            Log::error('Error marking notification as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark notification as read'], 500);
        }
    }

    /**
     * Đánh dấu tất cả notifications đã đọc
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;
            $roleId = $user instanceof \App\Models\MediUser ? $user->role_id : $user->role_id;

            Notification::forUser($userId, $roleId)
                ->unread()
                ->update([
                    'is_read' => true,
                    'read_at' => now()
                ]);

            return response()->json(['message' => 'All notifications marked as read']);
        } catch (\Exception $e) {
            Log::error('Error marking all notifications as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark all notifications as read'], 500);
        }
    }

    /**
     * Lấy số lượng notifications chưa đọc
     */
    public function unreadCount(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $userId = $user instanceof \App\Models\MediUser ? $user->user_id : $user->id;
            $roleId = $user instanceof \App\Models\MediUser ? $user->role_id : $user->role_id;

            $count = Notification::forUser($userId, $roleId)
                ->unread()
                ->count();

            return response()->json(['count' => $count]);
        } catch (\Exception $e) {
            Log::error('Error getting unread count: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to get unread count'], 500);
        }
    }
}