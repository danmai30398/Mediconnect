<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Ha Noi','Ho Chi Minh','Da Nang','Can Tho'];
        foreach ($names as $n) {
            City::firstOrCreate(['city_name' => $n], ['city_name' => $n]);
        }
    }
}
