<?php

namespace App\Http\Controllers;

use App\Services\ProfileEmbeddingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class EmbeddingController extends Controller
{
    public function generate(ProfileEmbeddingService $service): JsonResponse
    {
        Log::info('[Embeddings] generate() called', [
            'time' => now()->toDateTimeString(),
        ]);

        try {
            $processed = $service->processBatch(10);

            Log::info('[Embeddings] batch processed', [
                'processed' => $processed,
            ]);

            return response()->json([
                'processed' => $processed,
            ]);
        } catch (\Throwable $e) {

            Log::error('[Embeddings] ERROR during batch processing', [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            return response()->json([
                'error' => 'Embedding generation failed',
            ], 500);
        }
    }
}
