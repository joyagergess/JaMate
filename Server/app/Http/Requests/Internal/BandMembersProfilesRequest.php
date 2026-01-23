<?php

namespace App\Http\Requests\Internal;

use Illuminate\Foundation\Http\FormRequest;

class BandMembersProfilesRequest extends FormRequest
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
