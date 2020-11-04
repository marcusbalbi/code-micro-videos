<?php

namespace Tests\Feature\Http\Controllers\Api;

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
        // dd($contoller->index()->toArray());
        $this->assertEquals([$category->toArray()], $this->controller->index()->toArray());
    }

    public function testInvalidationDataInStore()
    {
        $request = $this->mock(Request::class);
        $request->shouldReceive('all')->once()->andReturn(['name' => '']);
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->controller->store($request);
    }
}
