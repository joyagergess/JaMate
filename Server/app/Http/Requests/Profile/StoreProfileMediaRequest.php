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
            'media_type' => ['required', 'string', 'in:image,video'],
            'media_file' => [
                'required',
                'file',
                'max:51200', 
            ],
        ];
    }
}
