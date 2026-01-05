<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'profile_id',
        'type',
        'data',
        'is_read',
    ];

    protected $casts = [
        'type'    => 'string',  
        'data'    => 'array',
        'is_read' => 'boolean',
    ];

 
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
