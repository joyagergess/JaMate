<?php

namespace App\Http\Requests\Jam;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeJamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'track_a_id' => ['required', 'integer', 'exists:user_tracks,id'],
            'track_b_id' => ['required', 'integer', 'exists:user_tracks,id'],
        ];
    }
}
