<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        City::insert([
            ['city_name' => 'Hanoi'],
            ['city_name' => 'Ho Chi Minh'],
            ['city_name' => 'Da Nang'],
            ['city_name' => 'Can Tho'],
     
        ]);
    }
}
