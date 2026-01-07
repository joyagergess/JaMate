<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfileMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'media_type' => 'required|string|in:image,audio,video',
            'media_url'  => 'required|string|url|max:2048',
            'order_index'=> 'nullable|integer|min:0',
        ];
    }
}
