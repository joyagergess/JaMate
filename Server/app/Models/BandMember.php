<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BandMember extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'band_id',
        'profile_id',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];


    public function band()
    {
        return $this->belongsTo(Band::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
