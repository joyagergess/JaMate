<?php

namespace App\Jobs;

use App\Models\BandSuggestion;
use App\Models\BandSuggestionMember;
use App\Services\BandFormationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class GenerateBandSuggestionsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected ?int $profileId = null
    ) {}

    public function handle(BandFormationService $bandFormationService): void
    {
        $profiles = $bandFormationService
            ->getEligibleProfiles($this->profileId);

        foreach ($profiles as $profile) {

            $candidateGroups = $bandFormationService
                ->buildCandidateGroups($profile); 

            foreach ($candidateGroups as $group) {

                DB::transaction(function () use (
                    $bandFormationService,
                    $group
                ) {
                    if ($bandFormationService->suggestionAlreadyExists($group)) {
                        return;
                    }
                    $analysis = $bandFormationService
                        ->scoreGroupWithAI($group);

                    $suggestion = BandSuggestion::create([
                        'status'     => 'pending',
                        'expires_at' => now()->addDays(3),
                        'ai_score'   => $analysis['score'],
                        'ai_reason'  => $analysis['reason'],
                    ]);

                    foreach ($group as $profile) {
                        BandSuggestionMember::create([
                            'band_suggestion_id' => $suggestion->id,
                            'profile_id'         => $profile->id,
                            'decision'           => 'pending',
                        ]);
                    }
                });
            }
        }
    }
}
