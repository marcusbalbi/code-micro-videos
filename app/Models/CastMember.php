<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use SoftDeletes, Traits\Uuid;

    protected $fillable = [
        'name',
        'type',
    ];

    protected $casts = [
        'id' => 'string'
    ];

    protected $dates = ['deleted_at'];

    public $incrementing = false;
}
