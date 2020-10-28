<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        factory(Genre::class, 1)->create();

        $genres = Genre::all();
        $this->assertCount(1, $genres);

        $keys = array_keys($genres->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'is_active',
                'created_at',
                'deleted_at',
                'updated_at'
            ],
            $keys
        );
    }

    public function testCreate()
    {
        $genre = Genre::create([
            'name' => 'test'
        ]);

        $genre->refresh();

        $this->assertEquals('test', $genre->name);
        $this->assertTrue($genre->is_active);
        $this->assertUuidV4($genre->id);


        $genre = Genre::create([
            'name' => 'test',
            'is_active' => false
        ]);

        $this->assertFalse($genre->is_active);


        $genre = Genre::create([
            'name' => 'test',
            'is_active' => true
        ]);

        $this->assertTrue($genre->is_active);
    }

    public function testUpdate()
    {
        $genre = factory(Genre::class)->create([
            'is_active' => false
        ])->first();

        $data = [
            'name' => 'test_genre',
            'is_active' => true
        ];

        $genre->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $genre->{$key});
        }
    }

    public function testRemove()
    {
        $genres = factory(Genre::class, 2)->create();

        $genres[0]->delete();

        $total = Genre::count();

        $this->assertEquals(1, $total);
        $this->assertNull(Genre::find($genres[0]->id));

        $genres[0]->restore();
        $this->assertNotEmpty(Genre::find($genres[0]->id));
    }
}
