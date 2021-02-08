<?php

namespace App\ModelFilters;

use App\Models\CastMember;
use EloquentFilter\ModelFilter;

class CastMemberFilter extends ModelFilter
{
    protected $sortable = ['name', 'type', 'created_at'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }

    public function type($type)
    {
        if (in_array((int)$type, CastMember::$types)) {
            $this->orWhere('type', '=', $type);
        }
    }
}
