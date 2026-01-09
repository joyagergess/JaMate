<?php

namespace App\Http\Controllers;

use App\Http\Requests\Message\SendMessageRequest;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Services\MessageService;

class MessageController extends Controller
{
    public function __construct(
        protected MessageService $messageService
    ) {}

    public function index(Request $request, Conversation $conversation)
    {
        $profile = $request->user()->profile;

        return $this->successResponse(
            $this->messageService->listMessages(
                $conversation,
                $profile,
                $request->query('cursor'),
                (int) $request->query('limit', 30)
            )
        );
    }


    public function store(SendMessageRequest $request,   Conversation $conversation)
    {
        $profile = $request->user()->profile;
        return $this->successResponse(
            $this->messageService->sendMessage(
                $conversation,
                $profile,
                $request->validated()
            ),
            'Message sent',
            201
        );
    }
}
