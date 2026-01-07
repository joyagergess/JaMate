<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAuthProvider
 */
class AuthProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'provider',
        'provider_user_id',
    ];

    protected $casts = [
        'provider' => 'string',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
