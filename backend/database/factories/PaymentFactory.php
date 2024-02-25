<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) \Illuminate\Support\Str::orderedUuid(),
            'transaction_amount' => $this->faker->randomFloat(2),
            'installments' => $this->faker->numberBetween(0, 24),
            'token' => 'D390d2y3ocb9d2',
            'payment_method_id' => "master",
            'payer_entity_type' => "individual",
            'payer_type' => "customer",
            'payer_email' => "fakemail@gmail.com",
            'payer_identification_type' => "CPF",
            'payer_identification_number' => $this->faker->numberBetween(11111111111, 99999999999),
            'notification_url' => "default_url",
            'status' => "PENDING",
            'created_at' => '2024-02-19 17:42:23',
            'updated_at' => '2024-02-19 17:42:23'
        ];
    }
}
