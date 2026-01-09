<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class ProfileEmbedding extends Model
{
    public $timestamps = false; 

    protected $fillable = [
        'profile_id',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}

  
