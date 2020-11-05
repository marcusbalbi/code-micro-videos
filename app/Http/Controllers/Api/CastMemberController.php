<?php

namespace App\Http\Controllers\Api;

use App\Models\CastMember;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BasicCrudController;

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
            'type' => 'required|numeric|in:' . implode(',', [CastMember::TYPE_ACTOR, CastMember::TYPE_DIRECTOR])
        ];
    }

    protected function rulesUpdate()
    {
        return $this->rulesStore();
    }
}
