<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Message $message;

   
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel(
            'conversation.' . $this->message->conversation_id
        );
    }

    public function broadcastAs(): string
    {
        return 'MessageSent';
    }

  
    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'conversation_id' => $this->message->conversation_id,
                'sender_profile_id' => $this->message->sender_profile_id,
                'body' => $this->message->body,
                'type' => $this->message->type,
                'sent_at' => $this->message->sent_at?->toISOString(),
            ],
        ];
    }
}
