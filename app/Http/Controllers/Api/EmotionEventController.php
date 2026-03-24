<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmotionEvent;
use App\Models\GameSession;
use Illuminate\Http\Request;

class EmotionEventController extends Controller
{
    /**
     * POST /api/games/{game}/sessions/{session}/emotions
     *
     * Registra un evento emocional durante una sesión de juego.
     * El cliente (navegador con face-api.js) llama a este endpoint cada N segundos.
     */
    public function store(Request $request, int $gameId, GameSession $session)
    {
        // Solo el propietario de la sesión puede registrar emociones
        if ($session->user_id !== auth()->id()) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'emotion'     => 'required|string|max:50',
            'confidence'  => 'required|numeric|min:0|max:1',
            'detected_at' => 'required|date',
        ]);

        $event = EmotionEvent::create([
            'game_session_id' => $session->id,
            'emotion'         => $validated['emotion'],
            'confidence'      => $validated['confidence'],
            'detected_at'     => $validated['detected_at'],
        ]);

        return response()->json($event, 201);
    }
}
