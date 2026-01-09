<?php

namespace App\Services\BandFormation;

use App\Models\BandSuggestion;
use App\Models\BandSuggestionMember;
use App\Models\Profile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Services\OpenAIEmbeddingService;

class BandSuggestionRepository
{
    private const MAX_ACTIVE = 4;
    private const COOLDOWN_DAYS = 2;
    private const AI_SCORE_THRESHOLD = 30;

    public function purgeExpired(): void
    {
        $ids = BandSuggestion::where('status', 'pending')
            ->where('expires_at', '<', now())
            ->pluck('id');

        if ($ids->isEmpty()) return;

        DB::transaction(function () use ($ids) {
            BandSuggestionMember::whereIn('band_suggestion_id', $ids)->delete();
            BandSuggestion::whereIn('id', $ids)->delete();
        });
    }

    public function eligibleProfiles(): Collection
    {
        return Profile::query()
            ->whereHas('embedding')
            ->whereHas('media')
            ->with(['embedding', 'media', 'instruments'])
            ->limit(30)
            ->get();
    }

    public function isInCooldown(Profile $profile): bool
    {
        return BandSuggestionMember::where('profile_id', $profile->id)
            ->whereHas(
                'suggestion',
                fn($q) =>
                $q->where('created_at', '>', now()->subDays(self::COOLDOWN_DAYS))
            )
            ->exists();
    }

    public function availableSlots(Profile $profile): int
    {
        $active = BandSuggestion::where('status', 'pending')
            ->whereHas(
                'members',
                fn($q) =>
                $q->where('profile_id', $profile->id)
            )
            ->count();

        return max(0, self::MAX_ACTIVE - $active);
    }

    public function storeSuggestion(Collection $group): void
    {
        DB::transaction(function () use ($group) {

            if ($this->exists($group)) return;

            $analysis = app(OpenAIEmbeddingService::class)
                ->scoreBandCompatibility(
                    $group->map(fn($p) => [
                        'instrument' => $p->instruments->pluck('name'),
                        'experience' => $p->experience_level,
                        'summary'    => $p->bio,
                    ])->toArray()
                );

            if (($analysis['score'] ?? 0) < self::AI_SCORE_THRESHOLD) return;

            $suggestion = BandSuggestion::create([
                'status'     => 'pending',
                'expires_at' => now()->addDays(self::COOLDOWN_DAYS),
                'ai_score'   => $analysis['score'],
                'ai_reason'  => $analysis['reason'] ?? null,
            ]);

            foreach ($group as $profile) {
                BandSuggestionMember::create([
                    'band_suggestion_id' => $suggestion->id,
                    'profile_id'         => $profile->id,
                ]);
            }
        });
    }

    protected function exists(Collection $profiles): bool
    {
        $ids = $profiles
            ->pluck('id')
            ->sort()
            ->values()
            ->toArray();

        $array = 'ARRAY[' . implode(',', $ids) . ']::bigint[]';

        return DB::table('band_suggestion_members')
            ->selectRaw('1') 
            ->groupBy('band_suggestion_id')
            ->havingRaw("array_agg(profile_id ORDER BY profile_id) = {$array}")
            ->exists();
    }
}
