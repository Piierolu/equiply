package com.equiply.subscriptions;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

interface SubscriptionRepository extends JpaRepository<OrganizationSubscription, UUID> {
}
