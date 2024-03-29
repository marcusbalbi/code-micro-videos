<?php

namespace App\Providers;

use App\Auth\KeycloackGuard;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        \Auth::extend('keycloak', function ($app, $name, $config) {
            return new KeycloackGuard($app["tymon.jwt"], $app["request"]);
        });

        \Gate::define("catalog-admin", function(User $user) {
            return $user->hasRole("catalog-admin");
        });
    }
}
