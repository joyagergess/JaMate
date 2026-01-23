<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BandSetlist extends Model
{
    protected $table = 'band_setlists';

    protected $fillable = [
        'band_id',
        'status',
        'payload',
        'generated_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'generated_at' => 'datetime',
    ];

    public function band()
    {
        return $this->belongsTo(Band::class);
    }
}
