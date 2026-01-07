<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProfileSeeder extends Seeder
{
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
        $users = User::all();

        foreach ($users as $user) {
            if ($user->profile) {
                continue;
            }

            $profile = Profile::create([
                'user_id' => $user->id,
                'name' => fake()->name(),
                'username' => fake()->unique()->userName(),
                'bio' => fake()->randomElement($this->bios),
                'location' => fake()->randomElement($this->locations),
                'experience_level' => fake()->randomElement($this->experience),
                'gender' => fake()->randomElement($this->genders),
            ]);

            $profile->instruments()->attach(
                \App\Models\Instrument::inRandomOrder()
                    ->limit(rand(1, 2))
                    ->pluck('id')
            );

            $profile->genres()->attach(
                \App\Models\Genre::inRandomOrder()
                    ->limit(rand(1, 3))
                    ->pluck('id')
            );

            $profile->objectives()->attach(
                \App\Models\Objective::inRandomOrder()
                    ->limit(rand(1, 2))
                    ->pluck('id')
            );

            $profile->media()->create([
                'media_type' => 'image',
                'media_url' => 'https://picsum.photos/seed/' . Str::random(10) . '/400/400',
                'order_index' => 0,
            ]);
        }
    }
}
