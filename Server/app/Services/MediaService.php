<?php

namespace App\Services;

class MediaService
{
    public function stream(string $path)
    {
        $fullPath = storage_path('app/public/' . $path);

        abort_unless(file_exists($fullPath), 404);

        return response()->file($fullPath, [
            'Content-Type'  => mime_content_type($fullPath),
            'Accept-Ranges' => 'bytes',
        ]);
    }
}
