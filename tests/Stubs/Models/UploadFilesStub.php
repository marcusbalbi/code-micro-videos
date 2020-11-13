<?php

namespace Tests\Stubs\Models;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;

class UploadFilesStub extends Model
{
    use UploadFiles;

    // protected $table = 'upload_file_stub';

    // protected $fillable = ['name', 'file1', 'file2'];

    // protected $fileFields = ['file1', 'file2'];

    protected function uploadDir()
    {
        return '1';
    }
}
