<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\TestCase;
use Illuminate\Http\Request;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;

class BasicCrudControllerTest extends TestCase
{
    // use DatabaseMigrations;

    private $controller;

    protected function setUp(): void
    {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();
        $this->controller = new CategoryControllerStub();
    }

    protected function tearDown(): void
    {
        CategoryStub::dropTable();
        parent::tearDown();
    }

    public function testIndex()
    {
        $category = CategoryStub::create([
            'name' => 'testname',
            'description' => 'testdescription',
        ]);
        $request = $this->mock(Request::class);
        $request->shouldReceive('get')->once()->andReturn(10);
        // $request->shouldReceive('all')->any()->andReturn([]);
        $request->shouldReceive('has')->once()->andReturn(false);
        $resource = $this->controller->index($request);
        $serialized = $resource->response()->getData(true);

        $this->assertEquals([$category->toArray()], $serialized['data']);

        $this->assertArrayHasKey('meta', $serialized);
        $this->assertArrayHasKey('links', $serialized);
    }

    public function testInvalidationDataInStore()
    {
        $request = $this->mock(Request::class);
        $request->shouldReceive('all')->once()->andReturn(['name' => '']);
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->controller->store($request);
    }

    public function testStore()
    {
        $request = $this->mock(Request::class);
        $request->shouldReceive('all')->once()->andReturn(['name' => 'test', 'description' => 'test_desc']);

        $resource = $this->controller->store($request);

        $serialized = $resource->response()->getData(true);

        $this->assertEquals(
            CategoryStub::find(1)->toArray(),
            $serialized['data']
        );
    }

    public function testIfFindOrFailFetchModel()
    {
        $category = CategoryStub::create([
            'name' => 'testname',
            'description' => 'testdescription',
        ]);

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);

        $reflectionMethod = $reflectionClass->getMethod('findOrFail');

        $reflectionMethod->setAccessible(true);

        $resource = $reflectionMethod->invokeArgs($this->controller, [$category->id]);

        $this->assertInstanceOf(CategoryStub::class, $resource);
    }

    public function testIfFindOrFailThrowExceptionWhenIdInvalid()
    {

        $reflectionClass = new \ReflectionClass(BasicCrudController::class);

        $reflectionMethod = $reflectionClass->getMethod('findOrFail');

        $reflectionMethod->setAccessible(true);

        $this->expectException(ModelNotFoundException::class);
        $reflectionMethod->invokeArgs($this->controller, [0]);
    }

    public function testShow()
    {
        $category = CategoryStub::create([
            'name' => 'testname',
            'description' => 'testdescription',
        ]);
        $request = $this->mock(Request::class);
        $request->shouldReceive('get')->once()->andReturn("");
        // $request->shouldReceive('all')->any()->andReturn([]);
        // $request->shouldReceive('has')->once()->andReturn(false);
        $resource = $this->controller->show($category->id, $request);
        $serialized = $resource->response()->getData(true);
        $this->assertEquals(
            $category->toArray(),
            $serialized['data']
        );
    }

    public function testUpdate()
    {
        $category = CategoryStub::create([
            'name' => 'testname',
            'description' => 'testdescription',
        ]);
        $request = $this->mock(Request::class);
        $request->shouldReceive('all')->once()->andReturn(['name' => 'test_changed', 'description' => 'new_desc']);
        $request->shouldReceive('isMethod')->once()->andReturn(true);

        $resource = $this->controller->update($request, $category->id);
        $serialized = $resource->response()->getData(true);
        $this->assertEquals(
            $serialized['data'],
            CategoryStub::find(1)->toArray()
        );
    }

    public function testDestroy()
    {
        $category = CategoryStub::create([
            'name' => 'testname',
            'description' => 'testdescription',
        ]);
        $response = $this->controller->destroy($category->id);

        $this->createTestResponse($response)->assertStatus(204);
        $this->assertCount(0, CategoryStub::all());
    }
}
