package com.equiply.subscriptions;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.equiply.identity.OrganizationContext;

class SubscriptionServiceTest {

    private final OrganizationContext organizationContext = mock(OrganizationContext.class);
    private final SubscriptionRepository repository = mock(SubscriptionRepository.class);
    private final SubscriptionService service = new SubscriptionService(organizationContext, repository);

    @Test
    void changesOnlyTheAuthenticatedOrganizationsSubscription() {
        UUID organizationId = UUID.randomUUID();
        OrganizationSubscription subscription = subscriptionFor(organizationId);
        when(organizationContext.organizationId()).thenReturn(organizationId);
        when(repository.findById(organizationId)).thenReturn(Optional.of(subscription));

        var result = service.changePlan(SubscriptionPlan.PRO);

        assertThat(result.plan()).isEqualTo(SubscriptionPlan.PRO);
        assertThat(result.status()).isEqualTo(SubscriptionStatus.ACTIVE);
        assertThat(result.simulated()).isTrue();
        verify(repository).findById(organizationId);
    }

    private OrganizationSubscription subscriptionFor(UUID organizationId) {
        return new OrganizationSubscription(
                organizationId,
                SubscriptionPlan.GROWTH,
                SubscriptionStatus.ACTIVE,
                Instant.now().plusSeconds(86_400));
    }
}
