<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\EmailVerificationService;
use App\Http\Requests\ResendVerificationRequest;

class EmailVerificationController extends Controller
{
    public function __construct(
        protected EmailVerificationService $service
    ) {}

    public function verify(Request $request, int $id, string $hash)
    {
        try {
            $this->service->verify($request, $id, $hash);

            return $this->successResponse(
                null,
                'Email verified successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                $e->getMessage(),
                403
            );
        }
    }

    public function resend(ResendVerificationRequest $request)
    {
        try {
            $this->service->resend($request->user());

            return $this->successResponse(
                null,
                'Verification email resent'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                $e->getMessage(),
                400
            );
        }
    }
}
