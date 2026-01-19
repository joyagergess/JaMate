<?php

namespace App\Http\Controllers;

use App\Http\Requests\Message\SendMessageRequest;
use App\Models\Conversation;
use App\Services\MessageService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected MessageService $messageService
    ) {}

    public function index(Request $request, Conversation $conversation)
    {
        $profile = $request->user()->profile;

        try {
            $messages = $this->messageService->listMessages(
                $conversation,
                $profile,
                $request->query('cursor'),
                (int) $request->query('limit', 30)
            );

            return $this->successResponse($messages);
        } catch (\Throwable $e) {
            return $this->errorResponse(
                'Failed to load messages',
                $e->getMessage(),
                500
            );
        }
    }

    public function store(SendMessageRequest $request, Conversation $conversation)
    {
        $profile = $request->user()->profile;

        try {
            $message = $this->messageService->sendMessage(
                $conversation,
                $profile,
                $request->validated()
            );

            return $this->successResponse(
                $message,
                'Message sent',
                201
            );
        } catch (\Throwable $e) {
            return $this->errorResponse(
                'Failed to send message',
                $e->getMessage(),
                500
            );
        }
    }
}
