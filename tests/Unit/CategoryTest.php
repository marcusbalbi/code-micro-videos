<?php

namespace Tests\Unit;

use Tests\TestCase;
use \App\Models\Category;
use \App\Models\Genre;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    public function testFillable()
    {
        Genre::create(['name' => 'test']);
        $fillable = ['name', 'description', 'is_active'];
        $category = new Category();
        $this->assertEquals($fillable, $category->getFillable());
    }

    public function testHasCorrectTraits()
    {
        $traits = [
            SoftDeletes::class,
            Uuid::class
        ];
        $useTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($useTraits, $traits);
    }

    public function testCasts()
    {
        $casts = [
            'id' => 'string',
            'is_active' => 'boolean'
        ];
        $category = new Category();
        $this->assertEquals($casts, $category->getCasts());
    }

    public function testIncrementing()
    {
        $category = new Category();
        $this->assertFalse($category->incrementing);
    }
    public function testDates()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $category = new Category();
        foreach ($dates as $date) {
            $this->assertContains($date, $category->getDates());
        }
        $this->assertCount(count($dates), $category->getDates());
    }
}
