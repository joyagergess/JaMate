<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperMessage
 */
class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_profile_id',
        'type',
        'body',
        'voice_url',
        'track_id',
        'sent_at',
    ];

    protected $casts = [
        'type'    => 'string',   
        'sent_at' => 'datetime',
    ];

    public $timestamps = false;

  
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(Profile::class, 'sender_profile_id');
    }

    public function track()
    {
        return $this->belongsTo(UserTrack::class, 'track_id');
    }
}
