<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        factory(CastMember::class, 1)->create();

        $castMember = CastMember::all();
        $this->assertCount(1, $castMember);

        $keys = array_keys($castMember->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'created_at',
                'deleted_at',
                'id',
                'name',
                'type',
                'updated_at'
            ],
            $keys
        );
    }

    public function testCreate()
    {
        $castMember = CastMember::create([
            'name' => 'test',
            'type' => 1
        ]);

        $castMember->refresh();

        $this->assertEquals('test', $castMember->name);
        $this->assertEquals(1, $castMember->type);
        $this->assertUuidV4($castMember->id);
    }

    public function testUpdate()
    {
        $castMember = factory(CastMember::class)->create([
            'type' => 1,
        ])->first();

        $data = [
            'name' => 'test2'
        ];

        $castMember->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $castMember->{$key});
        }
    }

    public function testRemove()
    {
        $castMember = factory(CastMember::class, 5)->create();

        $castMember[0]->delete();

        $total = CastMember::count();

        $this->assertEquals(4, $total);
        $this->assertNull(CastMember::find($castMember[0]->id));

        $castMember[0]->restore();
        $this->assertNotEmpty(CastMember::find($castMember[0]->id));
    }
}
