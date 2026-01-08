<?php

namespace App\Services;

use App\Models\Band;
use App\Models\BandMember;
use App\Models\BandSuggestion;
use App\Models\BandSuggestionMember;
use App\Models\Conversation;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BandSuggestionService
{
    public function listForProfile(Profile $profile)
    {
        return BandSuggestion::query()
            ->whereHas('members', fn ($q) =>
                $q->where('profile_id', $profile->id)
            )
            ->where('status', 'pending')
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

            $member = $this->getMemberOrFail($suggestionId, $profile);

            if ($member->decision !== 'pending') {
                return;
            }

            $member->update([
                'decision'   => 'accepted',
                'decided_at' => now(),
            ]);

            if ($this->allMembersAccepted($suggestionId)) {
                $this->finalizeBand($suggestionId);
            }
        });
    }

    public function reject(int $suggestionId, Profile $profile): void
    {
        DB::transaction(function () use ($suggestionId, $profile) {

            $member = $this->getMemberOrFail($suggestionId, $profile);

            $member->update([
                'decision'   => 'rejected',
                'decided_at' => now(),
            ]);

            BandSuggestion::where('id', $suggestionId)
                ->update(['status' => 'rejected']);
        });
    }

  
    protected function getMemberOrFail(int $suggestionId, Profile $profile): BandSuggestionMember
    {
        return BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('profile_id', $profile->id)
            ->firstOrFail();
    }

    protected function allMembersAccepted(int $suggestionId): bool
    {
        return ! BandSuggestionMember::where('band_suggestion_id', $suggestionId)
            ->where('decision', '!=', 'accepted')
            ->exists();
    }

    protected function finalizeBand(int $suggestionId): void
    {
        $suggestion = BandSuggestion::with('members')->findOrFail($suggestionId);

        $suggestion->update(['status' => 'accepted']);

        $conversation = Conversation::create([
            'type' => 'band',
            'name' => 'New Band',
        ]);

        $band = Band::create([
            'band_suggestion_id' => $suggestion->id,
            'conversation_id'    => $conversation->id,
        ]);
        foreach ($suggestion->members as $member) {
            BandMember::create([
                'band_id'    => $band->id,
                'profile_id' => $member->profile_id,
                'joined_at'  => now(),
            ]);
        }
    }
}
