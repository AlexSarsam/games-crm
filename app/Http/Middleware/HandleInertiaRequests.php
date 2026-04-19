<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->load('role'),
            ],
            'flash' => [
                'verified'  => $request->session()->get('verified'),
                'distance'  => $request->session()->get('distance'),
                'threshold' => $request->session()->get('threshold'),
                'success'   => $request->session()->get('success'),
                'error'     => $request->session()->get('error'),
            ],
        ];
    }
}
