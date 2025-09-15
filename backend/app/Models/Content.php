<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Content extends Model
{
    // Define the associated table name
    protected $table = 'contents';

    // Set the primary key column
    protected $primaryKey = 'content_id';

    // Define the fields that are mass assignable
    protected $fillable = [
        'category_id',
        'created_by',
        'title',
        'description',
        'image',
        'name',
        'doctor_id'
    ];


    //Enable timestamps
    public $timestamps = true;

    // Add image_url accessor
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image && Storage::disk('public')->exists($this->image)) {
            $url = 'http://localhost:8000/storage/' . $this->image;
            // Thêm timestamp và random để tránh cache
            $url .= '?v=' . time() . '&r=' . rand(1000, 9999);
            return $url;
        }
        return null;
    }


    //Each content belongs to one category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    //Each content is created by one user
    public function creator()
    {
        return $this->belongsTo(MediUser::class, 'created_by', 'user_id');
    }

    //Each content can be authored by one doctor
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }
}
