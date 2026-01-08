<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperBandSuggestion
 */
class BandSuggestion extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'status',       
        'expires_at',
        'ai_score',
        'ai_reason',
    ];

    protected $casts = [
        'status'     => 'string',
        'expires_at' => 'datetime',
        'ai_score'   => 'integer',
    ];

    public function members()
    {
        return $this->hasMany(BandSuggestionMember::class);
    }

    public function band()
    {
        return $this->hasOne(Band::class);
    }
}
