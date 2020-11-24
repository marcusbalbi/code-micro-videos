<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use App\Models\Genre;
use Illuminate\Http\UploadedFile;
use Tests\Feature\Http\Controllers\Api\VideoController\BaseVideoControllerTestCase;
use Tests\Traits\TestUploads;

class VideoControllerTest extends BaseVideoControllerTestCase
{
    use TestUploads;

    public function testInvalidationVideoField()
    {
        $this->assertInvalidationFile(
            'video_file',
            'mp4',
            12,
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
        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("$id/{$file->hashName()}");
        }
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
        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("$id/{$file->hashName()}");
        }
    }

    protected function getFiles()
    {
        return [
            'video_file' => UploadedFile::fake()->create("video_file.mp4")
        ];
    }
}
