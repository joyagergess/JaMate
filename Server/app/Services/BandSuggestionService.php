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

            $member = BandSuggestionMember::where('band_suggestion_id', $suggestionId)
                ->where('profile_id', $profile->id)
                ->lockForUpdate()
                ->first();

            if (! $member) {
                throw new HttpException(403, 'Not part of this suggestion');
            }

            if ($member->decision === 'jam') {
                return;
            }

            if ($member->decision !== 'pending') {
                throw new HttpException(409, 'Decision already made');
            }

            $member->update([
                'decision'   => 'jam',
                'decided_at' => now(),
            ]);

            $stillPending = BandSuggestionMember::where('band_suggestion_id', $suggestionId)
                ->where('decision', '!=', 'jam')
                ->exists();

            if ($stillPending) {
                return;
            }

            $this->finalizeBand($suggestionId);
        });
    }

    public function reject(int $suggestionId, Profile $profile): void
    {
        DB::transaction(function () use ($suggestionId, $profile) {

            $member = BandSuggestionMember::where('band_suggestion_id', $suggestionId)
                ->where('profile_id', $profile->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($member->decision !== 'pending') {
                return;
            }

            $member->update([
                'decision'   => 'decline',
                'decided_at' => now(),
            ]);

            BandSuggestion::whereKey($suggestionId)
                ->update(['status' => 'rejected']);

            BandSuggestionMember::where('band_suggestion_id', $suggestionId)
                ->where('profile_id', '!=', $profile->id)
                ->update([
                    'decision'   => 'decline',
                    'decided_at' => now(),
                ]);
        });
    }

    protected function finalizeBand(int $suggestionId): void
    {
        $suggestion = BandSuggestion::with('members')
            ->where('id', $suggestionId)
            ->where('status', 'pending')
            ->lockForUpdate()
            ->firstOrFail();

        $suggestion->update(['status' => 'accepted']);

        $conversation = Conversation::create([
            'type' => 'group',
            'name' => 'New Band',
        ]);

        ConversationParticipant::insert(
            $suggestion->members->map(fn($m) => [
                'conversation_id' => $conversation->id,
                'profile_id'      => $m->profile_id,
            ])->all()
        );

        $band = Band::create([
            'band_suggestion_id' => $suggestion->id,
            'conversation_id'    => $conversation->id,
        ]);

        BandMember::insert(
            $suggestion->members->map(fn($m) => [
                'band_id'    => $band->id,
                'profile_id' => $m->profile_id,
                'joined_at'  => now(),
            ])->all()
        );
    }
}
