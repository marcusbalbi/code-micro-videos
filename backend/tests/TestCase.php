<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function assertUuidV4($value)
    {
        $this->assertEquals(36, strlen($value));
        // verificar via regex
        $regex = '/[0-9a-z]{8}-([0-9a-z]{4}-){3}[0-9a-z]{12}/';
        $this->assertEquals(1, preg_match($regex, $value));
    }
}
