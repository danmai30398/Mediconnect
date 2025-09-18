<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactMessage;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        ContactMessage::create([
            'name'    => 'Nguyen Thi C',
            'email'   => 'ntc@example.com',
            'phone'   => '0909123456',
            'message' => 'I need consultation about booking a medical appointment.',
            'status'  => 'pending', 
        ]);
    }
}
