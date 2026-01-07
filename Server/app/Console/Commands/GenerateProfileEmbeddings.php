<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Profile;
use App\Models\ProfileEmbedding;
use App\Services\OpenAIEmbeddingService;

class GenerateProfileEmbeddings extends Command
{
    protected $signature = 'profiles:generate-embeddings';

    protected $description = 'Generate embeddings for all profiles';

    public function handle(OpenAIEmbeddingService $embeddingService): int
    {
        $this->info('Generating profile embeddings...');

        $profiles = Profile::with([
            'instruments',
            'genres',
            'objectives',
        ])->get();

        $bar = $this->output->createProgressBar($profiles->count());
        $bar->start();

        foreach ($profiles as $profile) {
            $text = $this->buildEmbeddingText($profile);

            $vector = $embeddingService->generate($text);

            ProfileEmbedding::updateOrCreate(
                ['profile_id' => $profile->id],
                ['embedding' => $vector]
            );

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Done.');

        return Command::SUCCESS;
    }

    protected function buildEmbeddingText(Profile $profile): string
    {
        return implode(' ', array_filter([
            $profile->bio,
            optional($profile->instruments)->pluck('name')->implode(', '),
            optional($profile->genres)->pluck('name')->implode(', '),
            optional($profile->objectives)->pluck('name')->implode(', '),
            $profile->experience_level,
            $profile->location,
        ]));
    }
}
