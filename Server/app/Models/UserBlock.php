<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperUserBlock
 */
class UserBlock extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'blocker_profile_id',
        'blocked_profile_id',
    ];

    public function blocker()
    {
        return $this->belongsTo(Profile::class, 'blocker_profile_id');
    }

    public function blocked()
    {
        return $this->belongsTo(Profile::class, 'blocked_profile_id');
    }
}
