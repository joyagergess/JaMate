<?php

namespace App\Services;

use App\Models\Message;
use App\Models\Profile;
use App\Models\Conversation;
use Illuminate\Support\Carbon;
use LogicException;

class MessageService
{
    public function listMessages(
        Conversation $conversation,
        Profile $profile,
        ?string $cursor = null,
        int $limit = 30
    ) {
        $this->ensureParticipant($conversation, $profile);

        $query = $conversation->messages()
            ->with(['senderProfile:id,name'])
            ->orderByDesc('sent_at')
            ->orderByDesc('id')
            ->limit($limit);

        if ($cursor) {
            $query->where('sent_at', '<', Carbon::parse($cursor));
        }

        return $query->get()->reverse()->values();
    }

    public function sendMessage(
        Conversation $conversation,
        Profile $profile,
        array $data
    ) {
        $this->ensureParticipant($conversation, $profile);

        if (
            empty($data['body']) &&
            empty($data['track_id']) &&
            empty($data['voice_url'])
        ) {
            throw new LogicException('Message content is empty');
        }

        return Message::create([
            'conversation_id'   => $conversation->id,
            'sender_profile_id' => $profile->id,
            'type'              => $data['type'] ?? 'text',
            'body'              => $data['body'] ?? null,
            'track_id'          => $data['track_id'] ?? null,
            'voice_url'         => $data['voice_url'] ?? null,
            'sent_at'           => Carbon::now(),
        ]);
    }

    protected function ensureParticipant(
        Conversation $conversation,
        Profile $profile
    ) {
        $exists = $conversation->participants()
            ->where('profile_id', $profile->id)
            ->exists();

        if (! $exists) {
            throw new LogicException('Not a conversation participant');
        }
    }
}
