<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BandSuggestionMember extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'band_suggestion_id',
        'profile_id',
        'decision',
        'decided_at',
    ];

    protected $casts = [
        'decision' => 'string',      
        'decided_at' => 'datetime',
    ];


    public function bandSuggestion()
    {
        return $this->belongsTo(BandSuggestion::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
