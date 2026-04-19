<?php

use App\Models\Game;
use App\Support\GameplayAccess;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('game.{gameId}', function ($user, int $gameId) {
    $game = Game::find($gameId);

    if (! $game) {
        return false;
    }

    return GameplayAccess::isPlayer($user)
        && $game->is_published
        && GameplayAccess::hasRecentFaceVerification(request(), $user);
});
