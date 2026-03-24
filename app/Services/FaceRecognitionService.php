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

    /**
     * Compare the stored reference image against a current base64 image.
     */
    public function compare(string $rutaFotoGuardada, string $fotoWebcamBase64): array
    {
        $fotoGuardadaBase64 = base64_encode(Storage::get($rutaFotoGuardada));

        set_time_limit(180);

        try {
            $respuesta = Http::timeout(120)->post("{$this->serviceUrl}/compare", [
                'reference' => $fotoGuardadaBase64,
                'current'   => $fotoWebcamBase64,
            ]);
        } catch (ConnectionException) {
            return ['verified' => false, 'distance' => 1.0, 'threshold' => 0.0, 'error' => 'Servicio no disponible'];
        }

        if ($respuesta->failed()) {
            return ['verified' => false, 'distance' => 1.0, 'threshold' => 0.0];
        }

        return $respuesta->json();
    }
}
