<?php

namespace App\Http\Controllers;

use App\Services\FeedService;
use App\Services\SwipeService;
use Illuminate\Http\Request;
use App\Http\Requests\Feed\SwipeRequest;
use LogicException;
use InvalidArgumentException;

class FeedController extends Controller
{
    public function __construct(
        protected FeedService $feedService,
        protected SwipeService $swipeService
    ) {}

    public function index(Request $request)
    {
        $profile = $request->user()->profile;

        if (! $profile) {
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

        if (! $profile) {
            return $this->errorResponse('Profile not found', 404);
        }

        return $this->successResponse(
            $this->feedService->next($profile)
        );
    }

    public function swipe(SwipeRequest $request)
    {
        $me = $request->user()->profile;

        if (! $me) {
            return $this->errorResponse('Profile not found', 404);
        }

        try {
            $result = $this->swipeService->swipe(
                $me,
                $request->profile_id,
                $request->direction
            );

            return $this->successResponse($result);
        } catch (LogicException | InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
