<?php

return [
    'face' => [
        'url' => env('FACE_SERVICE_URL', 'http://localhost:5001'),
        'verification_ttl' => env('FACE_VERIFICATION_TTL', 30),
    ],
];
