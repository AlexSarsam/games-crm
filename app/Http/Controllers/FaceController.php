<?php

namespace App\Http\Controllers;

use App\Support\GameplayAccess;
use App\Services\FaceRecognitionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FaceController extends Controller
{
    public function enrollForm()
    {
        return Inertia::render('Face/Enroll', [
            'hasEnrolled' => (bool) auth()->user()->face_image_path,
        ]);
    }

    public function enroll(Request $request)
    {
        $request->validate(['image' => 'required|string']);

        $user = auth()->user();
        $path = "faces/user_{$user->id}.jpg";

        Storage::put($path, base64_decode($this->stripBase64Prefix($request->image)));
        $user->update(['face_image_path' => $path]);
        GameplayAccess::clearFaceVerification($request);

        return back()->with('success', 'Imagen facial registrada correctamente.');
    }

    public function verifyForm()
    {
        return Inertia::render('Face/Verify', [
            'hasEnrolled' => (bool) auth()->user()->face_image_path,
            'redirectTo'  => request()->query('redirect'),
        ]);
    }

    public function verify(Request $request, FaceRecognitionService $faceService)
    {
        $request->validate([
            'image'    => 'required|string',
            'redirect' => 'nullable|string|max:500',
        ]);

        $user = auth()->user();

        if (! $user->face_image_path) {
            return back()->withErrors(['image' => 'No tienes una imagen facial registrada.']);
        }

        $result = $faceService->compare($user->face_image_path, $this->stripBase64Prefix($request->image));

        if (($result['verified'] ?? false) === true) {
            GameplayAccess::markFaceVerified($request, $user);

            $redirectTo = $request->string('redirect')->toString();

            if ($this->isSafeInternalPath($redirectTo)) {
                return redirect($redirectTo)->with('success', 'Identidad verificada correctamente.');
            }
        } else {
            GameplayAccess::clearFaceVerification($request);
        }

        return back()->with([
            'verified'  => $result['verified'] ?? false,
            'distance'  => $result['distance'] ?? null,
            'threshold' => $result['threshold'] ?? null,
            'error'     => $result['error'] ?? null,
        ]);
    }

    private function isSafeInternalPath(?string $path): bool
    {
        return filled($path)
            && Str::startsWith($path, '/')
            && ! Str::startsWith($path, '//');
    }

    private function stripBase64Prefix(string $base64Image): string
    {
        return preg_replace('#^data:image/\w+;base64,#i', '', $base64Image);
    }
}
