<?php

namespace Tests\Unit\Rules;

use App\Rules\GenresHasCategoriesRule;
use Tests\TestCase;
use Mockery;
use ReflectionClass;

class GenresHasCategoriesRuleUnitTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCategoriesIdField()
    {
        $rule = new GenresHasCategoriesRule([1, 1, 2, 2]);

        $reflectionClass = new ReflectionClass(GenresHasCategoriesRule::class);
        $reflectionProperty = $reflectionClass->getProperty('categoriesId');
        $reflectionProperty->setAccessible(true);

        $categoriesId = $reflectionProperty->getValue($rule);
        $this->assertEqualsCanonicalizing([1, 2], $categoriesId);
    }

    public function testGenresIdValue()
    {
        $rule = $this->createRuleMock([]);

        $rule->shouldReceive('getRows')->withAnyArgs()->andReturnNull();
        $rule->passes('', [1, 1, 2, 2]);

        $reflectionClass = new ReflectionClass(GenresHasCategoriesRule::class);
        $reflectionProperty = $reflectionClass->getProperty('genresId');
        $reflectionProperty->setAccessible(true);

        $genresId = $reflectionProperty->getValue($rule);
        $this->assertEqualsCanonicalizing([1, 2], $genresId);
    }

    public function testPassesReturnReturnsFalseWhenCategoriesOrGenresIsArrayEmpty()
    {
        $rule = $this->createRuleMock([1]);
        $this->assertFalse($rule->passes('', []));

        $rule2 = $this->createRuleMock([]);
        $this->assertFalse($rule2->passes('', [1]));
    }

    public function testPassesReturnsFalseWhenGetRowsIsEmpty()
    {
        $rule = $this->createRuleMock([]);

        $rule->shouldReceive('getRows')->withAnyArgs()->andReturn(collect());

        $this->assertFalse($rule->passes('', [1]));
    }

    public function testPassesReturnFalseWhenHasCategoriesWithoutGenres()
    {
        $rule = $this->createRuleMock([1, 2]);

        $rule->shouldReceive('getRows')->withAnyArgs()->andReturn(collect(['category_id' => 1]));

        $this->assertFalse($rule->passes('', [1]));
    }

    public function testPassesIsValid()
    {
        $rule = $this->createRuleMock([1, 2]);

        $rule->shouldReceive('getRows')
            ->withAnyArgs()
            ->andReturn(collect([['category_id' => 1], ['category_id' => 2]]));

        $this->assertTrue($rule->passes('', [1]));
    }

    protected function createRuleMock($categoriesId)
    {
        return Mockery::mock(GenresHasCategoriesRule::class, [$categoriesId])
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
    }
}
