<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin IdeHelperUserReport
 */
class UserReport extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'reporter_profile_id',
        'reported_profile_id',
        'reason',
        'description',
    ];

  
    public function reporter()
    {
        return $this->belongsTo(Profile::class, 'reporter_profile_id');
    }

    public function reported()
    {
        return $this->belongsTo(Profile::class, 'reported_profile_id');
    }
}
