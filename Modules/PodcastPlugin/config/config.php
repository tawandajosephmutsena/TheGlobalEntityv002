<?php

return [
    'name' => 'PodcastPlugin',

    /*
    |--------------------------------------------------------------------------
    | Upload Settings
    |--------------------------------------------------------------------------
    */
    'max_upload_size' => 500 * 1024 * 1024, // 500 MB
    'allowed_audio_formats' => ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'],
    'allowed_video_formats' => ['mp4', 'webm', 'mov'],
    'allowed_image_formats' => ['jpg', 'jpeg', 'png', 'webp'],

    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    */
    'enable_video' => true,
    'enable_analytics' => true,
    'enable_social_sharing' => true,
    'episodes_per_page' => 12,
];
