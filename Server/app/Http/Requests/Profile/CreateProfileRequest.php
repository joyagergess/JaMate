<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class CreateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'required|in:male,female',
            'experience_level' => 'required|in:beginner,intermediate,advanced,pro',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',

            'instruments' => 'required|array|min:1',
            'instruments.*.name' => 'required|string|max:100',
            'instruments.*.level' => 'required|in:beginner,intermediate,advanced,pro',

            'genres' => 'required|array|min:1',
            'genres.*' => 'required|string|max:100',

            
            'objectives' => 'required|array|min:1',
            'objectives.*' => 'required|string|max:100',

            'media' => 'nullable|array',
            'media.*.media_type' => 'required|string',
            'media.*.media_url' => 'required|string',
            'media.*.order_index' => 'required|integer',
        ];
    }
}
