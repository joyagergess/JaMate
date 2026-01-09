<?php 
namespace App\Services;

use App\Models\Profile;
use App\Models\Conversation;
use App\Models\Message;

class ConversationService
{
    public function listForProfile(Profile $profile)
    {
        return Conversation::query()
            ->whereHas('participants', function ($q) use ($profile) {
                $q->where('profile_id', $profile->id);
            })

            ->with([
                'participants.profile.media',
                'messages' => function ($q) {
                     $q->orderByDesc('sent_at')->limit(1);
                },
            ])

            ->orderByDesc(
                Message::select('sent_at')
                    ->whereColumn(
                        'messages.conversation_id',
                        'conversations.id'
                    )
                    ->latest()
                    ->limit(1)
            )

            ->get();
    }
}
