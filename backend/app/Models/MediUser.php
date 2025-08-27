<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediUser extends Model
{
    protected $table = 'medi_users';

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'username',
        'password',
        'role_id',
    ];

    public $timestamps = false;

    
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

   
    public function doctor()
    {
        return $this->hasOne(Doctor::class, 'user_id', 'user_id');
    }

    
    public function contents()
    {
        return $this->hasMany(Content::class, 'created_by', 'user_id');
    }
}
