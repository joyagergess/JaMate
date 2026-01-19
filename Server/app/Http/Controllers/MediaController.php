<?php

namespace App\Http\Controllers;

use App\Services\MediaService;

class MediaController extends Controller
{
    public function stream(string $path, MediaService $mediaService)
    {
        return $mediaService->stream($path);
    }
}
