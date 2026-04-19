<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('role:id,name')
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'role_id', 'created_at']),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit', [
            'roles' => Role::orderBy('name')->get(['id', 'name']),
            'user' => $user->load('role:id,name'),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $selectedRole = Role::findOrFail($validated['role_id']);

        if ($request->user()->is($user) && $selectedRole->name !== 'admin') {
            return back()->withErrors([
                'role_id' => 'No puedes quitarte a ti mismo el rol de administrador.',
            ]);
        }

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'Usuario actualizado correctamente.');
    }
}
