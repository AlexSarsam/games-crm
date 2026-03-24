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
        // Create roles
        $admin   = Role::create(['name' => 'admin']);
        $gestor  = Role::create(['name' => 'gestor']);
        $jugador = Role::create(['name' => 'jugador']);

        // Create users
        $adminUser = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id'  => $admin->id,
        ]);

        User::create([
            'name'     => 'Gestor',
            'email'    => 'gestor@example.com',
            'password' => Hash::make('password'),
            'role_id'  => $gestor->id,
        ]);

        User::create([
            'name'     => 'Jugador',
            'email'    => 'jugador@example.com',
            'password' => Hash::make('password'),
            'role_id'  => $jugador->id,
        ]);

        // Create sample game
        Game::create([
            'title'        => 'Runner 3D',
            'description'  => 'Juego 3D desarrollado con Three.js y Vue. Esquiva obstáculos y recoge monedas.',
            'url'          => '/Runner3D/dist/index.html',
            'is_published' => true,
            'user_id'      => $adminUser->id,
        ]);
    }
}
