<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    // Lấy danh sách
    public function index()
    {
        return response()->json(ContactMessage::all());
    }

    // Lưu message mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create($data);

        return response()->json($message, 201);
    }

    // Xem chi tiết
    public function show($id)
    {
        return response()->json(ContactMessage::findOrFail($id));
    }

    // Cập nhật trạng thái
    public function update(Request $request, $id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update($request->only('status'));
        return response()->json($message);
    }

    // Xoá
    public function destroy($id)
    {
        ContactMessage::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
