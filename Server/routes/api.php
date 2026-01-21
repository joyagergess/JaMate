<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileMediaController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\EmbeddingController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\BandSuggestionController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\AiBackingJobController;
use App\Http\Controllers\TrackAiController;
use App\Http\Controllers\JamController;

Route::prefix('v0.1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware('signed')
            ->name('verification.verify');

        Route::middleware('auth:api')->group(function () {
            Route::post('email/resend', [EmailVerificationController::class, 'resend']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });

    Route::middleware('auth:api')->prefix('profile')->group(function () {
        Route::get('/get', [ProfileController::class, 'get']);
        Route::post('/create', [ProfileController::class, 'create']);
        Route::post('/update', [ProfileController::class, 'update']);
        Route::get('/{profile}', [ProfileController::class, 'show']);
        Route::get('/{profile}/media', [ProfileMediaController::class, 'show']);
        Route::post('/avatar/update', [ProfileMediaController::class, 'updateAvatar']);
    });

    Route::middleware('auth:api')->prefix('profile/media')->group(function () {
        Route::get('/get', [ProfileMediaController::class, 'get']);
        Route::post('/store', [ProfileMediaController::class, 'store']);
        Route::post('/update/{media}', [ProfileMediaController::class, 'update']);
        Route::delete('/destroy/{media}', [ProfileMediaController::class, 'destroy']);
        Route::post('reorder', [ProfileMediaController::class, 'reorder']);
    });
    Route::middleware('auth:api')->get(
        '/profile/{profile}/media',
        [ProfileMediaController::class, 'show']
    );

    Route::middleware('auth:api')->group(function () {
        Route::get('/feed', [FeedController::class, 'index']);
        Route::get('/feed/next', [FeedController::class, 'next']);
        Route::post('/feed/swipe', [FeedController::class, 'swipe']);
    });

    Route::prefix('internal')->middleware('internal.auth')->group(function () {
        Route::post('/embeddings/generate', [EmbeddingController::class, 'generate']);
        Route::post('/bands/generate', [BandSuggestionController::class, 'generate']);
    });

    Route::middleware('auth:api')->prefix('matches')->group(function () {
        Route::get('/get', [MatchController::class, 'index']);
    });

    Route::middleware('auth:api')->get(
        '/media/{path}',
        [MediaController::class, 'stream']
    )->where('path', '.*');


    Route::middleware('auth:api')->prefix('conversations')->group(function () {
        Route::post(
            '/{conversation}/read',
            [ConversationController::class, 'markAsRead']
        );
        Route::post('/{conversation}/rename', [ConversationController::class, 'rename']);
        Route::get('/', [ConversationController::class, 'index']);
        Route::get('/{conversation}/messages', [MessageController::class, 'index']);
        Route::post('/{conversation}/messages', [MessageController::class, 'store']);
    });

    Route::middleware('auth:api')->prefix('bands')->group(function () {
        Route::get('suggestions', [BandSuggestionController::class, 'index']);
        Route::post('suggestions/{suggestion}/accept', [BandSuggestionController::class, 'accept']);
        Route::post('suggestions/{suggestion}/reject', [BandSuggestionController::class, 'reject']);
    });
    Route::post('/tracks/{track}/generate-backing', [
        TrackAiController::class,
        'generateBacking'
    ]);

    Route::middleware('auth:api')->post('/tracks', [TrackController::class, 'store']);
    Route::middleware('auth:api')->get('/tracks', [TrackController::class, 'index']);
    Route::get(
        '/media/{path}',
        [MediaController::class, 'stream']
    )->where('path', '.*');

    Route::middleware('auth:api')->get(
        '/ai-backing-jobs/{job}',
        [AiBackingJobController::class, 'show']
    );
    Route::middleware('auth:api')->delete(
        '/tracks/{track}',
        [TrackController::class, 'destroy']
    );
    Route::middleware('auth:api')->patch(
        '/tracks/{track}/title',
        [TrackController::class, 'updateTitle']
    );
    Route::middleware('auth:api')->post(
        '/jams/analyze',
        [JamController::class, 'analyze']
    );
});
