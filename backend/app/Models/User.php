<?php
declare(strict_types=1);
namespace App\Models;

use Exception;
use Illuminate\Contracts\Auth\Authenticatable;

class User implements Authenticatable
{
    protected $id;

    protected $name;

    protected $email;

    protected $token;

    protected $roles;

    public function __construct(string $id, string $name, string $email, string $token, array $roles)
    {
        $this->id = $id;
        $this->name  = $name;
        $this->email = $email;
        $this->token = $token;
        $this->roles = $roles;
    }

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return $this->email;
    }

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this->id;
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        throw new Exception("not implemented");
    }

    /**
     * Get the token value for the "remember me" session.
     *
     * @return string
     */
    public function getRememberToken()
    {
        throw new Exception("not implemented");
    }

    /**
     * Set the token value for the "remember me" session.
     *
     * @param  string  $value
     * @return void
     */
    public function setRememberToken($value)
    {
        throw new Exception("not implemented");
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        throw new Exception("not implemented");
    }

    public function getRoles()
    {
        return $this->roles;
    }

    public function hasRole($role)
    {
        return in_array($role, $this->roles);
    }

}
