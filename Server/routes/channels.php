<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports.
|
*/

/**
 * Private channel for a conversation.
 *
 * Channel name:
 *   private-conversation.{conversationId}
 *
 * Only profiles that are participants in the conversation
 * are allowed to listen.
 */
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    // IMPORTANT:
    // $user is the authenticated User model
    // You are profile-centric, so we must check the profile

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
