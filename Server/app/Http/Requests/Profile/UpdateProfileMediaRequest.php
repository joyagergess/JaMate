<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'media_type' => 'sometimes|string|in:image,audio,video',
            'media_url'  => 'sometimes|string|url|max:2048',
            'order_index'=> 'sometimes|integer|min:0',
        ];
    }
}
