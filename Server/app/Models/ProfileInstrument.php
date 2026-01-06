<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileInstrument extends Model
{
    protected $table = 'profile_instruments';

    public $timestamps = false;

    protected $fillable = [
        'profile_id',
        'instrument_id',
    ];
}
