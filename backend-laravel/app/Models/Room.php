<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Room extends Model
{
    use HasUuids;

    protected $fillable = [
        'id',
        'tenant_id',
        'name',
        'type',
        'price_per_night',
        'status',
        'max_guests',
        'features',
        'image',
        'images',
    ];

    protected $casts = [
        'price_per_night' => 'integer',
        'max_guests' => 'integer',
        'features' => 'array',
        'images' => 'array',
    ];

    /**
     * Scope query to only include records for a specific tenant.
     */
    public function scopeForTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    /**
     * Retrieve reservations for this room.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
