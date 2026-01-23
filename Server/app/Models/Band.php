<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperBand
 */
class Band extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'band_suggestion_id',
        'conversation_id',
    ];


    public function suggestion()
    {
        return $this->belongsTo(BandSuggestion::class, 'band_suggestion_id');
    }

    public function members()
    {
        return $this->hasMany(BandMember::class);
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
    public function hasMember(Profile $profile): bool
    {
        return $this->members()
            ->where('profile_id', $profile->id)
            ->exists();
    }
}
