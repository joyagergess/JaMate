<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperProfileGenre
 */
class ProfileGenre extends Model
{
    protected $table = 'profile_genres';

    public $timestamps = false;

    protected $fillable = [
        'profile_id',
        'genre_id',
    ];
}
