<?php

namespace App\Services;

use OpenAI\Client;

class OpenAIEmbeddingService
{
    public function __construct(
        protected Client $client
    ) {}

    public function generate(string $text): array
    {
        $response = $this->client->embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $text,
        ]);

        return $response['data'][0]['embedding'];
    }
}
