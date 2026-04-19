<?php

namespace App\Http\Middleware;

use App\Support\GameplayAccess;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFaceVerification
{
    public function handle(Request $request, Closure $next): Response
    {
        if (GameplayAccess::hasRecentFaceVerification($request)) {
            return $next($request);
        }

        $message = 'Necesitas verificar tu identidad con la camara antes de entrar al juego.';

        if ($request->expectsJson()) {
            return new JsonResponse(['message' => $message], 403);
        }

        return redirect()
            ->route('face.verify', ['redirect' => $request->getRequestUri()])
            ->with('error', $message);
    }
}
