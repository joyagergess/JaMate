<?php

namespace App\Services;

use App\Models\ProfileMedia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Collection;

class ProfileMediaService
{
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

    public function getProfilePicture(User $user): ?ProfileMedia
    {
        $profile = $user->profile;

        if (!$profile) {
            throw new HttpException(404, 'Profile not found');
        }

        return ProfileMedia::where('profile_id', $profile->id)
            ->where('order_index', 0)
            ->first();
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

        /** @var \Illuminate\Http\UploadedFile $file */
        $file = $data['media_file'];

        $path = $file->store(
            "profiles/{$profile->id}",
            'public'
        );

        $maxOrder = ProfileMedia::where('profile_id', $profile->id)
            ->max('order_index');

        return ProfileMedia::create([
            'profile_id'  => $profile->id,
            'media_type'  => $data['media_type'], 
            'media_url'   => $path,               
            'order_index' => is_null($maxOrder) ? 0 : $maxOrder + 1,
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
}
