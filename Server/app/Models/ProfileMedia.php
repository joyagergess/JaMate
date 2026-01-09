<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProfileMedia extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'profile_id',
        'media_type',
        'media_url',
        'order_index',
    ];

    protected $casts = [
        'order_index' => 'integer',
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
