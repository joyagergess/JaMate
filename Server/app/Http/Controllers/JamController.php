<?php

namespace App\Http\Controllers;

use App\Http\Requests\Jam\AnalyzeJamRequest;
use App\Services\JamAnalysisService;
use App\Traits\ApiResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

class JamController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected JamAnalysisService $jamService
    ) {}

    
    public function analyze(AnalyzeJamRequest $request)
    {
        try {
            $result = $this->jamService->analyze(
                $request->user(),
                $request->validated()
            );

            return $this->successResponse(
                $result,
                'Jam analysis completed successfully'
            );

        } catch (HttpException $e) {
            return $this->errorResponse(
                $e->getMessage(),
                null,
                $e->getStatusCode()
            );

        } catch (\Throwable $e) {
            return $this->errorResponse(
                'Internal server error',
                null,
                500
            );
        }
    }
}
