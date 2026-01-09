<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperUserTrack
 */
class UserTrack extends Model
{
    use HasFactory;

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


    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'track_id');
    }

    public function sharedTracks()
    {
        return $this->hasMany(SharedTrack::class, 'track_id');
    }

    public function aiJams()
    {
        return $this->hasMany(AiJam::class, 'source_track_id');
    }
}
