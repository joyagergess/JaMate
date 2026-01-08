<?php

namespace App\Services;

use App\Models\Profile;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProfileFinder
{
    public function findOrFail(int $profileId): Profile
    {
        return Profile::findOrFail($profileId);
    }
}
