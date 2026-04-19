<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameSession;
use App\Support\GameplayAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameSessionController extends Controller
{
    public function store(Request $request, Game $game): JsonResponse
    {
        abort_unless(GameplayAccess::canPlay($request, $game), 403, 'Necesitas verificar tu identidad antes de empezar una partida.');

        $session = GameSession::create([
            'user_id' => $request->user()->id,
            'game_id' => $game->id,
            'started_at' => now(),
        ]);

        return response()->json([
            'session_id' => $session->id,
            'started_at' => $session->started_at,
        ], 201);
    }

    public function update(Request $request, Game $game, GameSession $session): JsonResponse
    {
        abort_unless(
            $game->is_published && $session->game_id === $game->id && $session->user_id === $request->user()->id,
            403
        );

        $validated = $request->validate([
            'score' => 'required|integer|min:0',
        ]);

        $session->update([
            'ended_at' => now(),
            'score' => $validated['score'],
        ]);

        return response()->json($session->fresh());
    }
}
