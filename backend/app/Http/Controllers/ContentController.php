<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Content;
use Illuminate\Support\Str;


class ContentController extends Controller
{
    // optional: list all categories with generated slug
    public function listCategories()
    {
        return Category::all()->map(fn($c) => [
            'id'   => $c->category_id_int,
            'name' => $c->category_name,
            'slug' => Str::slug($c->category_name),
        ]);
    }

    // Trang 5: posts by category slug (slug ảo từ category_name)
    public function getByCategory(string $slug)
    {
        $slug = strtolower(trim($slug));

        $category = Category::whereRaw('LOWER(TRIM(category_name)) = ?', [$slug])->first();

        
        if (!$category) {
            $category = Category::all()->first(function ($c) use ($slug) {
                return strtolower(\Illuminate\Support\Str::slug($c->category_name)) === $slug;
            });
        }

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $posts = $category->contents()
            ->select('content_id_int', 'title', 'description', 'image', 'created_at', 'updated_at')
            ->orderByDesc('content_id_int')
            ->get();

        return response()->json([
            'category' => [
                'id'   => $category->category_id_int,
                'name' => $category->category_name,
            ],
            'posts' => $posts,
        ]);
    }

    // Trang 6: post detail by id
    public function getPost(int $id)
    {
        $post = Content::select('content_id_int', 'category_id_int', 'title', 'description', 'image', 'created_at', 'updated_at')
            ->find($id);
        if (!$post) return response()->json(['message' => 'Post not found'], 404);
        return response()->json($post);
    }


    public function listJoined()
    {
        $rows = Content::query()
            ->join('categories as cat', 'contents.category_id_int', '=', 'cat.category_id_int')
            ->join('users as u', 'contents.created_by', '=', 'u.user_id_int')
            ->select(
                'contents.content_id_int',
                'contents.title',
                'contents.description',
                'contents.image',
                'cat.category_name',
                'u.name as author_name',
                'u.email as author_email',
                'contents.created_at',
                'contents.updated_at'
            )
            ->orderByDesc('contents.content_id_int')
            ->get();
        return response()->json($rows);
    }
}
