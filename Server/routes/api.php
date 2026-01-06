<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;

Route::prefix('v0.1')->group(function () {

    Route::prefix('auth')->group(function () {

        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->middleware('signed')->name('verification.verify');

        Route::middleware('auth:api')->group(function () {
            Route::post('email/resend', [EmailVerificationController::class, 'resend']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });
});
