<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\VideoResource;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Tests\Traits\TestSaves;
use Tests\Feature\Http\Controllers\Api\VideoController\BaseVideoControllerTestCase;
use Tests\Traits\TestResources;

class VideoControllerCrudTest extends BaseVideoControllerTestCase
{
    use TestSaves, TestResources;

    private $fieldsSerialized = [
        'id',
        'title',
        'description',
        'year_launched',
        'rating',
        'duration',
        'opened',
        'thumb_file_url',
        'banner_file_url',
        'video_file_url',
        'trailer_file_url',
        'created_at',
        'updated_at',
        'deleted_at',
        'categories' => [
            '*' => [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ],
        'genres' => [
            '*' => [
                'id',
                'name',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ]
    ];

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => $this->fieldsSerialized
                ],
                'meta' => [],
                'links' => []
            ]);
        $this->assertResource($response, VideoResource::collection(collect([$this->video])));
        $this->assertIfFilesUrlExists($this->video, $response);
    }

    public function testShow()
    {
        $response = $this->get(route('videos.show', ['video' => $this->video->id]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->fieldsSerialized
            ])->assertJsonFragment($this->video->toArray());

        $this->assertResource($response, new VideoResource($this->video));
        $this->assertIfFilesUrlExists($this->video, $response);
    }

    public function testInvalidationRequired()
    {
        $data = [
            'title' => '',
            'description' => '',
            'year_launched' => '',
            'rating' => '',
            'duration' => '',
            'categories_id' => '',
            'genres_id' => ''
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidationMax()
    {
        $data = [
            'title' => str_repeat('a', 256),
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidationCategoriesId()
    {
        $data = [
            'categories_id' => 'a',
        ];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'categories_id' => [999],
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create();
        $category->delete();
        $data = [
            'categories_id' => [$category->id]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testInvalidationGenresId()
    {
        $data = [
            'genres_id' => 'a',
        ];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'genres_id' => [999],
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $genre = factory(Genre::class)->create();
        $genre->delete();
        $data = [
            'genres_id' => [$genre->id]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testInvalidationInteger()
    {
        $data = [
            'duration' => 's',
        ];
        $this->assertInvalidationInStoreAction($data, 'integer');
        $this->assertInvalidationInUpdateAction($data, 'integer');
    }

    public function testInvalidationYearLaunched()
    {
        $data = [
            'year_launched' => 'a',
        ];

        $this->assertInvalidationInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidationInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidationOpened()
    {
        $data = [
            'opened' => 't',
        ];

        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    public function testInvalidationRating()
    {
        $data = [
            'rating' => 'PP',
        ];

        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    public function testSaveWithoutFile()
    {

        $categories = factory(Category::class, 3)->create();
        $genres = factory(Genre::class, 2)->create();
        $genres[0]->categories()->sync($categories->pluck('id')->toArray());
        $genres[1]->categories()->sync($categories->pluck('id')->toArray());

        $extra = [
            'categories_id' => $categories->pluck('id')->toArray(),
            'genres_id' => $genres->pluck('id')->toArray(),
        ];

        $data = [
            [
                'send_data' => $this->sendData + $extra,
                'test_data' => $this->sendData,
            ],
            [
                'send_data' => $this->sendData + ['opened' => true] + $extra,
                'test_data' => $this->sendData + ['opened' => true],
            ],
            [
                'send_data' => $this->sendData + ['rating' => Video::RATING_LIST[1]] + $extra,
                'test_data' => $this->sendData + ['rating' => Video::RATING_LIST[1]],
            ]
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore($value['send_data'], $value['test_data'] + ['deleted_at' => null]);
            $response->assertJsonStructure([
                'data' => $this->fieldsSerialized
            ]);
            $video = Video::find($response->json('data.id'));
            $this->assertResource($response, new VideoResource($video));
            $this->assertIfFilesUrlExists($video, $response);
            $video->load('categories');
            $video->load('genres');
            $this->assertEqualsCanonicalizing($video->categories->pluck("id")->toArray(), $extra['categories_id']);
            $this->assertEqualsCanonicalizing($video->genres->pluck("id")->toArray(), $extra['genres_id']);

            $video = Video::find($this->video->id);
            $response = $this->assertUpdate($value['send_data'], $value['test_data'] + ['deleted_at' => null]);
            $response->assertJsonStructure([
                'data' => $this->fieldsSerialized
            ]);
            $video = Video::find($response->json('data.id'));
            $this->assertResource($response, new VideoResource($video));
            $this->assertIfFilesUrlExists($video, $response);
            $video->load('categories');
            $video->load('genres');
            $this->assertEqualsCanonicalizing($video->categories->pluck("id")->toArray(), $extra['categories_id']);
            $this->assertEqualsCanonicalizing($video->genres->pluck("id")->toArray(), $extra['genres_id']);
        }
    }

    // public function testRollbackStore()
    // {
    //     $controller = \Mockery::mock(VideoController::class)
    //         ->makePartial()
    //         ->shouldAllowMockingProtectedMethods();
    //     $controller->shouldReceive('validate')->WithAnyArgs()->andReturn($this->sendData);
    //     $controller->shouldReceive('rulesStore')->WithAnyArgs()->andReturn([]);
    //     $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

    //     $request = \Mockery::mock(Request::class);

    //     $request->shouldReceive('get')->WithAnyArgs()->andReturnNull();

    //     $hasErrors = false;
    //     try {
    //         $controller->store($request);
    //     } catch (TestException $e) {
    //         $this->assertCount(1, Video::all());
    //         $hasErrors = true;
    //     }
    //     $this->assertTrue($hasErrors);
    // }

    // public function testRollbackUpdate()
    // {
    //     $controller = \Mockery::mock(VideoController::class)
    //         ->makePartial()
    //         ->shouldAllowMockingProtectedMethods();

    //     $controller->shouldReceive('findOrFail')->WithAnyArgs()->andReturn($this->video);

    //     $controller->shouldReceive('validate')->WithAnyArgs()->andReturn(['name' => 'test']);
    //     $controller->shouldReceive('rulesUpdate')->WithAnyArgs()->andReturn([]);
    //     $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

    //     $request = \Mockery::mock(Request::class);

    //     $request->shouldReceive('get')->WithAnyArgs()->andReturnNull();

    //     $hasErrors = false;
    //     try {
    //         $controller->update($request, 1);
    //     } catch (TestException $e) {
    //         $this->assertCount(1, Video::all());
    //         $hasErrors = true;
    //     }

    //     $this->assertTrue($hasErrors);
    // }

    public function testSyncGenres()
    {
        $genres = factory(Genre::class, 3)->create();
        $genres_id = $genres->pluck('id')->toArray();
        $category_id = factory(Category::class)->create()->id;
        $genres->each(function ($genre) use ($category_id) {
            $genre->categories()->sync($category_id);
        });

        $extra = [
            'categories_id' => [$category_id],
            'genres_id' => [$genres_id[0]]
        ];

        $response = $this->json('POST', $this->routeStore(), $this->sendData + $extra);
        $this->assertDatabaseHas('genre_video', [
            'video_id' => $response->json('data.id'),
            'genre_id' => $genres_id[0]
        ]);

        $extra = [
            'categories_id' => [$category_id],
            'genres_id' => [$genres_id[1], $genres_id[2]]
        ];
        $response = $this->json('PUT', route('videos.update', ['video' => $response->json('data.id')]), $this->sendData + $extra);

        $this->assertDatabaseMissing('genre_video', [
            'video_id' => $response->json('data.id'),
            'genre_id' => $genres_id[0]
        ]);
        $this->assertDatabaseHas('genre_video', [
            'video_id' => $response->json('data.id'),
            'genre_id' => $genres_id[1]
        ]);
        $this->assertDatabaseHas('genre_video', [
            'video_id' => $response->json('data.id'),
            'genre_id' => $genres_id[2]
        ]);
    }

    public function testSyncCategories()
    {
        $categories_id = factory(Category::class, 3)->create()->pluck('id')->toArray();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($categories_id);

        $extra = [
            'categories_id' => [$categories_id[0]],
            'genres_id' => [$genre->id]
        ];

        $response = $this->json('POST', $this->routeStore(), $this->sendData + $extra);
        $this->assertDatabaseHas('category_video', [
            'video_id' => $response->json('data.id'),
            'category_id' => $categories_id[0]
        ]);

        $extra = [
            'categories_id' => [$categories_id[1], $categories_id[2]],
            'genres_id' => [$genre->id]
        ];
        $response = $this->json('PUT', route('videos.update', ['video' => $response->json('data.id')]), $this->sendData + $extra);
        $this->assertDatabaseMissing('category_video', [
            'video_id' => $response->json('data.id'),
            'category_id' => $categories_id[0]
        ]);
        $this->assertDatabaseHas('category_video', [
            'video_id' => $response->json('data.id'),
            'category_id' => $categories_id[1]
        ]);
        $this->assertDatabaseHas('category_video', [
            'video_id' => $response->json('data.id'),
            'category_id' => $categories_id[2]
        ]);
    }

    public function testRemove()
    {
        $video = factory(Video::class)->create();

        $response = $this->json('DELETE', route('videos.destroy', ['video' => $video->id]));
        $response->assertStatus(204);

        $this->assertNull(Video::find($video->id));
    }
}
