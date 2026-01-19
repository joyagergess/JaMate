<?php

namespace App\Http\Requests\Track;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTrackTitleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
        ];
    }
}
