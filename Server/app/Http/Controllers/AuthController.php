<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request)
    {
        $this->authService->register($request->validated());

        return $this->successResponse(
            null,
            'Verification email sent',
             201
        );
    }

    public function login(LoginRequest $request)
    {
        try {
            $token = $this->authService->login($request->validated());

            return $this->successResponse([
                'token' => $token,
            ]);
            
        } catch (AuthenticationException $e) {
            return $this->errorResponse(
                $e->getMessage(),
                401
            );
        } catch (HttpException $e) {
            return $this->errorResponse(
                $e->getMessage(),
                $e->getStatusCode()
            );
        }
    }

    public function logout()
    {
        $this->authService->logout();

        return $this->successResponse(
            null,
            'Logged out'
        );
    }
  
}
