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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id')->index(); // Multi-Tenant Isolation Key
            $table->string('idempotency_key')->unique(); // STRICT constraint to prevent duplicate payments
            $table->enum('type', ['lodging_payment', 'pos_sale', 'expense']);
            $table->unsignedInteger('amount'); // Amount in FCFA/XOF
            $table->enum('method', ['wave', 'orange_money', 'mtn', 'cash', 'card', 'room_charge']);
            $table->string('description');
            $table->string('reference_id')->nullable()->index(); // Reservation ID, Order ID, etc.
            $table->timestamps();

            // Multi-tenant indexes
            $table->index(['tenant_id', 'type']);
            $table->index(['tenant_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
