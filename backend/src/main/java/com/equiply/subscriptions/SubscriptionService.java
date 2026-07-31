package com.equiply.subscriptions;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.equiply.identity.OrganizationContext;
import com.equiply.subscriptions.SubscriptionController.SubscriptionResponse;

@Service
@Transactional
class SubscriptionService {

    private final OrganizationContext organizationContext;
    private final SubscriptionRepository subscriptions;

    SubscriptionService(OrganizationContext organizationContext, SubscriptionRepository subscriptions) {
        this.organizationContext = organizationContext;
        this.subscriptions = subscriptions;
    }

    @Transactional(readOnly = true)
    SubscriptionResponse current() {
        return SubscriptionResponse.from(findCurrent());
    }

    SubscriptionResponse changePlan(SubscriptionPlan plan) {
        OrganizationSubscription subscription = findCurrent();
        subscription.changePlan(plan);
        return SubscriptionResponse.from(subscription);
    }

    SubscriptionResponse cancel() {
        OrganizationSubscription subscription = findCurrent();
        subscription.cancel();
        return SubscriptionResponse.from(subscription);
    }

    private OrganizationSubscription findCurrent() {
        return subscriptions.findById(organizationContext.organizationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscription not found"));
    }
}
