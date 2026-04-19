<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    public function index(): Response
    {
        $games = Game::where('is_published', true)->latest()->get();

        return Inertia::render('Player/Index', [
            'games' => $games,
        ]);
    }

    public function show(Game $game): Response
    {
        abort_unless($game->is_published, 404);

        return Inertia::render('Player/Play', [
            'game' => $game,
        ]);
    }
}
