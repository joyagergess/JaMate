<?php

namespace App\Services;

use App\Models\Band;
use App\Models\BandMember;
use App\Models\BandSuggestion;
use App\Models\BandSuggestionMember;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BandSuggestionService
{

    public function listForProfile(Profile $profile)
    {
        return BandSuggestion::query()
            ->where('status', 'pending')
            ->whereHas(
                'members',
                fn($q) =>
                $q->where('profile_id', $profile->id)
            )
            ->with([
                'members.profile.media',
                'members.profile.instruments',
            ])
            ->orderByDesc('ai_score')
            ->get();
    }

    public function accept(int $suggestionId, Profile $profile): void
    {
        DB::transaction(function () use ($suggestionId, $profile) {

            $member = $this->getPendingMemberOrFail($suggestionId, $profile);

            $member->update([
                'decision'   => 'accepted',
                'decided_at' => now(),
            ]);

            if ($this->hasAnyNonAcceptedMember($suggestionId)) {
                return;
            }

            $this->finalizeBand($suggestionId);
        });
    }

    public function reject(int $suggestionId, Profile $profile): void
    {
        DB::transaction(function () use ($suggestionId, $profile) {

            $member = $this->getPendingMemberOrFail($suggestionId, $profile);

            $member->update([
                'decision'   => 'rejected',
                'decided_at' => now(),
            ]);
            BandSuggestion::whereKey($suggestionId)
                ->update(['status' => 'rejected']);
            BandSuggestionMember::where('band_suggestion_id', $suggestionId)
                ->where('profile_id', '!=', $profile->id)
                ->update([
                    'decision'   => 'rejected',
                    'decided_at' => now(),
                ]);
        });
    }


    protected function getPendingMemberOrFail(
        int $suggestionId,
        Profile $profile
    ): BandSuggestionMember {
        $member = BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('profile_id', $profile->id)
            ->first();

        if (! $member) {
            throw new HttpException(404, 'Band suggestion not found for profile');
        }

        if ($member->decision !== 'pending') {
            throw new HttpException(409, 'Decision already made');
        }

        return $member;
    }

    protected function hasAnyNonAcceptedMember(int $suggestionId): bool
    {
        return BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('decision', '!=', 'accepted')
            ->exists();
    }

    protected function finalizeBand(int $suggestionId): void
    {
        $suggestion = $this->lockAndAcceptSuggestion($suggestionId);

        $conversation = $this->createBandConversation();

        $this->attachConversationParticipants(
            $conversation->id,
            $suggestion->members
        );

        $band = $this->createBand(
            $suggestion->id,
            $conversation->id
        );

        $this->createBandMembers(
            $band->id,
            $suggestion->members
        );

        $this->sendSystemMessage($conversation->id);
    }

    protected function lockAndAcceptSuggestion(int $suggestionId): BandSuggestion
    {
        $suggestion = BandSuggestion::with('members')
            ->where('id', $suggestionId)
            ->where('status', 'pending')
            ->lockForUpdate()
            ->firstOrFail();

        $suggestion->update(['status' => 'accepted']);

        return $suggestion;
    }
    protected function createBandConversation(): Conversation
    {
        return Conversation::create([
            'type' => 'band',
            'name' => 'New Band',
        ]);
    }

    protected function attachConversationParticipants(int $conversationId, $members): void
    {
        $rows = $members->map(fn($member) => [
            'conversation_id' => $conversationId,
            'profile_id'      => $member->profile_id,
        ])->all();

        ConversationParticipant::insert($rows);
    }

    protected function createBand(int $suggestionId, int $conversationId): Band
    {
        return Band::create([
            'band_suggestion_id' => $suggestionId,
            'conversation_id'    => $conversationId,
        ]);
    }

    protected function createBandMembers(int $bandId, $members): void
    {
        $now = now();

        $rows = $members->map(fn($member) => [
            'band_id'    => $bandId,
            'profile_id' => $member->profile_id,
            'joined_at'  => $now,
        ])->all();

        BandMember::insert($rows);
    }

    protected function sendSystemMessage(int $conversationId): void
    {
        Message::create([
            'conversation_id'   => $conversationId,
            'sender_profile_id' => null,
            'type'              => 'system',
            'body'              => 'Band created! All members accepted the suggestion. Start jamming!',
            'sent_at'           => now(),
        ]);
    }
}
