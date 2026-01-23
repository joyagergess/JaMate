<?php

namespace App\Services;

use App\Models\ProfileMedia;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ProfileMediaService
{

    private string $ffmpegPath  = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
    private string $ffprobePath = 'C:\\ffmpeg\\bin\\ffprobe.exe';

    public function getForUser(User $user): Collection
    {
        $profile = $user->profile;

        if (!$profile) {
            throw new HttpException(404, 'Profile not found');
        }

        return ProfileMedia::where('profile_id', $profile->id)
            ->orderBy('order_index')
            ->get();
    }

    public function store(User $user, array $data): ProfileMedia
    {
        $profile = $this->getProfileOrFail($user);
        $file    = $this->getMediaFileOrFail($data);
        $type    = $this->getMediaTypeOrFail($data);

        $order   = $this->getNextOrderIndex($profile->id);
        $basePath = "profiles/{$profile->id}";
        $uuid     = (string) Str::uuid();

        return match ($type) {
            'image' => $this->storeImage($profile->id, $file, $basePath, $order),
            'video' => $this->storeVideo($profile->id, $file, $basePath, $uuid, $order),
        };
    }


    private function getProfileOrFail(User $user)
    {
        if (!$user->profile) {
            throw new HttpException(404, 'Profile not found');
        }

        return $user->profile;
    }

    private function getMediaFileOrFail(array $data): UploadedFile
    {
        if (!isset($data['media_file'])) {
            throw new HttpException(422, 'Media file is required');
        }

        return $data['media_file'];
    }

    private function getMediaTypeOrFail(array $data): string
    {
        if (!isset($data['media_type']) || !in_array($data['media_type'], ['image', 'video'])) {
            throw new HttpException(422, 'Invalid media type');
        }

        return $data['media_type'];
    }

    private function getNextOrderIndex(int $profileId): int
    {
        $max = ProfileMedia::where('profile_id', $profileId)->max('order_index');
        return is_null($max) ? 0 : $max + 1;
    }


    private function storeImage(
        int $profileId,
        UploadedFile $file,
        string $basePath,
        int $order
    ): ProfileMedia {
        $path = $file->store($basePath, 'public');

        return ProfileMedia::create([
            'profile_id'  => $profileId,
            'media_type'  => 'image',
            'media_url'   => $path,
            'order_index' => $order,
        ]);
    }


    private function storeVideo(
        int $profileId,
        UploadedFile $file,
        string $basePath,
        string $uuid,
        int $order
    ): ProfileMedia {
        $rawPath = $file->store("{$basePath}/raw", 'public');

        $paths = $this->buildVideoPaths($basePath, $uuid, $rawPath);

        usleep(300000);

        $this->transcodeVideo($paths['input'], $paths['output']);
        $this->generateThumbnail($paths['output'], $paths['thumb']);

        $duration = $this->getVideoDuration($paths['output']);

        Storage::disk('public')->delete($rawPath);

        return ProfileMedia::create([
            'profile_id'    => $profileId,
            'media_type'    => 'video',
            'media_url'     => "{$basePath}/{$uuid}.mp4",
            'thumbnail_url' => "{$basePath}/{$uuid}.jpg",
            'duration'      => $duration,
            'order_index'   => $order,
        ]);
    }


    private function buildVideoPaths(string $basePath, string $uuid, string $rawPath): array
    {
        return [
            'input'  => realpath(Storage::disk('public')->path($rawPath)),
            'output' => Storage::disk('public')->path("{$basePath}/{$uuid}.mp4"),
            'thumb'  => Storage::disk('public')->path("{$basePath}/{$uuid}.jpg"),
        ];
    }

    private function transcodeVideo(string $input, string $output): void
    {
        $cmd = sprintf(
            '"%s" -y -i %s -map_metadata -1 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ' .
                '-c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -crf 23 -preset fast ' .
                '-movflags +faststart -c:a aac -b:a 128k %s 2>&1',
            $this->ffmpegPath,
            escapeshellarg($input),
            escapeshellarg($output)
        );

        exec($cmd, $out, $code);

        if ($code !== 0) {
            throw new HttpException(500, 'Video processing failed');
        }
    }

    private function generateThumbnail(string $video, string $thumb): void
    {
        exec(sprintf(
            '"%s" -y -i %s -ss 00:00:01 -vframes 1 %s 2>&1',
            $this->ffmpegPath,
            escapeshellarg($video),
            escapeshellarg($thumb)
        ));
    }

    private function getVideoDuration(string $video): ?float
    {
        $duration = trim(shell_exec(sprintf(
            '"%s" -v error -show_entries format=duration -of default=nw=1:nk=1 %s',
            $this->ffprobePath,
            escapeshellarg($video)
        )));

        return is_numeric($duration) ? round((float) $duration, 2) : null;
    }


    public function update(ProfileMedia $media, array $data): ProfileMedia
    {
        $media->update($data);
        return $media;
    }

    public function delete(ProfileMedia $media): void
    {
        if ($media->media_url) {
            Storage::disk('public')->delete($media->media_url);
        }

        if ($media->thumbnail_url) {
            Storage::disk('public')->delete($media->thumbnail_url);
        }

        $media->delete();
    }

    public function reorder(User $user, array $media): void
    {
        if (empty($media)) {
            return;
        }

        $profile = $this->getProfileOrFail($user);

        [$cases, $ids] = $this->buildReorderSqlParts($media);

        $this->executeReorderUpdate($profile->id, $cases, $ids);
    }


    public function updateAvatar(User $user, UploadedFile $file): ProfileMedia
    {
        $profile = $this->getProfileOrFail($user);
        $media   = $this->getAvatarMediaOrFail($profile->id);

        $this->deleteOldAvatarIfExists($media);

        $path = $this->storeAvatarFile($profile->id, $file);

        $media->update([
            'media_type'     => 'image',
            'media_url'      => $path,
            'thumbnail_url'  => null,
            'duration'       => null,
        ]);

        return $media->fresh();
    }


    private function buildReorderSqlParts(array $media): array
    {
        $cases = [];
        $ids   = [];

        foreach ($media as $item) {
            $id    = (int) $item['id'];
            $order = (int) $item['order_index'];

            $cases[] = "WHEN id = {$id} THEN {$order}";
            $ids[]   = $id;
        }

        return [$cases, $ids];
    }

    private function executeReorderUpdate(int $profileId, array $cases, array $ids): void
    {
        DB::statement("
        UPDATE profile_media
        SET order_index = CASE
            " . implode(' ', $cases) . "
        END
        WHERE id IN (" . implode(',', $ids) . ")
        AND profile_id = ?
    ", [$profileId]);
    }

    private function getAvatarMediaOrFail(int $profileId): ProfileMedia
    {
        $media = ProfileMedia::where('profile_id', $profileId)
            ->where('order_index', 0)
            ->first();

        if (!$media) {
            throw new HttpException(404, 'Avatar media not found');
        }

        return $media;
    }

    private function deleteOldAvatarIfExists(ProfileMedia $media): void
    {
        if ($media->media_url) {
            Storage::disk('public')->delete($media->media_url);
        }
    }

    private function storeAvatarFile(int $profileId, UploadedFile $file): string
    {
        return $file->store("profiles/{$profileId}", 'public');
    }
}
