<?php

namespace App\Http\Controllers;

use App\Services\FaceRecognitionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FaceController extends Controller
{
    // ── Enrolamiento ─────────────────────────────────────────────────────────

    public function enrollForm()
    {
        $user = auth()->user();
        return Inertia::render('Face/Enroll', [
            'hasEnrolled' => (bool) $user->face_image_path,
        ]);
    }

    public function enroll(Request $request)
    {
        $request->validate(['image' => 'required|string']);

        $usuario = auth()->user();
        $rutaImagen = "faces/user_{$usuario->id}.jpg";

        Storage::put($rutaImagen, base64_decode($this->quitarPrefijo($request->image)));
        $usuario->update(['face_image_path' => $rutaImagen]);

        return back()->with('success', 'Imagen facial registrada correctamente.');
    }

    // ── Verificación ─────────────────────────────────────────────────────────

    public function verifyForm()
    {
        $user = auth()->user();
        return Inertia::render('Face/Verify', [
            'hasEnrolled' => (bool) $user->face_image_path,
        ]);
    }

    public function verify(Request $request, FaceRecognitionService $faceService)
    {
        $request->validate(['image' => 'required|string']);

        $usuario = auth()->user();

        if (! $usuario->face_image_path) {
            return back()->withErrors(['image' => 'No tienes una imagen facial registrada.']);
        }

        $resultado = $faceService->compare($usuario->face_image_path, $this->quitarPrefijo($request->image));


        return back()->with([
            'verified'  => $resultado['verified'] ?? false,
            'distance'  => $resultado['distance'] ?? null,
            'threshold' => $resultado['threshold'] ?? null,
        ]);
    }

    private function quitarPrefijo(string $imagenBase64): string
    {
        return preg_replace('#^data:image/\w+;base64,#i', '', $imagenBase64);
    }
}
