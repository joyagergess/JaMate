<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthService
{
    public function register(array $data): void
    {
        DB::transaction(function () use ($data) {

            $existingUser = User::where('email', $data['email'])->first();

            if ($existingUser && ! $existingUser->hasVerifiedEmail()) {
                $existingUser->sendEmailVerificationNotification();
                return;
            }

            if ($existingUser && $existingUser->hasVerifiedEmail()) {
                throw new \Exception('Email already registered');
            }

            $user = new User();
            $user->email = $data['email'];
            $user->password = Hash::make($data['password']);
            $user->save();

            $authProvider = $user->authProviders()->make();
            $authProvider->provider = 'email';
            $authProvider->provider_user_id = $user->email;
            $authProvider->save();

            $user->sendEmailVerificationNotification();
        });
    }

    public function login(array $data): string
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw new AuthenticationException('Invalid email or password');
        }
        if (! $user->hasVerifiedEmail()) {
            throw new HttpException(403, 'Email not verified');
        }
        return JWTAuth::fromUser($user);
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }
}
