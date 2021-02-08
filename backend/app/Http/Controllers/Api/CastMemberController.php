<?php

namespace App\Http\Controllers\Api;

use App\Models\CastMember;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BasicCrudController;
use App\Http\Resources\CastMemberResource;

class CastMemberController extends BasicCrudController
{
    protected function model()
    {
        return CastMember::class;
    }
    protected function rulesStore()
    {
        return [
            'name' => 'required|max:255',
            'type' => 'required|in:' . implode(',', [CastMember::TYPE_ACTOR, CastMember::TYPE_DIRECTOR])
        ];
    }

    protected function rulesUpdate()
    {
        return $this->rulesStore();
    }

    protected function resource()
    {
        return CastMemberResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }
}
