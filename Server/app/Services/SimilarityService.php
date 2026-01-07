<?php

namespace App\Services;

use InvalidArgumentException;

class SimilarityService
{
    /**
     * Compute cosine similarity between two vectors.
     *
     * @param array<float> $a
     * @param array<float> $b
     * @return float
     */
    public function cosine(array $a, array $b): float
    {
        if (count($a) !== count($b)) {
            throw new InvalidArgumentException('Embedding vectors must have the same length.');
        }

        $dot = 0.0;
        $normA = 0.0;
        $normB = 0.0;

        foreach ($a as $i => $value) {
            $dot   += $value * $b[$i];
            $normA += $value * $value;
            $normB += $b[$i] * $b[$i];
        }

        if ($normA === 0.0 || $normB === 0.0) {
            return 0.0;
        }

        return $dot / (sqrt($normA) * sqrt($normB));
    }

    /**
     * Normalize cosine similarity to a 0–100 score.
     *
     * @param float $cosine
     * @return float
     */
    public function normalize(float $cosine): float
    {
        return max(0, min(100, ($cosine + 1) * 50));
    }
}
