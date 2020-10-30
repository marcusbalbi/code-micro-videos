<?php

declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Support\Facades\Lang;

trait TestValidations
{
    protected function assertInvalidationInStoreAction(array $data, string $rules, $ruleParams = [])
    {
        $response = $this->json('POST', $this->routeStore(), $data);
        $fields = array_keys($data);
        $this->assertInvalidationFields($response, $fields, $rules, $ruleParams);
    }
    protected function assertInvalidationFields(TestResponse $response, array $fields, string $rule, array $ruleParams = [])
    {
        $response->assertStatus(422)
            ->assertJsonValidationErrors($fields);


        foreach ($fields as $field) {
            $fieldName = str_replace('_', ' ', $field);
            $response->assertJsonFragment([
                Lang::get("validation.${rule}", ['attribute' => $fieldName] + $ruleParams)
            ]);
        }
    }
}
