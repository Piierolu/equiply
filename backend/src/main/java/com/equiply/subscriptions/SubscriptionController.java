package com.equiply.subscriptions;

import java.time.Instant;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/subscriptions/current")
class SubscriptionController {

    private final SubscriptionService subscriptions;

    SubscriptionController(SubscriptionService subscriptions) {
        this.subscriptions = subscriptions;
    }

    @GetMapping
    SubscriptionResponse current() {
        return subscriptions.current();
    }

    @PutMapping
    @PreAuthorize("hasRole('OWNER')")
    SubscriptionResponse changePlan(@Valid @RequestBody ChangePlanRequest request) {
        return subscriptions.changePlan(request.plan());
    }

    @DeleteMapping
    @PreAuthorize("hasRole('OWNER')")
    SubscriptionResponse cancel() {
        return subscriptions.cancel();
    }

    record ChangePlanRequest(@NotNull SubscriptionPlan plan) {
    }

    record SubscriptionResponse(
            SubscriptionPlan plan,
            SubscriptionStatus status,
            int maxBranches,
            int maxUsers,
            Instant currentPeriodEndsAt,
            Instant updatedAt,
            boolean simulated) {

        static SubscriptionResponse from(OrganizationSubscription subscription) {
            return new SubscriptionResponse(
                    subscription.plan(),
                    subscription.status(),
                    subscription.plan().maxBranches(),
                    subscription.plan().maxUsers(),
                    subscription.currentPeriodEndsAt(),
                    subscription.updatedAt(),
                    true);
        }
    }
}
