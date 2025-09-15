<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Content;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Article 1
        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Understanding Common Diseases',
            'description' => 'An overview of common diseases, their causes, symptoms, and prevention methods.',
            'image'       => 'common_diseases.png',
            'name'        => 'admin',
        ]);

        // ✅ Article 2
        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Managing Chronic Illnesses',
            'description' => 'Guidelines on managing chronic conditions with medication, lifestyle adjustments, and long-term care.',
            'image'       => 'chronic_illness.png',
            'name'        => 'admin',
        ]);

        // ✅ Article 3
        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Infectious Diseases: Causes and Prevention',
            'description' => 'Information on common infectious diseases, how they spread, and preventive measures.',
            'image'       => 'infectious.png',
            'name'        => 'admin',
        ]);

        // ✅ Article 4
        Content::create([
            'category_id' => 1,       
            'created_by'  => 1,      
            'title'       => 'Hướng dẫn đặt lịch khám bệnh',
            'description' => 'Chi tiết cách bệnh nhân có thể đặt lịch thông qua hệ thống.',
            'image'       => null, // Không có ảnh mẫu
            'name'        => 'abc',
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Mental Health Disorders and Support',
            'description' => 'Awareness of common mental health issues, their symptoms, and resources for professional support.',
            'image'       => 'mental_disorders.png',
            'name'        => 'admin',
        ]);
    }
}
