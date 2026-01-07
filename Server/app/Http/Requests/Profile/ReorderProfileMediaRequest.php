<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class ReorderProfileMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'media' => 'required|array',
            'media.*.id' => 'required|exists:profile_media,id',
            'media.*.order_index' => 'required|integer|min:0',
        ];
    }
}
