<?php

namespace App\Services;

use App\Models\Message;
use App\Models\Profile;
use App\Models\Conversation;
use Illuminate\Support\Carbon;
use LogicException;
use Illuminate\Support\Collection;

class MessageService
{

    public function listMessages(
        Conversation $conversation,
        Profile $profile,
        ?string $cursor = null,
        int $limit = 30
    ): array {
        $this->ensureParticipant($conversation, $profile);

        $messages = $this->fetchMessages(
            $conversation,
            $cursor,
            $limit
        );

        $transformed = $this->transformMessages($messages);

        return $this->withPaginationCursor($transformed);
    }

    public function sendMessage(
        Conversation $conversation,
        Profile $profile,
        array $data
    ): Message {
        $this->ensureParticipant($conversation, $profile);
        $this->ensureMessageNotEmpty($data);

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

    protected function fetchMessages(
        Conversation $conversation,
        ?string $cursor,
        int $limit
    ): Collection {
        $query = $conversation->messages()
            ->with([
                'senderProfile:id,name',
                'track', 
            ])
            ->orderByDesc('sent_at')
            ->orderByDesc('id')
            ->limit($limit);

        if ($cursor) {
            $query->where(
                'sent_at',
                '<',
                Carbon::parse($cursor)
            );
        }

        return $query
            ->get()
            ->reverse()
            ->values();
    }



    protected function transformMessages(
        Collection $messages
    ): Collection {
        return $messages->map(function (Message $message) {
            return match ($message->type) {
                'track' => $this->transformTrackMessage($message),
                'voice' => $this->transformVoiceMessage($message),
                default => $this->transformTextMessage($message),
            };
        });
    }

    protected function transformTextMessage(
        Message $message
    ): array {
        return [
            'id' => $message->id,
            'type' => 'text',
            'body' => $message->body,
            'sent_at' => $message->sent_at,
            'sender_profile_id' => $message->sender_profile_id,
            'conversation_id' => $message->conversation_id,
        ];
    }

    protected function transformTrackMessage(Message $message): array
    {
        $track = $message->track;

        return [
            'id' => $message->id,
            'type' => 'track',

            'track_id' => $track?->id,
            'track_title' => $track?->title,
            'track_duration' => $track?->duration,
            'track_type' => $track?->track_type,

            'audio_public_url' => $track?->audio_public_url,

            'sent_at' => $message->sent_at,
            'sender_profile_id' => $message->sender_profile_id,
            'conversation_id' => $message->conversation_id,
        ];
    }





    protected function transformVoiceMessage(
        Message $message
    ): array {
        return [
            'id' => $message->id,
            'type' => 'voice',
            'voice_url' => $message->voice_url,
            'sent_at' => $message->sent_at,
            'sender_profile_id' => $message->sender_profile_id,
            'conversation_id' => $message->conversation_id,
        ];
    }

    protected function withPaginationCursor(
        Collection $messages
    ): array {
        return [
            'data' => $messages,
            'next_cursor' => $this->resolveNextCursor($messages),
        ];
    }

    protected function resolveNextCursor(
        Collection $messages
    ): ?string {
        return $messages->isNotEmpty()
            ? $messages->first()['sent_at']
            : null;
    }


    protected function ensureParticipant(
        Conversation $conversation,
        Profile $profile
    ): void {
        $exists = $conversation->participants()
            ->where('profile_id', $profile->id)
            ->exists();

        if (! $exists) {
            throw new LogicException(
                'Not a conversation participant'
            );
        }
    }

    protected function ensureMessageNotEmpty(
        array $data
    ): void {
        if (
            empty($data['body']) &&
            empty($data['track_id']) &&
            empty($data['voice_url'])
        ) {
            throw new LogicException(
                'Message content is empty'
            );
        }
    }

    public function transformSingleMessage(Message $message): array
    {
        return $this->transformMessages(
            collect([$message])
        )->first();
    }
}
