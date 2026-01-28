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
            ->whereIn('status', ['pending', 'accepted', 'rejected'])
            ->whereHas('members', fn($q) => $q->where('profile_id', $profile->id))
            ->with(['members.profile.media', 'members.profile.instruments'])
            ->orderByDesc('ai_score')
            ->get();
    }
    public function accept(int $suggestionId, Profile $profile): void
    {
        DB::transaction(function () use ($suggestionId, $profile) {

            $member = $this->lockMember($suggestionId, $profile);

            $this->assertCanAccept($member);

            $this->markMemberAccepted($member);

            if ($this->hasPendingMembers($suggestionId)) {
                return;
            }

            $this->finalizeBand($suggestionId);
        });
    }

    public function reject(int $suggestionId, Profile $profile): void
    {
        DB::transaction(function () use ($suggestionId, $profile) {

            $member = $this->lockMemberOrFail($suggestionId, $profile);

            if (! $this->isPending($member)) {
                return;
            }

            $this->markMemberDeclined($member);
            $this->rejectSuggestion($suggestionId);
            $this->declineOtherMembers($suggestionId, $profile);
        });
    }
    private function lockMember(int $suggestionId, Profile $profile): ?BandSuggestionMember
    {
        return BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('profile_id', $profile->id)
            ->lockForUpdate()
            ->first();
    }

    private function lockMemberOrFail(int $suggestionId, Profile $profile): BandSuggestionMember
    {
        return BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('profile_id', $profile->id)
            ->lockForUpdate()
            ->firstOrFail();
    }

    private function assertCanAccept(BandSuggestionMember $member): void
    {
        if (! $member) {
            throw new HttpException(403, 'Not part of this suggestion');
        }

        if ($member->decision === 'jam') {
            return;
        }

        if ($member->decision !== 'pending') {
            throw new HttpException(409, 'Decision already made');
        }
    }

    private function markMemberAccepted(BandSuggestionMember $member): void
    {
        $member->update([
            'decision'   => 'jam',
            'decided_at' => now(),
        ]);
    }

    private function markMemberDeclined(BandSuggestionMember $member): void
    {
        $member->update([
            'decision'   => 'decline',
            'decided_at' => now(),
        ]);
    }

    private function isPending(BandSuggestionMember $member): bool
    {
        return $member->decision === 'pending';
    }

    private function hasPendingMembers(int $suggestionId): bool
    {
        return BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('decision', '!=', 'jam')
            ->exists();
    }

    private function rejectSuggestion(int $suggestionId): void
    {
        BandSuggestion::whereKey($suggestionId)
            ->update(['status' => 'rejected']);
    }

    private function declineOtherMembers(int $suggestionId, Profile $profile): void
    {
        BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('profile_id', '!=', $profile->id)
            ->update([
                'decision'   => 'decline',
                'decided_at' => now(),
            ]);
    }

    protected function finalizeBand(int $suggestionId): void
    {
        DB::transaction(function () use ($suggestionId) {

            $suggestion = $this->lockPendingSuggestion($suggestionId);

            $this->markSuggestionAccepted($suggestion);

            $conversation = $this->createBandConversation();

            $this->addMembersToConversation($conversation, $suggestion->members);

            $band = $this->createBand($suggestion, $conversation);

            $this->addMembersToBand($band, $suggestion->members);
        });
    }

    private function lockPendingSuggestion(int $suggestionId): BandSuggestion
    {
        return BandSuggestion::with('members')
            ->where('id', $suggestionId)
            ->where('status', 'pending')
            ->lockForUpdate()
            ->firstOrFail();
    }

    private function markSuggestionAccepted(BandSuggestion $suggestion): void
    {
        $suggestion->update([
            'status' => 'accepted',
        ]);
    }

    private function createBandConversation(): Conversation
    {
        return Conversation::create([
            'type' => 'group',
            'name' => 'New Band',
        ]);
    }

    private function addMembersToConversation(
        Conversation $conversation,
        $members
    ): void {
        ConversationParticipant::insert(
            $members->map(fn($m) => [
                'conversation_id' => $conversation->id,
                'profile_id'      => $m->profile_id,
            ])->all()
        );
    }

    private function createBand(
        BandSuggestion $suggestion,
        Conversation $conversation
    ): Band {
        return Band::create([
            'band_suggestion_id' => $suggestion->id,
            'conversation_id'    => $conversation->id,
        ]);
    }

    private function addMembersToBand(
        Band $band,
        $members
    ): void {
        BandMember::insert(
            $members->map(fn($m) => [
                'band_id'    => $band->id,
                'profile_id' => $m->profile_id,
                'joined_at'  => now(),
            ])->all()
        );
    }
}
