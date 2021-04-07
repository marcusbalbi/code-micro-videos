<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['namespace' => 'Api', 'middleware' => ['auth:api', 'can:catalog-admin']], function () {
    $exceptCreateEdit = [
        'except' => ['create', 'edit']
    ];

    Route::resource('categories', 'CategoryController', $exceptCreateEdit);
    Route::delete('categories', 'CategoryController@destroyCollection', $exceptCreateEdit);

    Route::resource('genres', 'GenreController', $exceptCreateEdit);
    Route::delete('genres', 'GenreController@destroyCollection', $exceptCreateEdit);

    Route::resource('cast_members', 'CastMemberController', $exceptCreateEdit);
    Route::delete('cast_members', 'CastMemberController@destroyCollection', $exceptCreateEdit);

    Route::resource('videos', 'VideoController', $exceptCreateEdit);
    Route::delete('videos', 'VideoController@destroyCollection', $exceptCreateEdit);
});
