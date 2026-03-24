<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\JsonResponse;

class GameController extends Controller
{
    public function index(): JsonResponse
    {
        $games = Game::where('is_published', true)
            ->select('id', 'title', 'description', 'url')
            ->latest()
            ->get();

        return response()->json($games);
    }
}
