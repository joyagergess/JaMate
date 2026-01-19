<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @mixin IdeHelperUserTrack
 */
class UserTrack extends Model
{
    use HasFactory;

    protected $appends = ['audio_public_url'];

    protected $fillable = [
        'profile_id',
        'title',
        'audio_url',
        'duration',
        'track_type',
        'visibility',
        'source',
    ];

    protected $casts = [
        'duration' => 'integer',
        'track_type' => 'string',
        'visibility' => 'string',
    ];


    public function getAudioPublicUrlAttribute(): string
    {
        return url("/api/v0.1/media/{$this->audio_url}");
    }


    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'track_id');
    }

    public function sharedTracks(): HasMany
    {
        return $this->hasMany(SharedTrack::class, 'track_id');
    }

   
    public function aiJams(): HasMany
    {
        return $this->hasMany(AiJam::class, 'source_track_id');
    }


  
    public function aiBackingJobs(): HasMany
    {
        return $this->hasMany(
            AiBackingJob::class,
            'source_track_id'
        );
    }

    public function generatedByAiBackingJob(): HasOne
    {
        return $this->hasOne(
            AiBackingJob::class,
            'output_track_id'
        );
    }
}
