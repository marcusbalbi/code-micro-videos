<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\VideoController;
use App\Models\Category;
use App\Models\Genre;
use Tests\TestCase;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;
use Illuminate\Http\Request;
use \Tests\Exceptions\TestException;

class VideoControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $video;
    private $sendData;
    protected function setUp(): void
    {
        parent::setUp();

        $this->sendData = [
            'title' => 'some Title',
            'description' => 'short description',
            'year_launched' => 1983,
            'rating' => Video::RATING_LIST[0],
            'duration' => 30
        ];
        $this->video = factory(Video::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));
        $response->assertStatus(200)
            ->assertJson([$this->video->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('videos.show', ['video' => $this->video->id]));

        $response->assertStatus(200)
            ->assertJson($this->video->toArray());
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

    public function testSave()
    {

        $categories = factory(Category::class, 3)->create();
        $genres = factory(Genre::class, 2)->create();

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
            $response->assertJsonStructure(['created_at', 'updated_at']);
            $video = Video::find($response->json('id'));
            $video->load('categories');
            $video->load('genres');
            $this->assertEqualsCanonicalizing($video->categories->pluck("id")->toArray(), $extra['categories_id']);
            $this->assertEqualsCanonicalizing($video->genres->pluck("id")->toArray(), $extra['genres_id']);

            $response = $this->assertUpdate($value['send_data'], $value['test_data'] + ['deleted_at' => null]);
            $response->assertJsonStructure(['created_at', 'updated_at']);
            $video->load('categories');
            $video->load('genres');
            $this->assertEqualsCanonicalizing($video->categories->pluck("id")->toArray(), $extra['categories_id']);
            $this->assertEqualsCanonicalizing($video->genres->pluck("id")->toArray(), $extra['genres_id']);

        }
    }

    public function testRollbackStore()
    {
        $controller = \Mockery::mock(VideoController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
        $controller->shouldReceive('validate')->WithAnyArgs()->andReturn($this->sendData);
        $controller->shouldReceive('rulesStore')->WithAnyArgs()->andReturn([]);
        $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);


        try {
            $controller->store($request);
        } catch (TestException $e) {
            $this->assertCount(1, Video::all());
        }
    }

    public function testRemove()
    {
        $video = factory(Video::class)->create();

        $response = $this->json('DELETE', route('videos.destroy', ['video' => $video->id]));
        $response->assertStatus(204);

        $this->assertNull(Video::find($video->id));
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
