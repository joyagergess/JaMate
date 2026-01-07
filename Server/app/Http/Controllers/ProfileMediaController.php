<?php 
namespace App\Http\Controllers;

use App\Models\ProfileMedia;
use App\Services\ProfileMediaService;
use App\Http\Requests\Profile\StoreProfileMediaRequest;
use App\Http\Requests\Profile\UpdateProfileMediaRequest;
use App\Http\Requests\Profile\ReorderProfileMediaRequest;
use Illuminate\Http\Request;

class ProfileMediaController extends Controller
{
    public function __construct(
        protected ProfileMediaService $profileMediaService
    ) {}

    
    public function get(Request $request)
    {
        $media = $this->profileMediaService->getForUser(
            $request->user()
        );

        return $this->successResponse(
            $media,
            'Profile media fetched successfully'
        );
    }

    public function store(StoreProfileMediaRequest $request)
    {
        $media = $this->profileMediaService->store(
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            $media,
            'Media added successfully',
            201
        );
    }

    public function update(UpdateProfileMediaRequest $request, ProfileMedia $media)
    {
        if ($media->profile->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $media = $this->profileMediaService->update(
            $media,
            $request->validated()
        );

        return $this->successResponse(
            $media,
            'Media updated successfully'
        );
    }

    public function destroy(Request $request, ProfileMedia $media)
    {
        if ($media->profile->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $this->profileMediaService->delete($media);

        return $this->successResponse(
            null,
            'Media deleted successfully'
        );
    }

    public function reorder(ReorderProfileMediaRequest $request)
    {
        $this->profileMediaService->reorder(
            $request->user(),
            $request->validated()['media']
        );

        return $this->successResponse(
            null,
            'Media reordered successfully'
        );
    }
}
