<?php

namespace App\Support;

use App\Models\Game;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GameplayAccess
{
    public const VERIFIED_AT_KEY = 'face_verified_at';
    public const VERIFIED_USER_ID_KEY = 'face_verified_user_id';

    public static function canPlay(Request $request, Game $game): bool
    {
        return self::isPlayer($request->user())
            && $game->is_published
            && self::hasRecentFaceVerification($request);
    }

    public static function clearFaceVerification(Request $request): void
    {
        $request->session()->forget([
            self::VERIFIED_AT_KEY,
            self::VERIFIED_USER_ID_KEY,
        ]);
    }

    public static function faceVerificationTtl(): int
    {
        return (int) config('services.face.verification_ttl', 30);
    }

    public static function hasRecentFaceVerification(Request $request, ?User $user = null): bool
    {
        $user ??= $request->user();

        if (! $user) {
            return false;
        }

        $verifiedAt = $request->session()->get(self::VERIFIED_AT_KEY);
        $verifiedUserId = (int) $request->session()->get(self::VERIFIED_USER_ID_KEY);

        if (! $verifiedAt || $verifiedUserId !== $user->id) {
            return false;
        }

        try {
            return Carbon::parse($verifiedAt)->gte(now()->subMinutes(self::faceVerificationTtl()));
        } catch (\Throwable) {
            return false;
        }
    }

    public static function isPlayer(?User $user): bool
    {
        return $user?->role?->name === 'jugador';
    }

    public static function markFaceVerified(Request $request, User $user): void
    {
        
        $request->session()->put([
            self::VERIFIED_AT_KEY => now()->toIso8601String(),
            self::VERIFIED_USER_ID_KEY => $user->id,
        ]);
    }
}
