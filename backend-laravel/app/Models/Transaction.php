<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Transaction extends Model
{
    use HasUuids;

    protected $fillable = [
        'id',
        'tenant_id',
        'idempotency_key',
        'type',
        'amount',
        'method',
        'description',
        'reference_id',
    ];

    protected $casts = [
        'amount' => 'integer',
    ];

    /**
     * Scope query to only include records for a specific tenant.
     */
    public function scopeForTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }
}
