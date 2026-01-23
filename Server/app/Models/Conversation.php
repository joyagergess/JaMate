<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperConversation
 */
class Conversation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'match_id',
        'type',
        'name',
    ];

    protected $casts = [
        'type' => 'string',
    ];

    public function participants()
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function band()
    {
        return $this->hasOne(Band::class);
    }
    
}
