<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperAiJam
 */
class AiJam extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_id',
        'source_track_id',
        'key',
        'tempo_bpm',
        'style',
        'chords',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'tempo_bpm' => 'integer',
        'chords' => 'array',
        'completed_at' => 'datetime',
    ];


    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function sourceTrack()
    {
        return $this->belongsTo(UserTrack::class, 'source_track_id');
    }

    public function backingTracks()
    {
        return $this->hasMany(AiBackingTrack::class);
    }
}
