<?php


use App\Http\Controllers\FaceController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard: redirect to role-appropriate section
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user && $user->role) {
        if (in_array($user->role->name, ['admin', 'gestor'])) {
            return redirect()->route('games.index');
        }
        if ($user->role->name === 'jugador') {
            return redirect()->route('play.index');
        }
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin & Gestor — game management
Route::middleware(['auth', 'verified', 'role:admin,gestor'])->prefix('games')->name('games.')->group(function () {
    Route::get('/', [GameController::class, 'index'])->name('index');
    Route::get('/create', [GameController::class, 'create'])->name('create');
    Route::post('/', [GameController::class, 'store'])->name('store');
    Route::get('/{game}/edit', [GameController::class, 'edit'])->name('edit');
    Route::patch('/{game}', [GameController::class, 'update'])->name('update');
    Route::delete('/{game}', [GameController::class, 'destroy'])->name('destroy');
    Route::patch('/{game}/toggle-publish', [GameController::class, 'togglePublish'])->name('togglePublish');
});

// Jugador — play games
Route::middleware(['auth', 'verified', 'role:jugador'])->prefix('play')->name('play.')->group(function () {
    Route::get('/', [PlayerController::class, 'index'])->name('index');
    Route::get('/{game}', [PlayerController::class, 'show'])->name('show');
});

// Reconocimiento facial — todos los usuarios autenticados
Route::middleware(['auth', 'verified'])->prefix('face')->name('face.')->group(function () {
    Route::get('/enroll', [FaceController::class, 'enrollForm'])->name('enroll');
    Route::post('/enroll', [FaceController::class, 'enroll'])->name('enroll.store');
    Route::get('/verify', [FaceController::class, 'verifyForm'])->name('verify');
    Route::post('/verify', [FaceController::class, 'verify'])->name('verify.check');
});

require __DIR__.'/auth.php';
