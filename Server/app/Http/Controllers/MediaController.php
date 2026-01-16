<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    public function stream(string $path): BinaryFileResponse
    {
        $fullPath = storage_path('app/public/' . $path);

        abort_unless(file_exists($fullPath), 404);

        return response()->file($fullPath, [
            'Content-Type'  => 'video/mp4',
            'Accept-Ranges' => 'bytes',
        ]);
    }
}
