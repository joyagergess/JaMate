<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Services\ConversationService;
use App\Http\Requests\Conversation\RenameConversationRequest;

class ConversationController extends Controller
{
    public function __construct(
        protected ConversationService $conversationService
    ) {}

    public function index(Request $request)
    {
        $profile = $request->user()->profile;

        return $this->successResponse(
            $this->conversationService->listForProfile($profile)
        );
    }

    public function markAsRead(
        Conversation $conversation,
        Request $request
    ) {
        $profile = $request->user()->profile;

        $this->conversationService->markAsRead(
            $conversation,
            $profile
        );

        return response()->noContent();
    }

    public function rename(
        RenameConversationRequest $request,
        Conversation $conversation
    ) {
        $profile = $request->user()->profile;

        $updated = $this->conversationService->renameConversation(
            $conversation,
            $profile,
            $request->string('name')
        );

        return $this->successResponse(
            $updated,
            'Conversation renamed'
        );
    }
}
