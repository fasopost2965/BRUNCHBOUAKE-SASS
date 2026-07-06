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
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id')->index(); // Multi-Tenant Isolation Key
            $table->string('name'); // e.g., "Studio Bouaké Chic"
            $table->enum('type', ['studio', 'room', 'apartment']);
            $table->unsignedInteger('price_per_night'); // Amount in FCFA/XOF
            $table->enum('status', ['available', 'occupied', 'dirty', 'maintenance'])->default('available');
            $table->unsignedSmallInteger('max_guests')->default(2);
            $table->json('features')->nullable(); // Comfort/features list
            $table->string('image')->nullable();
            $table->json('images')->nullable(); // Multiple photos for visual recognition
            $table->timestamps();

            // Multi-tenant indexes
            $table->index(['tenant_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
