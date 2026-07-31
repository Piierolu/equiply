package com.equiply.inventory;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "equipment_items")
class EquipmentItem {

    @Id
    private UUID id;

    @Column(name = "organization_id", nullable = false, updatable = false)
    private UUID organizationId;

    @Column(nullable = false, length = 64)
    private String sku;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "tracking_type", nullable = false, length = 20)
    private TrackingType trackingType;

    @Column(name = "total_quantity", nullable = false)
    private int totalQuantity;

    @Column(name = "reserved_quantity", nullable = false)
    private int reservedQuantity;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected EquipmentItem() {
    }

    EquipmentItem(UUID organizationId, String sku, String name, String description,
            TrackingType trackingType, int totalQuantity) {
        this.id = UUID.randomUUID();
        this.organizationId = organizationId;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.trackingType = trackingType;
        this.totalQuantity = totalQuantity;
        this.reservedQuantity = 0;
        this.createdAt = Instant.now();
    }

    void update(String sku, String name, String description, TrackingType trackingType, int totalQuantity) {
        if (totalQuantity < reservedQuantity) {
            throw new IllegalArgumentException("Total quantity cannot be lower than reserved quantity");
        }
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.trackingType = trackingType;
        this.totalQuantity = totalQuantity;
    }

    UUID id() {
        return id;
    }

    UUID organizationId() {
        return organizationId;
    }

    String sku() {
        return sku;
    }

    String name() {
        return name;
    }

    String description() {
        return description;
    }

    TrackingType trackingType() {
        return trackingType;
    }

    int totalQuantity() {
        return totalQuantity;
    }

    int reservedQuantity() {
        return reservedQuantity;
    }

    int availableQuantity() {
        return totalQuantity - reservedQuantity;
    }

    Instant createdAt() {
        return createdAt;
    }
}
