<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\Conversation;
use App\Models\Message;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ConversationService
{

    public function listForProfile(Profile $profile)
    {
        return Conversation::query()
            ->whereHas(
                'participants',
                fn($q) =>
                $q->where('profile_id', $profile->id)
            )
            ->with([
                'participants.profile.media',
                'messages' => fn($q) =>
                $q->orderByDesc('sent_at')->limit(1),
            ])
            ->withCount([
                'messages as unread_count' => function ($q) use ($profile) {
                    $q->whereColumn(
                        'messages.conversation_id',
                        'conversations.id'
                    )
                        ->where('sender_profile_id', '!=', $profile->id)
                        ->where('sent_at', '>', function ($sub) use ($profile) {
                            $sub->select('last_read_at')
                                ->from('conversation_participants')
                                ->whereColumn(
                                    'conversation_participants.conversation_id',
                                    'messages.conversation_id'
                                )
                                ->where('profile_id', $profile->id);
                        });
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
    public function markAsRead(Conversation $conversation, Profile $profile): void
    {
        $conversation->participants()
            ->where('profile_id', $profile->id)
            ->update([
                'last_read_at' => now(),
            ]);
    }

    public function renameConversation(
        Conversation $conversation,
        Profile $profile,
        string $name
    ): Conversation {
        $isParticipant = $conversation->participants()
            ->where('profile_id', $profile->id)
            ->exists();

        if (! $isParticipant) {
            throw new HttpException(403, 'Not a conversation participant');
        }

        if (strlen($name) > 100) {
            throw new HttpException(422, 'Conversation name too long');
        }

        $conversation->update([
            'name' => $name,
        ]);

        return $conversation->fresh();
    }
}
