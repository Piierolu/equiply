package com.equiply.identity;

import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
final class JwtOrganizationContext implements OrganizationContext {

    @Override
    public UUID organizationId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new AccessDeniedException("An authenticated organization is required");
        }

        String claim = jwt.getClaimAsString("organization_id");
        if (claim == null || claim.isBlank()) {
            throw new AccessDeniedException("The access token has no organization_id claim");
        }

        try {
            return UUID.fromString(claim);
        } catch (IllegalArgumentException exception) {
            throw new AccessDeniedException("The organization_id claim is invalid", exception);
        }
    }
}
