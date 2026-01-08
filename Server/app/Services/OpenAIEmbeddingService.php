<?php

namespace App\Services;

use OpenAI\Client;

class OpenAIEmbeddingService
{
    protected string $model;

    public function __construct(
        protected Client $client
    ) {
        $this->model = config('services.openai.embedding_model');
    }

    public function generate(string $text): array
    {
        $response = $this->client->embeddings()->create([
            'model' => $this->model,
            'input' => $text,
        ]);

        return $response['data'][0]['embedding'];
    }
}
