<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperProfileObjective
 */
class ProfileObjective extends Model
{
    protected $table = 'profile_objectives';

    public $timestamps = false;

    protected $fillable = [
        'profile_id',
        'objective_id',
    ];
}
