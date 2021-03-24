<?php

namespace App\Models;

use App\ModelFilters\CategoryFilter;
use App\Models\Traits\SerializeDateToIso8601;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes, Traits\Uuid, Filterable, SerializeDateToIso8601;

    protected $fillable = [
        'name',
        'description',
        'is_active'
    ];

    protected $keyType = 'string';

    protected $casts = [
        'id' => 'string',
        'is_active' => 'boolean'
    ];

    protected $dates = ['deleted_at'];

    public $incrementing = false;

    public function modelFilter()
    {
        return $this->provideFilter(CategoryFilter::class);
    }

    public function genres() {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
