<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\Game;
use App\Support\GameplayAccess;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function index(Request $request, Game $game)
    {
        abort_unless(GameplayAccess::canPlay($request, $game), 403, 'No puedes acceder al chat de este juego.');

        return ChatMessage::with('user:id,name')
            ->where('game_id', $game->id)
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values();
    }

    public function store(Request $request, Game $game)
    {
        abort_unless(GameplayAccess::canPlay($request, $game), 403, 'No puedes enviar mensajes en este juego.');

        $validated = $request->validate([
            'body' => 'required|string|max:500',
        ]);

        $message = ChatMessage::create([
            'game_id' => $game->id,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        $message->load('user:id,name');

        MessageSent::dispatch($message);

        return response()->json($message, 201);
    }
}
