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
        'profile_ids',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'profile_ids' => 'array',
        'status' => 'string',    
        'expires_at' => 'datetime',
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
