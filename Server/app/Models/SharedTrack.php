<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperSharedTrack
 */
class SharedTrack extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'sender_profile_id',
        'receiver_profile_id',
        'track_id',
    ];

 
    public function sender()
    {
        return $this->belongsTo(Profile::class, 'sender_profile_id');
    }

    public function receiver()
    {
        return $this->belongsTo(Profile::class, 'receiver_profile_id');
    }

    public function track()
    {
        return $this->belongsTo(UserTrack::class, 'track_id');
    }
}
