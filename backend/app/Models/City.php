<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $table = 'cities';

    protected $primaryKey = 'city_id';

    protected $fillable = ['city_name'];

    public $timestamps = false;
    

    public function doctors()
    {
        return $this->hasMany(Doctor::class, 'city_id', 'city_id');
    }
}
