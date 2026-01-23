<?php

namespace App\Services;

use App\Models\BandSetlist;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BandSetlistProfileService
{
    public function generateFromN8n(int $bandId): void
    {
        BandSetlist::updateOrCreate(
            ['band_id' => $bandId],
            [
                'status' => 'processing',
            ]
        );

        try {
            Http::timeout(1)
                ->retry(0, 0)
                ->post(
                    config('services.n8n.band_setlist_webhook'),
                    ['band_id' => $bandId]
                );
        } catch (\Throwable $e) {
            Log::error('Failed to trigger n8n band setlist workflow', [
                'band_id' => $bandId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
