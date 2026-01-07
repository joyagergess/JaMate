<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperConversationParticipant
 */
class ConversationParticipant extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'conversation_id',
        'profile_id',
    ];

   
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
