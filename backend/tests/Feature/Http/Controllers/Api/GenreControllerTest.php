<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\GenreController;
use App\Http\Resources\GenreResource;
use App\Models\Category;
use Tests\TestCase;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Exceptions\TestException;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;
use Illuminate\Http\Request;
use Tests\Traits\TestResources;
class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;

    private $genre;
    private $fieldsSerialized = [
        'id',
        'name',
        'is_active',
        'created_at',
        'updated_at',
        'deleted_at',
        // 'categories' => [
        //     '*' => [
        //         'id',
        //         'name',
        //         'description',
        //         'is_active',
        //         'created_at',
        //         'updated_at',
        //         'deleted_at',
        //     ]
        // ]
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->genre = factory(Genre::class)->create();
    }

    public function testIndex()
    {
        $route = route('genres.index');
        $response = $this->get($route);
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => $this->fieldsSerialized
                ],
                'meta' => [],
                'links' => []
            ]);

        $this->assertResource($response, GenreResource::collection(collect([$this->genre])));
    }

    //TODO create test to test withCategories property

    public function testShow()
    {
        $route = route('genres.show', ['genre' => $this->genre->id]);

        $response = $this->get($route);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->fieldsSerialized
            ])->assertJsonFragment($this->genre->toArray());

        $this->assertResource($response, new GenreResource($this->genre));
    }

    public function testInvalidationData()
    {
        $data = ['name' => '', 'categories_id' => ''];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = ['is_active' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');

        $data = ['categories_id' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = ['categories_id' => [100]];
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

    public function testStore()
    {
        $categories = factory(Category::class, 2)->create();
        $data = [
            'name' => 'test'
        ];
        $extra = [
            'categories_id' => $categories->pluck('id')->toArray()
        ];

        $response = $this->assertStore($data + $extra, $data + ['is_active' => true, 'deleted_at' => null]);
        $response->assertJsonStructure([
            'data' => $this->fieldsSerialized
        ]);

        $this->assertHasCategory($response->json('data.id'), $categories[0]->id);


        $data = [
            'name' => 'test',
            'is_active' => false
        ];
        $this->assertStore($data + $extra, $data + ['is_active' => false]);
        $genre = Genre::find($response->json('data.id'));
        $this->assertResource($response, new GenreResource($genre));
    }

    public function testUpdate()
    {
        $category = factory(Category::class)->create();
        $this->genre = factory(Genre::class)->create([
            'is_active' => false
        ]);

        $data = [
            'name' => 'test',
            'is_active' => true
        ];
        $response = $this->assertUpdate($data + ['categories_id' => [$category->id]], $data = ['deleted_at' => null]);
        $response->assertJsonStructure([
            'data' => $this->fieldsSerialized
        ]);

        $this->assertHasCategory($response->json('data.id'), $category->id);

        $genre = Genre::find($response->json('data.id'));
        $this->assertResource($response, new GenreResource($genre));
    }
    public function testRemove()
    {
        $genre = factory(Genre::class)->create();

        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $genre->id]));
        $response->assertStatus(204);

        $this->assertNull(Genre::find($genre->id));
    }

    public function testSyncCategories()
    {
        $categories_id = factory(Category::class, 3)->create()->pluck('id')->toArray();

        $sendData = [
            'name' => 'test',
            'categories_id' => [$categories_id[0]]
        ];

        $response = $this->json('POST', $this->routeStore(), $sendData);
        $this->assertDatabaseHas('category_genre', [
            'genre_id' => $response->json('data.id'),
            'category_id' => $categories_id[0]
        ]);

        $sendData = [
            'name' => 'test',
            'categories_id' => [$categories_id[1], $categories_id[2]]
        ];
        $response = $this->json('PUT', route('genres.update', ['genre' => $response->json('data.id')]), $sendData);
        $this->assertDatabaseMissing('category_genre', [
            'genre_id' => $response->json('data.id'),
            'category_id' => $categories_id[0]
        ]);
        $this->assertDatabaseHas('category_genre', [
            'genre_id' => $response->json('data.id'),
            'category_id' => $categories_id[1]
        ]);
        $this->assertDatabaseHas('category_genre', [
            'genre_id' => $response->json('data.id'),
            'category_id' => $categories_id[2]
        ]);
    }

    public function testRollbackStore()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
        $controller->shouldReceive('validate')->WithAnyArgs()->andReturn(['name' => 'test']);

        $controller->shouldReceive('rulesStore')->WithAnyArgs()->andReturn([]);
        $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasErrors = false;
        try {
            $controller->store($request);
        } catch (TestException $e) {
            $this->assertCount(1, Genre::all());
            $hasErrors = true;
        }

        $this->assertTrue($hasErrors);
    }

    public function testRollbackUpdate()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller->shouldReceive('findOrFail')->WithAnyArgs()->andReturn($this->genre);

        $controller->shouldReceive('validate')->WithAnyArgs()->andReturn(['name' => 'test']);
        $controller->shouldReceive('rulesUpdate')->WithAnyArgs()->andReturn([]);
        $controller->shouldReceive("handleRelations")->once()->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasErrors = false;
        try {
            $controller->update($request, 1);
        } catch (TestException $e) {
            $this->assertCount(1, Genre::all());
            $hasErrors = true;
        }

        $this->assertTrue($hasErrors);
    }

    protected function assertHasCategory($genreId, $categoryId)
    {
        $this->assertDatabaseHas('category_genre', [
            'genre_id' => $genreId,
            'category_id' => $categoryId
        ]);
    }

    protected function routeStore()
    {
        $route = route('genres.store');

        return  $route;
    }

    protected function routeUpdate()
    {
        $route = route('genres.update', ['genre' => $this->genre->id]);

        return $route;
    }

    protected function model()
    {
        return Genre::class;
    }
}
