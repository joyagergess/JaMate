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
            $user = $this->findUserByEmail($data['email']);

            if ($user) {
                $this->handleExistingUserRegistration($user);
                return;
            }
            $user = $this->createUser($data);
            $this->attachEmailAuthProvider($user);
            $this->sendVerificationEmail($user);
        });
    }

    public function login(array $data): string
    {
        $user = $this->findUserByEmail($data['email']);
        $this->ensureUserCanLogin($user, $data['password']);
        
        return JWTAuth::fromUser($user);
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    protected function findUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    protected function handleExistingUserRegistration(User $user): void
    {
        if (! $user->hasVerifiedEmail()) {
            $this->sendVerificationEmail($user);
            return;
        }

        throw new \Exception('Email already registered');
    }

    protected function createUser(array $data): User
    {
        return User::create([
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    protected function attachEmailAuthProvider(User $user): void
    {
        $user->authProviders()->create([
            'provider'          => 'email',
            'provider_user_id'  => $user->email,
        ]);
    }

    protected function sendVerificationEmail(User $user): void
    {
        $user->sendEmailVerificationNotification();
    }

    protected function ensureUserCanLogin(?User $user, string $password): void
    {
        if (! $user || ! Hash::check($password, $user->password)) {
            throw new AuthenticationException('Invalid email or password');
        }

        if (! $user->hasVerifiedEmail()) {
            throw new HttpException(403, 'Email not verified');
        }
    }
}
