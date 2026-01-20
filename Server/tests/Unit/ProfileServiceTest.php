<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\ProfileService;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ProfileServiceTest extends TestCase
{
    use RefreshDatabase;

    private ProfileService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ProfileService::class);
    }

    /** @test */
    public function it_creates_a_profile_with_relations()
    {
        $user = User::factory()->create();

        $data = [
            'name' => 'Joya',
            'birth_date' => '2002-01-01',
            'gender' => 'Male',
            'experience_level' => 'Intermediate',
            'location' => 'Beirut',
            'bio' => 'Guitarist and producer',
            'instruments' => [
                ['name' => 'Guitar'],
                ['name' => 'Bass'],
            ],
            'genres' => ['Rock', 'Metal'],
            'objectives' => ['Jam', 'Band'],
        ];

        $profile = $this->service->create($user, $data);

        $this->assertInstanceOf(Profile::class, $profile);
        $this->assertDatabaseHas('profiles', [
            'user_id' => $user->id,
            'name' => 'Joya',
            'embedding_dirty' => true,
        ]);

        $this->assertCount(2, $profile->instruments);
        $this->assertCount(2, $profile->genres);
        $this->assertCount(2, $profile->objectives);
    }

    /** @test */
    public function it_throws_if_profile_already_exists()
    {
        $user = User::factory()->create();
        Profile::factory()->create(['user_id' => $user->id]);

        $this->expectException(HttpException::class);
        $this->expectExceptionCode(409);

        $this->service->create($user, [
            'name' => 'Test',
            'birth_date' => '2000-01-01',
            'gender' => 'male',
            'experience_level' => 'beginner',
            'instruments' => [],
            'genres' => [],
            'objectives' => [],
        ]);
    }

    /** @test */
    public function it_updates_profile_and_sets_embedding_dirty_on_semantic_change()
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'bio' => 'Old bio',
            'embedding_dirty' => false,
        ]);

        $data = [
            'name' => $profile->name,
            'birth_date' => $profile->birth_date,
            'gender' => $profile->gender,
            'experience_level' => $profile->experience_level,
            'bio' => 'New bio', 
            'location' => $profile->location,
            'instruments' => [],
            'genres' => [],
            'objectives' => [],
        ];

        $updated = $this->service->update($user, $data);

        $this->assertTrue($updated->embedding_dirty);
        $this->assertEquals('New bio', $updated->bio);
    }

    /** @test */
    public function it_does_not_reset_embedding_dirty_if_no_semantic_change()
    {
        $user = User::factory()->create();
        $profile = Profile::factory()->create([
            'user_id' => $user->id,
            'embedding_dirty' => true,
        ]);

        $data = [
            'name' => $profile->name,
            'birth_date' => $profile->birth_date,
            'gender' => $profile->gender,
            'experience_level' => $profile->experience_level,
            'bio' => $profile->bio,
            'location' => $profile->location,
            'instruments' => [],
            'genres' => [],
            'objectives' => [],
        ];

        $updated = $this->service->update($user, $data);

        $this->assertTrue($updated->embedding_dirty);
    }

    /** @test */
    public function it_throws_if_updating_non_existing_profile()
    {
        $user = User::factory()->create();

        $this->expectException(HttpException::class);
        $this->expectExceptionCode(404);

        $this->service->update($user, [
            'name' => 'Test',
            'birth_date' => '2000-01-01',
            'gender' => 'male',
            'experience_level' => 'beginner',
            'instruments' => [],
            'genres' => [],
            'objectives' => [],
        ]);
    }
}
