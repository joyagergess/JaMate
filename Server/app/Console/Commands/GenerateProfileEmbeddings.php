<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;
use App\Services\OpenAIEmbeddingService;
use App\Services\ProfileEmbeddingTextBuilder;
use App\Models\ProfileEmbedding;

class GenerateProfileEmbeddings extends Command
{
    protected $signature = 'profiles:generate-embeddings {--limit=50}';

    protected $description = 'Generate embeddings for dirty profiles only';

    public function handle(
        OpenAIEmbeddingService $embeddingService,
        ProfileEmbeddingTextBuilder $textBuilder
    ): int {
        $limit = (int) $this->option('limit');

        $profiles = Profile::where('embedding_dirty', true)
            ->with(['instruments', 'genres', 'objectives'])
            ->limit($limit)
            ->get();

        if ($profiles->isEmpty()) {
            $this->info('No dirty profiles found.');
            return Command::SUCCESS;
        }

        $this->info("Generating embeddings for {$profiles->count()} profiles…");

        $bar = $this->output->createProgressBar($profiles->count());
        $bar->start();

        foreach ($profiles as $profile) {
            $text = $textBuilder->build($profile);

            $vector = $embeddingService->generate($text);

            ProfileEmbedding::updateOrCreate(
                ['profile_id' => $profile->id],
                [
                    'embedding' => $vector,
                    'updated_at' => now(),
                ]
            );

            $profile->update([
                'embedding_dirty' => false,
            ]);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Embedding generation complete.');

        return Command::SUCCESS;
    }
}
