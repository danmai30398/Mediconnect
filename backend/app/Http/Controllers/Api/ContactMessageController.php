<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ContactMessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::orderByDesc('message_id')->get()->map(function ($message) {
            return [
                'message_id' => $message->message_id,
                'name' => $message->name,
                'email' => $message->email,
                'phone' => $message->phone,
                'message' => $message->message,
                'status' => $message->status,
                'created_at' => $message->created_at,
                'updated_at' => $message->updated_at
            ];
        });
        
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
            'status' => 'nullable|string|max:50',
        ]);
        $message = ContactMessage::create($validated);
        return response()->json($message, 201);
    }

    public function show(string $id)
    {
        $message = ContactMessage::findOrFail($id);
        return response()->json($message);
    }

    public function update(Request $request, string $id)
    {
        $message = ContactMessage::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'sometimes|string',
            'status' => 'nullable|string|max:50',
        ]);
        $message->update($validated);
        return response()->json($message);
    }

    public function updateStatus(Request $request, string $id)
    {
        try {
            $status = $request->input('status');
            if (!in_array($status, ['pending', 'processing', 'done', 'closed'])) {
                return response()->json(['message' => 'Invalid status'], 400);
            }
            
            $updated = DB::table('contact_messages')
                ->where('message_id', $id)
                ->update(['status' => $status]);
            
            if ($updated === 0) {
                return response()->json(['message' => 'Message not found'], 404);
            }
            
            return response()->json(['message' => 'OK']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Update failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        ContactMessage::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}


