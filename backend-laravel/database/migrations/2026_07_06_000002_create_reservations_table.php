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
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id')->index(); // Multi-Tenant Isolation Key
            $table->foreignUuid('room_id')->constrained('rooms')->onDelete('cascade');
            $table->string('guest_name');
            $table->string('guest_phone');
            $table->string('guest_email')->nullable();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->unsignedSmallInteger('number_of_guests')->default(1);
            $table->enum('status', ['confirmed', 'checked-in', 'checked-out', 'cancelled'])->default('confirmed');
            $table->unsignedInteger('total_amount'); // Amount in FCFA/XOF
            $table->unsignedInteger('paid_amount')->default(0); // Amount paid
            $table->enum('payment_status', ['unpaid', 'partially-paid', 'fully-paid'])->default('unpaid');
            $table->text('special_requests')->nullable();
            $table->string('security_pin', 4)->nullable(); // 4-digit code for POS transfers verification
            $table->string('access_code', 10)->nullable(); // Unique code for room entry
            $table->unsignedInteger('credit_limit')->default(0); // Credit limit for maquis charges
            
            // Identity & operational audit fields
            $table->string('nationality')->nullable();
            $table->string('id_number')->nullable();
            $table->string('address')->nullable();
            $table->string('source_of_stay')->default('Direct'); // "Walk-in", "Booking.com", "Airbnb"
            $table->string('staff_member')->nullable(); // Operator name
            $table->string('source_module')->nullable();
            
            // Idempotency keys from external channel managers
            $table->string('external_reservation_id')->nullable()->index(); // ID from Booking/Airbnb
            
            $table->timestamps();

            // Multi-tenant indexes for quick search
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'check_in_date', 'check_out_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
