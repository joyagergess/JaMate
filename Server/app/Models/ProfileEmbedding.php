<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileEmbedding extends Model
{
    protected $table = 'profile_embeddings';

    protected $primaryKey = 'profile_id';
    public $incrementing = false;

    public $timestamps = false;

    protected $casts = [
        'embedding' => 'array',
    ];

    protected $fillable = [
        'profile_id',
        'embedding',
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
