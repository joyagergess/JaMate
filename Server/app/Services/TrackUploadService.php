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
        $tmpPath = $this->getTmpPath($audio);
        $finalPath = $this->generateFinalPath();

        $this->ensureDirectoryExists($finalPath);
        $this->convertAudio($tmpPath, $finalPath);

        return $this->createTrack(
            $profileId,
            $finalPath,
            $duration,
            $trackType
        );
    }

    private function getTmpPath(UploadedFile $audio): string
    {
        $path = str_replace('\\', '/', $audio->getRealPath());

        if (!file_exists($path)) {
            throw new \RuntimeException("Temp audio file not found: {$path}");
        }

        return $path;
    }

    private function generateFinalPath(): string
    {
        return 'tracks/' . uniqid() . '.wav';
    }

    private function ensureDirectoryExists(string $relativePath): void
    {
        $fullPath = $this->storageFullPath($relativePath);

        if (!is_dir(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0777, true);
        }
    }

    private function convertAudio(string $input, string $relativeOutput): void
    {
        $output = $this->storageFullPath($relativeOutput);

        $command = sprintf(
            '"%s" -y -i "%s" -ac 1 -ar 44100 "%s"',
            $this->ffmpegPath,
            $input,
            $output
        );

        $process = Process::fromShellCommandline($command);
        $process->setTimeout(60);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \RuntimeException(
                "Audio conversion failed:\n" . $process->getErrorOutput()
            );
        }
    }

    private function storageFullPath(string $relativePath): string
    {
        return str_replace(
            '\\',
            '/',
            storage_path("app/public/{$relativePath}")
        );
    }

    private function createTrack(
        int $profileId,
        string $audioPath,
        int $duration,
        string $trackType
    ): UserTrack {
        return UserTrack::create([
            'profile_id' => $profileId,
            'title' => ucfirst($trackType),
            'audio_url' => $audioPath,
            'duration' => $duration,
            'track_type' => $trackType,
            'visibility' => 'private',
            'source' => 'mobile',
        ]);
    }
}
