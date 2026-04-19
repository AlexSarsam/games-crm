<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class FaceRecognitionService
{
    private string $serviceUrl;

    public function __construct()
    {
        $this->serviceUrl = rtrim(config('services.face.url', 'http://localhost:5001'), '/');
    }

    public function compare(string $storedImagePath, string $webcamImageBase64): array
    {
        $storedImageBase64 = base64_encode(Storage::get($storedImagePath));

        set_time_limit(180);

        try {
            $response = Http::timeout(120)->post("{$this->serviceUrl}/compare", [
                'reference' => $storedImageBase64,
                'current'   => $webcamImageBase64,
            ]);
        } catch (ConnectionException) {
            return ['verified' => false, 'distance' => 1.0, 'threshold' => 0.0, 'error' => 'Servicio no disponible'];
        }

        if ($response->failed()) {
            return ['verified' => false, 'distance' => 1.0, 'threshold' => 0.0];
        }

        return $response->json();
    }
}
