<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Content;

class ContentController extends Controller
{
    // Lấy danh sách bài viết theo danh mục
    /*public function getByCategory($id)
    {
        $category = Category::findOrFail($id);
        $contents = $category->contents;

        return response()->json([
            'category' => $category->category_name,
            'contents' => $contents
        ]);
    }*/
    public function getByCategory($id)
    {
        $category = Category::findOrFail($id);
        $contents = $category->contents;

        return response()->json([
            'category' => $category->category_name,
            'contents' => $contents->map(function ($c) {
                return [
                    'id' => $c->content_id,
                    'title' => $c->title,
                    'description' => $c->description,
                    'image' => $c->image,
                    'date' => $c->created_at ? $c->created_at->format('d-m-Y') : null,
                    'author' => $c->created_by,
                ];
            }),
        ]);
    }


    // Lấy chi tiết bài viết
    public function show($id)
    {
        $content = Content::with('category')->findOrFail($id);
        return response()->json($content);
    }

    //Search
   public function search(Request $request)
    {
        $q = $request->input('q');

        $results = Content::where('title', 'like', "%$q%")
            ->orWhere('description', 'like', "%$q%")
            ->orWhere('name', 'like', "%$q%")
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->content_id,
                    'title' => $c->title,
                    'description' => $c->description,
                    'image' => $c->image,
                    'author' => $c->created_by,
                ];
            });

        return response()->json($results);
    }
}
