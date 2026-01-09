<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperAiBackingTrack
 */
class AiBackingTrack extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'ai_jam_id',
        'variation',
        'audio_url',
        'duration',
    ];

    protected $casts = [
        'duration' => 'integer',
    ];


    public function aiJam()
    {
        return $this->belongsTo(AiJam::class);
    }
}
