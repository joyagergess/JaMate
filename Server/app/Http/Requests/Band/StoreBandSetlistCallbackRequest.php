<?php

namespace App\Http\Requests\Band;

use Illuminate\Foundation\Http\FormRequest;

class StoreBandSetlistCallbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'band_id' => ['required', 'integer'],
            'setlist' => ['required', 'array'],
        ];
    }
}
