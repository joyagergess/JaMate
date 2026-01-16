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
        $profile = $user->profile;

        if (!$profile) {
            throw new HttpException(404, 'Profile not found');
        }

        if (!isset($data['media_file'])) {
            throw new HttpException(422, 'Media file is required');
        }

        /** @var UploadedFile $file */
        $file = $data['media_file'];
        $type = $data['media_type'];

        $basePath = "profiles/{$profile->id}";
        $uuid     = (string) Str::uuid();

        $maxOrder = ProfileMedia::where('profile_id', $profile->id)->max('order_index');
        $order    = is_null($maxOrder) ? 0 : $maxOrder + 1;


        if ($type === 'image') {
            $path = $file->store($basePath, 'public');

            return ProfileMedia::create([
                'profile_id'  => $profile->id,
                'media_type'  => 'image',
                'media_url'   => $path,
                'order_index' => $order,
            ]);
        }

        if ($type !== 'video') {
            throw new HttpException(422, 'Invalid media type');
        }


        $rawPath = $file->store("{$basePath}/raw", 'public');

        $input  = realpath(Storage::disk('public')->path($rawPath));
        $output = Storage::disk('public')->path("{$basePath}/{$uuid}.mp4");
        $thumb  = Storage::disk('public')->path("{$basePath}/{$uuid}.jpg");

        usleep(300000);

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
            logger()->error('FFmpeg failed', [
                'command' => $cmd,
                'output'  => $out,
                'code'    => $code,
            ]);

            throw new HttpException(500, 'Video processing failed');
        }

        exec(sprintf(
            '"%s" -y -i %s -ss 00:00:01 -vframes 1 %s 2>&1',
            $this->ffmpegPath,
            escapeshellarg($output),
            escapeshellarg($thumb)
        ));

        $duration = trim(shell_exec(sprintf(
            '"%s" -v error -show_entries format=duration -of default=nw=1:nk=1 %s',
            $this->ffprobePath,
            escapeshellarg($output)
        )));

        Storage::disk('public')->delete($rawPath);

        return ProfileMedia::create([
            'profile_id'    => $profile->id,
            'media_type'    => 'video',
            'media_url'     => "{$basePath}/{$uuid}.mp4",
            'thumbnail_url' => "{$basePath}/{$uuid}.jpg",
            'duration'      => is_numeric($duration) ? round((float) $duration, 2) : null,
            'order_index'   => $order,
        ]);
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

        $profile = $user->profile;

        if (!$profile) {
            throw new HttpException(404, 'Profile not found');
        }

        $cases = [];
        $ids   = [];

        foreach ($media as $item) {
            $id    = (int) $item['id'];
            $order = (int) $item['order_index'];

            $cases[] = "WHEN id = {$id} THEN {$order}";
            $ids[]   = $id;
        }

        DB::statement("
            UPDATE profile_media
            SET order_index = CASE
                " . implode(' ', $cases) . "
            END
            WHERE id IN (" . implode(',', $ids) . ")
            AND profile_id = ?
        ", [$profile->id]);
    }

    public function updateAvatar(User $user, UploadedFile $file): ProfileMedia
    {
        $profile = $user->profile;

        if (!$profile) {
            throw new HttpException(404, 'Profile not found');
        }

        $media = ProfileMedia::where('profile_id', $profile->id)
            ->where('order_index', 0)
            ->first();

        if (!$media) {
            throw new HttpException(404, 'Avatar media not found');
        }
        if ($media->media_url) {
            Storage::disk('public')->delete($media->media_url);
        }

        $path = $file->store("profiles/{$profile->id}", 'public');

        $media->update([
            'media_type' => 'image',
            'media_url' => $path,
            'thumbnail_url' => null,
            'duration' => null,
        ]);

        return $media->fresh();
    }
}
