<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emotion_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_session_id')->constrained('game_sessions')->cascadeOnDelete();
            $table->string('emotion');
            $table->float('confidence');
            $table->timestamp('detected_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emotion_events');
    }
};
