<?php

namespace App\Services;

use OpenAI\Client;
use App\AI\Prompts\BandScoringPrompt;

class OpenAIEmbeddingService
{
    protected string $embeddingModel;
    protected string $chatModel;

    public function __construct(
        protected Client $client
    ) {
        $this->embeddingModel = config('services.openai.embedding_model');
        $this->chatModel = config('services.openai.chat_model');
    }


    public function generate(string $text): array
    {
        $response = $this->requestEmbedding($text);

        return $this->extractEmbedding($response);
    }

    public function scoreBandCompatibility(array $members): array
    {
        $response = $this->requestBandScore($members);

        return $this->extractBandScore($response);
    }


    private function requestEmbedding(string $text): object
    {
        return $this->client->embeddings()->create([
            'model' => $this->embeddingModel,
            'input' => $text,
        ]);
    }

    private function requestBandScore(array $members): object
    {
        return $this->client->chat()->create([
            'model' => $this->chatModel,
            'temperature' => 0.2,
            'messages' => [
                $this->systemMessage(),
                $this->userMessage($members),
            ],
        ]);
    }

    private function extractEmbedding(object $response): array
    {
        return $response->embeddings[0]->embedding;
    }


    private function extractBandScore(object $response): array
    {
        $content = $response->choices[0]->message->content ?? '';

        $decoded = json_decode($content, true);

        if (! $this->isValidBandScore($decoded)) {
            throw new \RuntimeException('Invalid AI band scoring response');
        }

        return [
            'score'  => (int) $decoded['score'],
            'reason' => (string) $decoded['reason'],
        ];
    }

    private function isValidBandScore(?array $decoded): bool
    {
        return is_array($decoded)
            && isset($decoded['score'], $decoded['reason'])
            && is_int($decoded['score'])
            && is_string($decoded['reason']);
    }

    private function systemMessage(): array
    {
        return [
            'role' => 'system',
            'content' => BandScoringPrompt::system(),
        ];
    }

    private function userMessage(array $members): array
    {
        return [
            'role' => 'user',
            'content' => json_encode(
                ['members' => $members],
                JSON_THROW_ON_ERROR
            ),
        ];
    }
}
