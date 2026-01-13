<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'media_type'  => $this->media_type,
            'url'         => Storage::disk('public')->url($this->media_url),
            'order_index' => $this->order_index,
            'created_at'  => $this->created_at,
        ];
    }
}
