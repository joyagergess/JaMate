<?php

namespace App\Services;

use App\Models\Band;
use App\Models\BandSetlist;
use Illuminate\Support\Facades\Http;

class BandSetlistService
{
    public function getForBand(Band $band): array
    {
        $setlist = BandSetlist::where('band_id', $band->id)->first();

        if (! $setlist || $setlist->status !== 'ready') {
            return [
                'status' => 'processing',
            ];
        }

        return [
            'status' => 'ready',
            'setlist' => $setlist->payload,
            'generated_at' => $setlist->generated_at,
        ];
    }

    public function storeFromN8n(int $bandId, array $setlist): void
    {
        BandSetlist::updateOrCreate(
            ['band_id' => $bandId],
            [
                'status' => 'ready',
                'payload' => $setlist,
                'generated_at' => now(),
            ]
        );
    }

    public function triggerGeneration(Band $band): void
    {
        BandSetlist::updateOrCreate(
            ['band_id' => $band->id],
            [
                'status' => 'processing',
                'payload' => null,
                'generated_at' => null,
            ]
        );

        app(BandSetlistProfileService::class)
            ->generateFromN8n($band->id);
    }
}
