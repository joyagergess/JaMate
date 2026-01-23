<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'internal' => [
        'key' => env('INTERNAL_API_KEY'),
    ],
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),

        'embedding_model' => env(
            'OPENAI_EMBEDDING_MODEL',
            'text-embedding-3-large'
        ),

        'chat_model' => env(
            'OPENAI_CHAT_MODEL',
            'gpt-4o-mini'
        ),
    ],
    'ai_music' => [
        'url' => env('AI_MUSIC_SERVICE_URL', 'http://localhost:8001'),
    ],
    'n8n' => [
        'band_setlist_webhook' => env('N8N_BAND_SETLIST_WEBHOOK'),
        'webhook_secret' => env('N8N_WEBHOOK_SECRET'),

    ],

];
