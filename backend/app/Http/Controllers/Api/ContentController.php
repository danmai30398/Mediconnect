<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class ContentController extends Controller
{
    public function index()
    {
        $contents = Content::with(['category', 'creator.doctor', 'creator.patient', 'doctor'])->orderByDesc('content_id')->get();
        return response()->json($contents);
    }

    public function store(Request $request)
    {
        try {
            Log::info('Store content request:', [
                'all' => $request->all(),
                'hasFile' => $request->hasFile('image'),
                'contentType' => $request->header('Content-Type'),
                'method' => $request->method()
            ]);

            $validated = $request->validate([
                'category_id' => 'required|integer|exists:categories,category_id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'nullable|file|image|max:10240', // Tăng lên 10MB
                'name' => 'nullable|string|max:255',
                'doctor_id' => 'nullable|integer|exists:doctors,doctor_id',
            ]);

            // Lấy user hiện tại (MediUser hoặc Laravel User). Ưu tiên MediUser
            $auth = $request->user();
            $creatorId = null;

            if ($auth) {
                $creatorId = method_exists($auth, 'getKey') ? $auth->getKey() : null;
                if ($auth instanceof \App\Models\User) {
                    // map Laravel user id sang medi_users nếu có admin map; nếu không, cho phép null
                    $creatorId = null;
                }
            }

            // Nếu không có auth, dùng user đầu tiên làm mặc định
            if (!$creatorId) {
                $creatorId = \App\Models\MediUser::first()?->user_id ?? 1;
            }

            Log::info('Creator ID determined:', ['creatorId' => $creatorId]);

            // Xử lý upload ảnh
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('content-images', 'public');
                Log::info('Image uploaded:', ['path' => $imagePath]);
            }

            $payload = array_merge($validated, [
                'created_by' => $creatorId,
                'image' => $imagePath
            ]);

            Log::info('Creating content with payload:', $payload);

            $content = Content::create($payload);

            Log::info('Content created successfully:', ['id' => $content->content_id]);

            return response()->json($content, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Content creation error:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Content creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        $content = Content::with(['category', 'creator.doctor', 'creator.patient'])->findOrFail($id);
        return response()->json($content);
    }


    public function update(Request $request, string $id)
    {
        $content = Content::findOrFail($id);

        Log::info('Update content request:', [
            'id' => $id,
            'hasFile' => $request->hasFile('image'),
            'allFiles' => $request->allFiles(),
            'allData' => $request->all(),
            'contentType' => $request->header('Content-Type'),
            'method' => $request->method(),
            'input' => $request->input(),
            'files' => $request->file(),
            '_FILES' => $_FILES
        ]);

        // Validate các field cơ bản
        $validated = $request->validate([
            'category_id' => 'sometimes|integer|exists:categories,category_id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'name' => 'nullable|string|max:255',
            'doctor_id' => 'nullable|integer|exists:doctors,doctor_id',
        ]);

        // Xử lý upload ảnh mới nếu có
        $hasImageFile = $request->hasFile('image') || $request->file('image') || isset($_FILES['image']);

        if ($hasImageFile) {
            Log::info('Processing image upload');

            // Validate ảnh
            $request->validate([
                'image' => 'file|image|max:2048'
            ]);

            // Xóa ảnh cũ nếu có
            if ($content->image && Storage::disk('public')->exists($content->image)) {
                Storage::disk('public')->delete($content->image);
                Log::info('Deleted old image: ' . $content->image);
            }

            // Lưu ảnh mới
            $validated['image'] = $request->file('image')->store('content-images', 'public');
            Log::info('Saved new image: ' . $validated['image']);
        } else {
            Log::info('No image file provided');
        }

        $content->update($validated);

        // Reload để lấy image_url mới
        $content = $content->fresh();

        Log::info('Content updated:', $content->toArray());
        return response()->json($content);
    }

    public function destroy(string $id)
    {
        $content = Content::findOrFail($id);

        // Xóa ảnh nếu có
        if ($content->image && Storage::disk('public')->exists($content->image)) {
            Storage::disk('public')->delete($content->image);
        }

        $content->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function uploadImage(Request $request, string $id)
    {
        $content = Content::findOrFail($id);

        Log::info('Upload image request:', [
            'id' => $id,
            'hasFile' => $request->hasFile('image'),
            'allFiles' => $request->allFiles(),
            '_FILES' => $_FILES
        ]);

        if ($request->hasFile('image')) {
            try {
                // Validate ảnh
                $request->validate([
                    'image' => 'required|file|image|max:10240' // 10MB
                ]);

                // Xóa ảnh cũ nếu có
                if ($content->image && Storage::disk('public')->exists($content->image)) {
                    Storage::disk('public')->delete($content->image);
                    Log::info('Deleted old image: ' . $content->image);
                }

                // Lưu ảnh mới
                $imagePath = $request->file('image')->store('content-images', 'public');
                $content->update(['image' => $imagePath]);

                Log::info('Image uploaded successfully:', ['path' => $imagePath]);

                return response()->json([
                    'message' => 'Image uploaded successfully',
                    'image_url' => $content->fresh()->image_url
                ]);
            } catch (\Exception $e) {
                Log::error('Image upload failed:', ['error' => $e->getMessage()]);
                return response()->json(['error' => 'Image upload failed: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['error' => 'No image file provided'], 400);
    }

    public function getByCategory($id)
    {
        try {
            $category = \App\Models\Category::findOrFail($id);

            $contents = Content::with(['category', 'creator.doctor', 'creator.patient', 'doctor'])
                ->where('category_id', $id)
                ->orderByDesc('content_id')
                ->get();

            return response()->json([
                'category' => $category,
                'contents' => $contents
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching category and contents:', [
                'category_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['message' => 'Failed to fetch data'], 500);
        }
    }

    
     // Dan - Search Global
    public function search(Request $request)
    {
        $query = $request->input('q'); // lấy param ?q=...

        if (!$query) {
            return response()->json([
                'message' => 'Missing search query'
            ], 400);
        }

        $contents = Content::with(['category', 'creator.doctor', 'creator.patient'])
            ->where('title', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->orderByDesc('content_id')
            ->get();

        if ($contents->isEmpty()) {
            return response()->json([
                'message' => 'No content found'
            ], 404);
        }

        return response()->json($contents);
    }
}


