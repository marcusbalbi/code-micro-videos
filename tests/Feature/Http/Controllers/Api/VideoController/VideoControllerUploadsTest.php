<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Tests\Feature\Http\Controllers\Api\VideoController\BaseVideoControllerTestCase;
use Tests\Traits\TestUploads;

class VideoControllerUploadsTest extends BaseVideoControllerTestCase
{
    use TestUploads;

    public function testInvalidationThumbField()
    {
        $this->assertInvalidationFile(
            'thumb_file',
            'jpg',
            Video::THUMB_FILE_MAX_FILE,
            "image"
        );
    }

    public function testInvalidationBannerField()
    {
        $this->assertInvalidationFile(
            'banner_file',
            'jpg',
            Video::BANNER_FILE_MAX_FILE,
            "image"
        );
    }

    public function testInvalidationTrailerField()
    {
        $this->assertInvalidationFile(
            'trailer_file',
            'mp4',
            Video::TRAILER_FILE_MAX_FILE,
            "mimetypes",
            ['values' => 'video/mp4']
        );
    }

    public function testInvalidationVideoField()
    {
        $this->assertInvalidationFile(
            'video_file',
            'mp4',
            Video::VIDEO_FILE_MAX_FILE,
            "mimetypes",
            ['values' => 'video/mp4']
        );
    }

    public function testStoreWithFiles()
    {
        \Storage::fake();
        $files = $this->getFiles();
        $categories = factory(Category::class, 3)->create();
        $genres = factory(Genre::class, 2)->create();
        $genres[0]->categories()->sync($categories->pluck('id')->toArray());
        $genres[1]->categories()->sync($categories->pluck('id')->toArray());

        $response = $this->json('POST', $this->routeStore(), $this->sendData + [
            'categories_id' => $categories->pluck('id')->toArray(),
            'genres_id' => $genres->pluck('id')->toArray(),
        ] + $files);
        $response->assertStatus(201);
        $this->assertFilesOnPersist($response, $files);
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();
        $files = $this->getFiles();
        $categories = factory(Category::class, 3)->create();
        $genres = factory(Genre::class, 2)->create();
        $genres[0]->categories()->sync($categories->pluck('id')->toArray());
        $genres[1]->categories()->sync($categories->pluck('id')->toArray());

        $response = $this->json('PUT', $this->routeUpdate(), $this->sendData + [
            'categories_id' => $categories->pluck('id')->toArray(),
            'genres_id' => $genres->pluck('id')->toArray(),
        ] + $files);

        $response->assertStatus(200);
        $this->assertFilesOnPersist($response, $files);

        $newFiles = [
            'thumb_file' => UploadedFile::fake()->create('thumb_file.jpg'),
            'video_file' => UploadedFile::fake()->create('video_file.mp4'),
        ];

        $response = $this->json('PUT', $this->routeUpdate(), $this->sendData + [
            'categories_id' => $categories->pluck('id')->toArray(),
            'genres_id' => $genres->pluck('id')->toArray(),
        ] + $newFiles);
        $response->assertStatus(200);
        $this->assertFilesOnPersist($response, Arr::except($files, ['thumb_file', 'video_file']) + $newFiles);

        $id = $response->json('id');
        $video = Video::find($id);
        \Storage::assertMissing("{$video->relativeFilePath($files['thumb_file']->hashName())}");
        \Storage::assertMissing("{$video->relativeFilePath($files['video_file']->hashName())}");
    }

    protected function assertFilesOnPersist(TestResponse $response, $files)
    {
        $id = $response->json('id');
        $model = Video::find($id);
        $this->assertFilesExistsInStorage($model, $files);
    }

    protected function getFiles()
    {
        return [
            'video_file' => UploadedFile::fake()->create("video_file.mp4"),
            'trailer_file' => UploadedFile::fake()->create("trailer_file.mp4"),
            'thumb_file' => UploadedFile::fake()->create("thumb_file.jpg"),
            'banner_file' => UploadedFile::fake()->create("banner_file.jpg"),
        ];
    }
}
