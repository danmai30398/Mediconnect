<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Content;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'How to Book a Medical Appointment',
            'description' => 'Detailed guide on how patients can book appointments through the system.',
            'image'       => 'guide.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Understanding Your Lab Results',
            'description' => 'A simple explanation of common lab test results and what they mean.',
            'image'       => 'lab_results.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 2,
            'created_by'  => 1,
            'title'       => 'What to Prepare Before Visiting a Doctor',
            'description' => 'Tips on documents and questions to prepare before your appointment.',
            'image'       => 'preparation.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 2,
            'created_by'  => 1,
            'title'       => 'Common Symptoms and When to Seek Help',
            'description' => 'Know when to visit a doctor based on common symptoms you experience.',
            'image'       => 'symptoms.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 3,
            'created_by'  => 1,
            'title'       => 'Benefits of Regular Health Check-ups',
            'description' => 'Why periodic health screenings are important for early detection.',
            'image'       => 'checkup.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 3,
            'created_by'  => 1,
            'title'       => 'Telehealth: The Future of Medical Consultation',
            'description' => 'Explore how virtual consultations are transforming healthcare.',
            'image'       => 'telehealth.png',
            'name'        => 'admin',
        ]);

        // ✅ Thêm bài viết mới - category_id = 1
        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Managing Chronic Illnesses Effectively',
            'description' => 'Tips on medication, lifestyle, and tracking for long-term condition management.',
            'image'       => 'chronic.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Healthy Lifestyle Tips for All Ages',
            'description' => 'General advice to maintain physical and mental health at every life stage.',
            'image'       => 'lifestyle.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Vaccination: Facts and Myths',
            'description' => 'Debunking common misconceptions about vaccines and their safety.',
            'image'       => 'vaccine.png',
            'name'        => 'admin',
        ]);

        Content::create([
            'category_id' => 1,
            'created_by'  => 1,
            'title'       => 'Mental Health Matters: When to Seek Help',
            'description' => 'Recognizing emotional signs and knowing how to seek mental health support.',
            'image'       => 'mental_health.png',
            'name'        => 'admin',
        ]);
    }
}
