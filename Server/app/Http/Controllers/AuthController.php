<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;


class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request)
    {
        $this->authService->register(
            $request->validated()
        );

        return $this->successResponse(null,'Verification email sent',201 );
    }

    public function login(LoginRequest $request)
    {
        $token = $this->authService->login(
            $request->validated()
        );

        return $this->successResponse([ 'token' => $token,]);
    }

    public function logout()
    {
        $this->authService->logout();

        return $this->successResponse(  null, 'Logged out');
    }
}
