<?php

namespace Tests\Feature\Http\Controllers\Api;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Stubs\Controllers\CategoryControllerStub;
use Tests\Stubs\Models\CategoryStub;

class BasicCrudControllerTest extends TestCase
{
    // use DatabaseMigrations;

    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        CategoryStub::dropTable();
        CategoryStub::createTable();
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

        $contoller = new CategoryControllerStub();
        // dd($contoller->index()->toArray());
        $this->assertEquals([$category->toArray()], $contoller->index()->toArray());
    }
}
