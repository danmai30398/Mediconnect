<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $table = 'contact_messages';

    protected $primaryKey = 'message_id';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'status',
    ];

    public $timestamps = false;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;
}
