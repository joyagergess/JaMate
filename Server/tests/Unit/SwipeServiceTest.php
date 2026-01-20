<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Services\SwipeService;
use App\Models\Profile;
use App\Models\Swipe;
use App\Models\MatchModel;
use App\Models\Conversation;
use App\Models\ConversationParticipant;

use LogicException;
use InvalidArgumentException;

class SwipeServiceTest extends TestCase
{
    use RefreshDatabase;

    protected SwipeService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(SwipeService::class);
    }

    /* -------------------------------------------------
     | Guards
     -------------------------------------------------*/

    /** @test */
    public function it_throws_if_user_swipes_themselves()
    {
        $me = Profile::factory()->create();

        $this->expectException(LogicException::class);

        $this->service->swipe($me, $me, 'jam');
    }

    /** @test */
    public function it_throws_on_invalid_direction()
    {
        $me = Profile::factory()->create();
        $other = Profile::factory()->create();

        $this->expectException(InvalidArgumentException::class);

        $this->service->swipe($me, $other, 'like');
    }

    /* -------------------------------------------------
     | Swipe behavior
     -------------------------------------------------*/

    /** @test */
    public function skip_never_creates_match_or_conversation()
    {
        $me = Profile::factory()->create();
        $other = Profile::factory()->create();

        $response = $this->service->swipe($me, $other, 'skip');

        $this->assertFalse($response['matched']);
        $this->assertNull($response['conversation_id']);

        $this->assertDatabaseHas('swipes', [
            'swiper_profile_id' => $me->id,
            'swiped_profile_id' => $other->id,
            'direction' => 'skip',
        ]);

        $this->assertDatabaseCount('matches', 0);
        $this->assertDatabaseCount('conversations', 0);
    }

    /** @test */
    public function first_jam_without_mutual_does_not_match()
    {
        $me = Profile::factory()->create();
        $other = Profile::factory()->create();

        $response = $this->service->swipe($me, $other, 'jam');

        $this->assertFalse($response['matched']);
        $this->assertNull($response['conversation_id']);

        $this->assertDatabaseCount('matches', 0);
        $this->assertDatabaseCount('conversations', 0);
    }

    /** @test */
    public function mutual_jam_creates_match_and_conversation()
    {
        $me = Profile::factory()->create();
        $other = Profile::factory()->create();

        // Other jams me first
        Swipe::factory()->create([
            'swiper_profile_id' => $other->id,
            'swiped_profile_id' => $me->id,
            'direction' => 'jam',
        ]);

        $response = $this->service->swipe($me, $other, 'jam');

        $this->assertTrue($response['matched']);
        $this->assertNotNull($response['conversation_id']);

        $this->assertDatabaseCount('matches', 1);
        $this->assertDatabaseCount('conversations', 1);

        $match = MatchModel::first();
        $conversation = Conversation::first();

        $this->assertEquals($match->id, $conversation->match_id);
    }

    /** @test */
    public function match_is_not_duplicated_on_multiple_mutual_swipes()
    {
        $me = Profile::factory()->create();
        $other = Profile::factory()->create();

        Swipe::factory()->create([
            'swiper_profile_id' => $other->id,
            'swiped_profile_id' => $me->id,
            'direction' => 'jam',
        ]);

        $this->service->swipe($me, $other, 'jam');
        $this->service->swipe($me, $other, 'jam');

        $this->assertDatabaseCount('matches', 1);
        $this->assertDatabaseCount('conversations', 1);
    }

    /** @test */
    public function both_profiles_are_attached_to_conversation()
    {
        $me = Profile::factory()->create();
        $other = Profile::factory()->create();

        Swipe::factory()->create([
            'swiper_profile_id' => $other->id,
            'swiped_profile_id' => $me->id,
            'direction' => 'jam',
        ]);

        $response = $this->service->swipe($me, $other, 'jam');

        $conversationId = $response['conversation_id'];

        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversationId,
            'profile_id' => $me->id,
        ]);

        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversationId,
            'profile_id' => $other->id,
        ]);
    }
}
