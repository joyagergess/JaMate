<?php

namespace App\Http\Requests\Track;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'audio' => 'required|file|max:20000',
            'duration' => 'required|integer|min:1',
            'track_type' => 'required|in:snippet,recording',
        ];
    }
}
