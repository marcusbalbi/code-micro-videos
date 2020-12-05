<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\CastMemberResource;
use Tests\TestCase;
use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;

    private $castMember;
    private $fieldsSerialized = [
        'id',
        'name',
        'type',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->castMember = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_DIRECTOR
        ]);
    }

    public function testIndex()
    {
        $response = $this->get(route('cast_members.index'));
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => $this->fieldsSerialized
                ]
            ]);

        $this->assertResource($response, CastMemberResource::collection(collect([$this->castMember])));
    }

    public function testShow()
    {
        $response = $this->get(route('cast_members.show', ['cast_member' => $this->castMember->id]));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->fieldsSerialized
            ])
            ->assertJson([
                'data' => $this->castMember->toArray()
            ]);

        $this->assertResource($response, new CastMemberResource($this->castMember));
    }

    public function testInvalidationData()
    {
        $data = ['name' => '', 'type' => ''];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = ['type' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    public function testStore()
    {
        $data = [
            [
                'name' => 'test',
                'type' => CastMember::TYPE_ACTOR
            ],
            [
                'name' => 'test',
                'type' => CastMember::TYPE_DIRECTOR
            ]
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore($value, $value + ['deleted_at' => null]);
            $response->assertJsonStructure([
                'data' => $this->fieldsSerialized
            ]);

            $castMember = CastMember::find($response->json('data.id'));
            $this->assertResource($response, new CastMemberResource($castMember));
        }
    }

    public function testUpdate()
    {

        $data = [
            'name' => 'test',
            'type' => CastMember::TYPE_ACTOR
        ];
        $response = $this->assertUpdate($data, $data = ['deleted_at' => null]);
        $response->assertJsonStructure([
            'data' => $this->fieldsSerialized
        ]);

        $castMember = CastMember::find($response->json('data.id'));
        $this->assertResource($response, new CastMemberResource($castMember));
    }

    public function testRemove()
    {
        $castMember = factory(CastMember::class)->create();

        $response = $this->json('DELETE', route('cast_members.destroy', ['cast_member' => $castMember->id]));
        $response->assertStatus(204);

        $this->assertNull(CastMember::find($castMember->id));
    }

    protected function routeStore()
    {
        return route('cast_members.store');
    }

    protected function routeUpdate()
    {
        return route('cast_members.update', ['cast_member' => $this->castMember->id]);
    }

    protected function model()
    {
        return CastMember::class;
    }
}
