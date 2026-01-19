<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiBackingJob extends Model
{
    protected $table = 'ai_backing_jobs';

    protected $fillable = [
        'source_track_id',
        'output_track_id',
        'status',
        'bpm',
        'musical_key',
        'chords',
        'genre',
        'error',
    ];

    protected $casts = [
        'bpm' => 'integer',
        'chords' => 'array',
    ];

    
   
    public function sourceTrack(): BelongsTo
    {
        return $this->belongsTo(UserTrack::class, 'source_track_id');
    }


    public function outputTrack(): BelongsTo
    {
        return $this->belongsTo(UserTrack::class, 'output_track_id');
    }


    public function isFinished(): bool
    {
        return in_array($this->status, ['done', 'failed'], true);
    }

    public function isRunning(): bool
    {
        return in_array($this->status, ['queued', 'analyzing', 'generating'], true);
    }
    
}
