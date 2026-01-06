<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Instrument;
use App\Models\Genre;
use App\Models\Objective;
use App\Models\Swipe;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'username',
        'bio',
        'location',
        'birth_date',
        'gender',
        'experience_level',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'gender' => 'string',
        'experience_level' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function instruments()
    {
        return $this->belongsToMany(
            Instrument::class,
            'profile_instruments'
        );
    }

    public function genres()
    {
        return $this->belongsToMany(
            Genre::class,
            'profile_genres'
        );
    }

    public function objectives()
    {
        return $this->belongsToMany(
            Objective::class,
            'profile_objectives'
        );
    }

    public function swipesSent()
    {
        return $this->hasMany(
            Swipe::class,
            'swiper_profile_id'
        );
    }

    public function swipesReceived()
    {
        return $this->hasMany(
            Swipe::class,
            'swiped_profile_id'
        );
    }
}
