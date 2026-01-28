<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;

use App\Services\FeedService;
use App\Services\SimilarityService;

use App\Models\Profile;
use App\Models\ProfileMedia;
use App\Models\Swipe;
use App\Models\Instrument;
use App\Models\Genre;
use App\Models\Objective;

class FeedServiceTest extends TestCase
{
    use RefreshDatabase;

    protected FeedService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $similarity = $this->createMock(SimilarityService::class);
        $similarity
            ->method('cosine')
            ->willReturn(0.8);

        $this->service = new FeedService($similarity);
    }



    private function makeFeedEligibleProfile(array $overrides = []): Profile
    {
        $profile = Profile::factory()->create(array_merge([
            'embedding_dirty' => false,
        ], $overrides));

        ProfileMedia::factory()
            ->for($profile)
            ->primary()
            ->create();

        return $profile->load([
            'media',
            'instruments',
            'genres',
            'objectives',
            'embedding',
        ]);
    }

    private function attachSharedRelations(Profile $a, Profile $b): void
    {
        $instrument = Instrument::factory()->create();
        $genre = Genre::factory()->create();
        $objective = Objective::factory()->create();

        $a->instruments()->sync([$instrument->id]);
        $b->instruments()->sync([$instrument->id]);

        $a->genres()->sync([$genre->id]);
        $b->genres()->sync([$genre->id]);

        $a->objectives()->sync([$objective->id]);
        $b->objectives()->sync([$objective->id]);
    }

  
    /** @test */
    public function it_returns_empty_feed_when_no_candidates_exist()
    {
        $me = $this->makeFeedEligibleProfile();

        $feed = $this->service->getFeed($me);

        $this->assertEmpty($feed);
    }

    /** @test */
    public function it_excludes_self_from_feed()
    {
        $me = $this->makeFeedEligibleProfile();

        $feed = $this->service->getFeed($me);

        $this->assertEmpty($feed);
    }

    /** @test */
    public function it_excludes_profiles_with_dirty_embeddings()
    {
        $me = $this->makeFeedEligibleProfile();

        $dirty = Profile::factory()->create([
            'embedding_dirty' => true,
        ]);

        ProfileMedia::factory()
            ->for($dirty)
            ->primary()
            ->create();

        $feed = $this->service->getFeed($me);

        $this->assertEmpty($feed);
    }

    /** @test */
    public function it_returns_valid_candidate_profiles()
    {
        $me = $this->makeFeedEligibleProfile();
        $candidate = $this->makeFeedEligibleProfile();

        $feed = $this->service->getFeed($me);

        $this->assertCount(1, $feed);
        $this->assertEquals($candidate->id, $feed[0]['profile']['id']);
    }

    /** @test */
    public function it_boosts_profiles_that_jammed_me()
    {
        $me = $this->makeFeedEligibleProfile();
        $candidate = $this->makeFeedEligibleProfile();

        Swipe::factory()->create([
            'swiper_profile_id' => $candidate->id,
            'swiped_profile_id' => $me->id,
            'direction' => 'jam',
        ]);

        $feed = $this->service->getFeed($me);

        $this->assertGreaterThan(
            20,
            $feed[0]['score'],
            'Expected jammed-me boost to increase score'
        );
    }

    /** @test */
    public function it_scores_higher_when_profiles_share_relations()
    {
        $me = $this->makeFeedEligibleProfile([
            'experience_level' => 'intermediate',
            'location' => 'Beirut',
        ]);

        $low = $this->makeFeedEligibleProfile();
        $high = $this->makeFeedEligibleProfile([
            'experience_level' => 'intermediate',
            'location' => 'Beirut',
        ]);

        $this->attachSharedRelations($me, $high);

        $feed = collect($this->service->getFeed($me));

        $this->assertEquals(
            $high->id,
            $feed->first()['profile']['id'],
            'Expected shared-relations profile to rank higher'
        );
    }

    /** @test */
    public function it_returns_transformed_profile_payload()
    {
        $me = $this->makeFeedEligibleProfile();
        $candidate = $this->makeFeedEligibleProfile();

        $feed = $this->service->getFeed($me);

        $profile = $feed[0]['profile'];

        $this->assertArrayHasKey('id', $profile);
        $this->assertArrayHasKey('name', $profile);
        $this->assertArrayHasKey('media', $profile);
        $this->assertIsArray($profile['media']);

        $this->assertArrayHasKey('url', $profile['media'][0]);
    }

    /** @test */
    public function it_respects_feed_limit()
    {
        $me = $this->makeFeedEligibleProfile();

        Profile::factory()
            ->count(30)
            ->create(['embedding_dirty' => false])
            ->each(fn ($p) =>
                ProfileMedia::factory()
                    ->for($p)
                    ->primary()
                    ->create()
            );

        $feed = $this->service->getFeed($me, limit: 10);

        $this->assertCount(10, $feed);
    }
}
