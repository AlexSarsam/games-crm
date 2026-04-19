<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $gestor = Role::firstOrCreate(['name' => 'gestor']);
        $jugador = Role::firstOrCreate(['name' => 'jugador']);

        $adminUser = User::updateOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin',
            'password' => Hash::make('password'),
            'role_id' => $admin->id,
        ]);

        User::updateOrCreate([
            'email' => 'gestor@example.com',
        ], [
            'name' => 'Gestor',
            'password' => Hash::make('password'),
            'role_id' => $gestor->id,
        ]);

        User::updateOrCreate([
            'email' => 'jugador@example.com',
        ], [
            'name' => 'Jugador',
            'password' => Hash::make('password'),
            'role_id' => $jugador->id,
        ]);

        Game::updateOrCreate([
            'title' => 'Runner 3D',
        ], [
            'description' => 'Juego 3D desarrollado con Three.js y Vue. Esquiva obstaculos y recoge monedas.',
            'url' => '/Runner3D/dist/index.html',
            'is_published' => true,
            'user_id' => $adminUser->id,
        ]);
    }
}
