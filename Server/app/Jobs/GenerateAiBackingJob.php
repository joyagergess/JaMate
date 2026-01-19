<?php

namespace App\Jobs;

use App\Models\AiBackingJob;
use App\Models\UserTrack;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class GenerateAiBackingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 900;

  
    public function __construct(
        public AiBackingJob $aiJob
    ) {}

    public function handle(): void
    {
        $this->aiJob->update(['status' => 'analyzing']);

        try {
            $track = UserTrack::findOrFail($this->aiJob->source_track_id);

            $aiResult = $this->callAiService($track);

            $path = "tracks/ai/{$track->profile_id}/" . Str::uuid() . ".wav";

            DB::transaction(function () use ($track, $aiResult, $path) {

                Storage::disk('public')->put($path, $aiResult['audio']);

                $absolutePath = storage_path('app/public/' . $path);

                $realDuration = $this->extractWavDuration($absolutePath);

                $backingTrack = UserTrack::create([
                    'profile_id' => $track->profile_id,
                    'title' => 'AI Backing Track',
                    'audio_url' => $path,
                    'duration' => $realDuration,
                    'track_type' => 'ai_generated',
                    'visibility' => 'private',
                    'source' => 'ai',
                ]);

                $this->aiJob->update([
                    'status' => 'done',
                    'output_track_id' => $backingTrack->id,
                    'bpm' => $aiResult['bpm'],
                    'musical_key' => $aiResult['musical_key'],
                    'chords' => $aiResult['chords'],
                    'genre' => $aiResult['genre'],
                ]);
            });
        } catch (\Throwable $e) {

            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            $this->aiJob->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

  
    private function callAiService(UserTrack $track): array
    {
        $response = Http::timeout(600)
            ->attach(
                'audio',
                file_get_contents(storage_path('app/public/' . $track->audio_url)),
                basename($track->audio_url)
            )
            ->post(config('services.ai_music.url') . '/generate-backing');

        if (!$response->successful()) {
            throw new \RuntimeException($response->body());
        }

        $chords = null;
        if ($response->header('X-CHORDS')) {
            $decoded = json_decode($response->header('X-CHORDS'), true);
            $chords = json_last_error() === JSON_ERROR_NONE ? $decoded : null;
        }

        return [
            'audio' => $response->body(),
            'bpm' => is_numeric($response->header('X-BPM'))
                ? (int) $response->header('X-BPM')
                : null,
            'musical_key' => $response->header('X-KEY') ?: null,
            'genre' => $response->header('X-GENRE') ?: null,
            'chords' => $chords,
        ];
    }

    private function extractWavDuration(string $path): int
    {
        $fp = fopen($path, 'rb');

        fseek($fp, 28);
        $byteRate = unpack('V', fread($fp, 4))[1];

        fseek($fp, 40);
        $dataSize = unpack('V', fread($fp, 4))[1];

        fclose($fp);
        return (int) round($dataSize / $byteRate);
    }
}
