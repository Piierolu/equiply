package com.equiply.subscriptions;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "organization_subscriptions")
class OrganizationSubscription {

    @Id
    @Column(name = "organization_id", updatable = false)
    private UUID organizationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SubscriptionPlan plan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SubscriptionStatus status;

    @Column(name = "current_period_ends_at", nullable = false)
    private Instant currentPeriodEndsAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected OrganizationSubscription() {
    }

    OrganizationSubscription(UUID organizationId, SubscriptionPlan plan, SubscriptionStatus status,
            Instant currentPeriodEndsAt) {
        this.organizationId = organizationId;
        this.plan = plan;
        this.status = status;
        this.currentPeriodEndsAt = currentPeriodEndsAt;
        this.updatedAt = Instant.now();
    }

    void changePlan(SubscriptionPlan newPlan) {
        this.plan = newPlan;
        this.status = SubscriptionStatus.ACTIVE;
        this.currentPeriodEndsAt = Instant.now().plus(30, ChronoUnit.DAYS);
        this.updatedAt = Instant.now();
    }

    void cancel() {
        this.status = SubscriptionStatus.CANCELED;
        this.updatedAt = Instant.now();
    }

    UUID organizationId() {
        return organizationId;
    }

    SubscriptionPlan plan() {
        return plan;
    }

    SubscriptionStatus status() {
        return status;
    }

    Instant currentPeriodEndsAt() {
        return currentPeriodEndsAt;
    }

    Instant updatedAt() {
        return updatedAt;
    }
}
