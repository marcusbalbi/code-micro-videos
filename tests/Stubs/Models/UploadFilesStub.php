<?php

namespace Tests\Stubs\Models;

use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;

class UploadFilesStub extends Model
{
    use UploadFiles;

    protected $table = 'upload_file_stub';

    protected $fillable = ['name', 'file1', 'file2'];

    public static $fileFields = ['file1', 'file2'];

    public static function makeTable()
    {
        \Schema::create('upload_file_stub', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->text('file1')->nullable();
            $table->text('file2')->nullable();
            $table->timestamps();
        });
    }
    public static function dropTable()
    {
        \Schema::dropIfExists('upload_file_stub');
    }

    protected function uploadDir()
    {
        return '1';
    }
}
