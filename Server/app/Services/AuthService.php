<?php

namespace App\Services;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

class AuthService
{

    public function register(array $data): void
    {
        DB::transaction(function () use ($data) {

            $user = new User();
            $user->email = $data['email'];
            $user->password = Hash::make($data['password']);
            $user->save();

            $profile = new Profile();
            $profile->fill([
                'user_id' => $user->id,
                'name' => $data['name'] ?? null,
            ]);
            $profile->save();

            $authProvider = $user->authProviders()->make();
            $authProvider->provider = 'email';
            $authProvider->provider_user_id = $user->email;
            $authProvider->save();

            $user->sendEmailVerificationNotification();
        });
    }


    public function login(array $data): string
    {
        if (! $token = JWTAuth::attempt($data)) {
            throw new \Exception('Invalid credentials');
        }

        $user = JWTAuth::user();

        if (! $user->hasVerifiedEmail()) {
            JWTAuth::invalidate($token);
            throw new \Exception('Email not verified');
        }

        return $token;
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }
}
