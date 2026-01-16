<?php

namespace App\Http\Controllers;

use App\Services\ProfileEmbeddingService;
use Illuminate\Http\JsonResponse;

class EmbeddingController extends Controller
{
    public function generate(ProfileEmbeddingService $service): JsonResponse
    {

        try {
            $processed = $service->processBatch(10);
            return response()->json([
                'processed' => $processed,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'class' => get_class($e),
            ], 500);
        }
    }
}
