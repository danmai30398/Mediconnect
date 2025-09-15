<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Hà Nội','Hồ Chí Minh','Đà Nẵng','Cần Thơ'];
        foreach ($names as $n) {
            City::firstOrCreate(['city_name' => $n], ['city_name' => $n]);
        }
    }
}
