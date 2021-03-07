<?php

namespace App\Models;

use App\ModelFilters\GenreFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use EloquentFilter\Filterable;

class Genre extends Model
{
    use SoftDeletes, Traits\Uuid, Filterable;

    protected $fillable = [
        'name',
        'is_active'
    ];

    protected $keyType = 'string';

    protected $casts = [
        'id' => 'string',
        'is_active' => 'boolean'
    ];

    protected $dates = ['deleted_at'];

    public $incrementing = false;

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function modelFilter()
    {
        return $this->provideFilter(GenreFilter::class);
    }
}
