<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\CreateProfileRequest;
use App\Services\ProfileService;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService
    ) {}

    public function create(CreateProfileRequest $request)
    {
        try {
            $profile = $this->profileService->create(
                $request->user(),
                $request->validated()
            );

            return $this->successResponse($profile, 'Profile created successfully', 201);
        } catch (HttpException $e) {
            return $this->errorResponse($e->getMessage(), $e->getStatusCode());
        } catch (\Throwable $e) {
            return $this->errorResponse('Internal server error', 500);
        }
    }

    public function update(CreateProfileRequest $request)
    {
        try {
            $profile = $this->profileService->update(
                $request->user(),
                $request->validated()
            );

            return $this->successResponse($profile, 'Profile updated successfully');
        } catch (HttpException $e) {
            return $this->errorResponse($e->getMessage(), $e->getStatusCode());
        }
    }

    public function get(Request $request)
    {
        try {
            $profile = $this->profileService->get($request->user());
            return $this->successResponse($profile, 'Profile fetched successfully');
        } catch (HttpException $e) {
            return $this->errorResponse($e->getMessage(), $e->getStatusCode());
        }
    }

    public function show(Profile $profile)
    {
        $profile = $this->profileService->show($profile);

        return $this->successResponse(
            $profile,
            'Profile fetched successfully'
        );
    }
    
}
