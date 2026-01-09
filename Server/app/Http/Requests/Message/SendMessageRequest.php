<?php

namespace App\Http\Requests\Message;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => [
                'sometimes',
                'string',
                'in:text,voice,track,system',
            ],

            'body' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'voice_url' => [
                'nullable',
                'string',
                'url',
            ],

            'track_id' => [
                'nullable',
                'integer',
                'exists:user_tracks,id',
            ],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (
                empty($this->body) &&
                empty($this->voice_url) &&
                empty($this->track_id)
            ) {
                $validator->errors()->add(
                    'message',
                    'Message must contain text, voice, or track.'
                );
            }
        });
    }
}
