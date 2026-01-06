<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\ProfileController;


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

    Route::middleware('auth:api') ->prefix('profile')->group(function () {
            Route::get('get', [ProfileController::class, 'get']);
            Route::post('create', [ProfileController::class, 'create']);
            Route::post('update', [ProfileController::class, 'update']);
            Route::post('delete', [ProfileController::class, 'delete']);
        });
});
