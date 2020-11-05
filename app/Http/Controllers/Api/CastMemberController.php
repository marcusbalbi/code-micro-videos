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
            'type' => 'numeric|in:1,2'
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CastMember  $castMember
     * @return \Illuminate\Http\Response
     */
    public function show(CastMember $castMember)
    {
        return $castMember;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CastMember  $castMember
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CastMember $castMember)
    {
        $castMember->update($request->all());
        return $castMember;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CastMember  $castMember
     * @return \Illuminate\Http\Response
     */
    public function destroy(CastMember $castMember)
    {
        $castMember->delete();
        return response()->noContent();
    }
}
