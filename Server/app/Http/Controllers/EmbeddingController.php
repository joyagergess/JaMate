<?php

namespace App\Http\Controllers;

use App\Services\ProfileEmbeddingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

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
                'error' => 'Embedding generation failed',
            ], 500);
        }
    }
}
