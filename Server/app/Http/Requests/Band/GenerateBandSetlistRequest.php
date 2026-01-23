<?php

namespace App\Http\Requests\Band;

use Illuminate\Foundation\Http\FormRequest;

class GenerateBandSetlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'band_id' => ['required', 'integer', 'exists:bands,id'],
        ];
    }
}
