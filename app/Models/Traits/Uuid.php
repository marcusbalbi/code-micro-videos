<?php

namespace App\Models\Traits;

use Ramsey\Uuid\Uuid as RamseyUuid;

trait uuid {
  public static function boot()
  {
    parent::boot();

    static::creating(function ($obj) {
      $obj->id = RamseyUuid::uuid4();
    });
  }
}