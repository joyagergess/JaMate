<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Swipe extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'swiper_profile_id',
        'swiped_profile_id',
        'direction',
        'created_at',
    ];

    protected $casts = [
        'direction' => 'string',
        'created_at' => 'datetime',
    ];

    public function swiper()
    {
        return $this->belongsTo(
            Profile::class,
            'swiper_profile_id'
        );
    }

    public function swiped()
    {
        return $this->belongsTo(
            Profile::class,
            'swiped_profile_id'
        );
    }
}
