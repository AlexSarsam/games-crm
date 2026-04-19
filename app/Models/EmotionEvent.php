<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmotionEvent extends Model
{
    protected $fillable = ['game_session_id', 'emotion', 'confidence', 'detected_at'];

    protected function casts(): array
    {
        return [
            'detected_at' => 'datetime',
            'confidence'  => 'float',
        ];
    }

    public function gameSession()
    {
        return $this->belongsTo(GameSession::class);
    }
}
