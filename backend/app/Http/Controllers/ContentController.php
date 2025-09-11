<?php

namespace App\Http\Controllers;

//use Illuminate\Http\Request;
use App\Models\Category; 
use App\Models\Content;

class ContentController extends Controller
{
     // Lấy danh sách bài viết theo danh mục
    public function getByCategory($id)
    {
        $category = Category::findOrFail($id);
        $contents = $category->contents;

        return response()->json([
            'category' => $category->category_name,
            'contents' => $contents
        ]);
    }

    // Lấy chi tiết bài viết
    public function show($id)
    {
        $content = Content::with('category')->findOrFail($id);
        return response()->json($content);
    }
}
