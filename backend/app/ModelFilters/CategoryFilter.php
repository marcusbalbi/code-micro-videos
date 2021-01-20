<?php

namespace App\ModelFilters;

class CategoryFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'created_at', 'is_active'];


    public function search($search)
    {
        $this->query->where('name', 'LIKE', "%$search%");
    }
}
