<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Tymon\JWTAuth\JWT;

class KeycloackGuard implements Guard
{

    private $jwt;

    private $request;

    public function __construct(JWT $jwt, Request $request)
    {
        $this->jwt = $jwt;
        $this->request = $request;
    }
    /**
     * Determine if the current user is authenticated.
     *
     * @return bool
     */
    public function check()
    {

    }

    /**
     * Determine if the current user is a guest.
     *
     * @return bool
     */
    public function guest()
    {

    }

    /**
     * Get the currently authenticated user.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function user()
    {

    }

    /**
     * Get the ID for the currently authenticated user.
     *
     * @return int|string|null
     */
    public function id()
    {

    }

    /**
     * Validate a user's credentials.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function validate(array $credentials = [])
    {

    }

    /**
     * Set the current user.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @return void
     */
    public function setUser(Authenticatable $user)
    {

    }
}
