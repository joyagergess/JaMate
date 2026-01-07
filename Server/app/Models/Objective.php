<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperObjective
 */
class Objective extends Model
{
    use HasFactory;

    public $timestamps = false; 

    protected $fillable = [
        'name',
    ];

    public function profiles()
    {
        return $this->belongsToMany(
            Profile::class,
            'profile_objectives'
        );
    }
}
