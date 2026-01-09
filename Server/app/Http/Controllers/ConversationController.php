<?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ConversationService;

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
}
