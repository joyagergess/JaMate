<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\FeedService;
use Illuminate\Http\Request;
use App\Http\Requests\Feed\SwipeRequest;
use App\Services\SwipeService;
use App\Models\Profile;

class FeedController extends Controller
{
    public function __construct(
        protected FeedService $feedService,
        protected SwipeService $swipeService
    ) {}

    public function index(Request $request)
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return $this->errorResponse('Profile not found', 404);
        }

        $limit = min($request->integer('limit', 20), 50);

        return $this->successResponse([
            'meta' => [
                'generated_at' => now(),
                'limit' => $limit,
            ],
            'feed' => $this->feedService->getFeed($profile, $limit),
        ]);
    }


    public function next(Request $request)
    {
        $profile = $request->user()->profile;

        return $this->successResponse(
            $this->feedService->next($profile)
        );
    }
    public function swipe(SwipeRequest $request)
    {
        $me = $request->user()->profile;

        if (!$me) {
            return $this->errorResponse('Profile not found', 404);
        }

        $target = Profile::findOrFail($request->profile_id);

        if ($me->id === $target->id) {
            return $this->errorResponse('Cannot swipe yourself', 400);
        }

        $result = $this->swipeService->swipe(
            $me,
            $target,
            $request->direction
        );

        return $this->successResponse($result);
    }
}
