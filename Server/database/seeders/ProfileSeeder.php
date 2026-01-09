<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Instrument;
use App\Models\Genre;
use App\Models\Objective;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProfileSeeder extends Seeder
{
    protected int $count = 100;

    protected array $bios = [
        'Guitarist into rock and alternative music, looking to jam and write originals.',
        'Drummer with studio experience, open to live gigs and collaborations.',
        'Singer-songwriter focused on acoustic and indie vibes.',
        'Bass player with a strong groove, into funk, jazz, and fusion.',
        'Pianist with classical background exploring modern pop and film music.',
        'Producer and multi-instrumentalist looking to build a serious band.',
        'Violinist blending classical technique with modern genres.',
        'Jazz saxophonist interested in improvisation and live sessions.',
    ];

    protected array $locations = [
        'Beirut',
        'Jounieh',
        'Byblos',
        'Tripoli',
        'Saida',
    ];

    protected array $experience = [
        'beginner',
        'intermediate',
        'advanced',
    ];

    protected array $genders = [
        'male',
        'female',
    ];

    public function run(): void
    {
        for ($i = 0; $i < $this->count; $i++) {

            // 1️⃣ Create user
            $user = User::create([
                'email'    => fake()->unique()->safeEmail(),
                'password' => bcrypt('password'),
            ]);

            // 2️⃣ Create profile
            $profile = Profile::create([
                'user_id'          => $user->id,
                'name'             => fake()->name(),
                'username'         => fake()->unique()->userName(),
                'bio'              => fake()->randomElement($this->bios),
                'location'         => fake()->randomElement($this->locations),
                'experience_level' => fake()->randomElement($this->experience),
                'gender'           => fake()->randomElement($this->genders),
            ]);

            // 3️⃣ Attach instruments (1–2)
            $profile->instruments()->attach(
                Instrument::inRandomOrder()
                    ->limit(rand(1, 2))
                    ->pluck('id')
            );

            // 4️⃣ Attach genres (1–3)
            $profile->genres()->attach(
                Genre::inRandomOrder()
                    ->limit(rand(1, 3))
                    ->pluck('id')
            );

            // 5️⃣ Attach objectives (1–2)
            $profile->objectives()->attach(
                Objective::inRandomOrder()
                    ->limit(rand(1, 2))
                    ->pluck('id')
            );

            // 6️⃣ Add profile media
            $profile->media()->create([
                'media_type'  => 'image',
                'media_url'   => 'https://picsum.photos/seed/' . Str::random(12) . '/400/400',
                'order_index' => 0,
            ]);
        }
    }
}
