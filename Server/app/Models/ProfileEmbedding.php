<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileEmbedding extends Model
{
    protected $table = 'profile_embeddings';

    protected $primaryKey = 'profile_id';
    public $incrementing = false;
    protected $keyType = 'int';

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
