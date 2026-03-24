<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(): Response
    {
        $games = Game::with('creator')->latest()->get();

        return Inertia::render('Games/Index', [
            'games' => $games,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Games/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'url'         => 'required|url|max:255',
        ]);

        $validated['user_id']      = $request->user()->id;
        $validated['is_published'] = false;

        Game::create($validated);

        return redirect()->route('games.index')->with('success', 'Juego creado correctamente.');
    }

    public function edit(Game $game): Response
    {
        return Inertia::render('Games/Edit', [
            'game' => $game,
        ]);
    }

    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'url'         => 'required|url|max:255',
        ]);

        $game->update($validated);

        return redirect()->route('games.index')->with('success', 'Juego actualizado correctamente.');
    }

    public function destroy(Game $game)
    {
        $game->delete();

        return redirect()->route('games.index')->with('success', 'Juego eliminado correctamente.');
    }

    public function togglePublish(Game $game)
    {
        $game->update(['is_published' => !$game->is_published]);

        return redirect()->route('games.index')->with('success', 'Estado de publicación actualizado.');
    }
}
