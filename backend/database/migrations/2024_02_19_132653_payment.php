<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment', function (Blueprint $table) {
            $table->uuid('id');
            $table->float('transaction_amount');
            $table->integer('installments');
            $table->string('token');
            $table->string('payment_method_id');
            $table->string('payer_entity_type')->default("individual");
            $table->string('payer_type')->default("customer");
            $table->string('payer_email');
            $table->string('payer_identification_type');
            $table->string('payer_identification_number');
            $table->string('notification_url')->default(env("WEBHOOK_NOTIFICATION_URL", "https://webhook.site/"));
            $table->enum('status', ['PENDING', 'PAID', 'CANCELED'])->default("PENDING");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('payment');
    }
};
