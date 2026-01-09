<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InternalAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $expectedKey = config('services.internal.key');
        $providedKey = $request->header('X-Internal-Key');

        if (!$expectedKey || $providedKey !== $expectedKey) {
            return response()->json([
                'message' => 'Unauthorized internal request',
            ], 403);
        }

        return $next($request);
    }
}
