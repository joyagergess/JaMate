<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchModel extends Model
{
    use HasFactory;

    protected $table = 'matches';

    public $timestamps = false;

    protected $fillable = [
        'profile_one_id',
        'profile_two_id',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

   

    public function profileOne()
    {
        return $this->belongsTo(
            Profile::class,
            'profile_one_id'
        );
    }

    public function profileTwo()
    {
        return $this->belongsTo(
            Profile::class,
            'profile_two_id'
        );
    }
}
