<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'media_type'  => $this->media_type,
            'order_index' => $this->order_index,

         
            'url' => $this->media_type === 'video'
                ? secure_url('/api/v0.1/media/' . $this->media_url)
                : secure_url('/storage/' . $this->media_url),

            'thumbnail_url' => $this->media_type === 'video' && $this->thumbnail_url
                ? secure_url('/storage/' . $this->thumbnail_url)
                : null,
        ];
    }
}
