<?php

namespace App\Http\Controllers;

use App\Services\ProfileEmbeddingService;
use Illuminate\Http\JsonResponse;

class EmbeddingController extends Controller
{
    public function generate(ProfileEmbeddingService $service): JsonResponse
    {
        $processed = $service->processBatch(10);

        return response()->json([
            'processed' => $processed,
        ]);
    }
}
