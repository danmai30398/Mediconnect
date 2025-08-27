<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $table = 'contents';

    protected $primaryKey = 'content_id';

    protected $fillable = [
        'category_id',
        'created_by',
        'title',
        'description',
        'image',
    ];

    public $timestamps = false;


    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }


    public function creator()
    {
        return $this->belongsTo(MediUser::class, 'created_by', 'user_id');
    }
}
