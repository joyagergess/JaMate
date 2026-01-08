<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileMediaController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\EmbeddingController;


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
    });

    Route::middleware('auth:api')->prefix('profile/media')->group(function () {
        Route::get('/get', [ProfileMediaController::class, 'get']);
        Route::post('/store', [ProfileMediaController::class, 'store']);
        Route::post('/update/{media}', [ProfileMediaController::class, 'update']);
        Route::delete('/destroy/{media}', [ProfileMediaController::class, 'destroy']);
        Route::post('reorder', [ProfileMediaController::class, 'reorder']);
    });

    Route::middleware('auth:api')->group(function () {
        Route::get('/feed', [FeedController::class, 'index']);
        Route::get('/feed/next', [FeedController::class, 'next']);
        Route::post('/feed/swipe', [FeedController::class, 'swipe']);
    });
    Route::prefix('internal')->middleware('internal.auth')->group(function () {
        Route::post( '/embeddings/generate', [EmbeddingController::class, 'generate'] );
    });
});
