<?php

namespace App\Services;

use App\Models\UserTrack;
use Illuminate\Http\UploadedFile;
use Symfony\Component\Process\Process;

class TrackUploadService
{
    private string $ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';

    public function uploadSnippet(
        int $profileId,
        UploadedFile $audio,
        int $duration,
        string $trackType = 'snippet'
    ): UserTrack {
        $tmpFullPath = str_replace('\\', '/', $audio->getRealPath());

        if (!file_exists($tmpFullPath)) {
            throw new \RuntimeException("Temp audio file not found: {$tmpFullPath}");
        }

        $finalPath = 'tracks/' . uniqid() . '.wav';
        $finalFullPath = str_replace(
            '\\',
            '/',
            storage_path("app/public/{$finalPath}")
        );

        if (!is_dir(dirname($finalFullPath))) {
            mkdir(dirname($finalFullPath), 0777, true);
        }

        $command = sprintf(
            '"%s" -y -i "%s" -ac 1 -ar 44100 "%s"',
            $this->ffmpegPath,
            $tmpFullPath,
            $finalFullPath
        );

        $process = Process::fromShellCommandline($command);
        $process->setTimeout(60);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \RuntimeException(
                "Audio conversion failed:\n" . $process->getErrorOutput()
            );
        }

        return UserTrack::create([
            'profile_id' => $profileId,
            'title' => ucfirst($trackType),
            'audio_url' => $finalPath,
            'duration' => $duration,
            'track_type' => $trackType,
            'visibility' => 'private',
            'source' => 'mobile',
        ]);
    }
}
