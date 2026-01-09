<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Events\Verified;

class EmailVerificationService
{
    public function verify(Request $request, int $id, string $hash): void
    {
        if (! URL::hasValidSignature($request)) {
            throw new \Exception('Invalid or expired verification link');
        }

        $user = User::findOrFail($id);

        if (! hash_equals(
            sha1($user->getEmailForVerification()),
            $hash
        )) {
            throw new \Exception('Invalid verification hash');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }
    }

    public function resend(User $user): void
    {
        if ($user->hasVerifiedEmail()) {
            throw new \Exception('Email already verified');
        }

        $user->sendEmailVerificationNotification();
    }
}
