<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\CreateProfileRequest;
use App\Services\ProfileService;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    public function create(CreateProfileRequest $request)
    {
        try {
            $profile = $this->profileService->create(
                auth()->user(),
                $request->validated()
            );

            return $this->successResponse(
                $profile,
                'Profile created successfully',
                201
            );

        } catch (HttpException $e) {
            return $this->errorResponse(
                $e->getMessage(),
                $e->getStatusCode()
            );

        } catch (\Throwable $e) {
    return $this->errorResponse(
        $e->getMessage(),
        500
    );
}

        }
    }

