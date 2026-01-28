<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {

    $profile = $user->profile;

    if (! $profile) {
        return false;
    }

    return Conversation::query()
        ->where('id', $conversationId)
        ->whereHas('participants', function ($q) use ($profile) {
            $q->where('profile_id', $profile->id);
        })
        ->exists();
});
