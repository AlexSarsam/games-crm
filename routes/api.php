<?php

use App\Http\Controllers\Api\EmotionEventController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\GameSessionController;
use Illuminate\Support\Facades\Route;

Route::get('/games', [GameController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/games/{game}/sessions', [GameSessionController::class, 'store']);
    Route::patch('/games/{game}/sessions/{session}', [GameSessionController::class, 'update']);
    Route::post('/games/{game}/sessions/{session}/emotions', [EmotionEventController::class, 'store']);
});
