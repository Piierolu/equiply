package com.equiply.organizations;

import java.time.Instant;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.equiply.identity.OrganizationContext;

@RestController
@RequestMapping("/api/v1/organizations")
class OrganizationController {

    private final OrganizationContext organizationContext;
    private final OrganizationRepository organizations;

    OrganizationController(OrganizationContext organizationContext, OrganizationRepository organizations) {
        this.organizationContext = organizationContext;
        this.organizations = organizations;
    }

    @GetMapping("/current")
    OrganizationResponse current() {
        UUID organizationId = organizationContext.organizationId();
        return organizations.findById(organizationId)
                .map(OrganizationResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));
    }

    record OrganizationResponse(UUID id, String name, String slug, Instant createdAt) {

        static OrganizationResponse from(Organization organization) {
            return new OrganizationResponse(
                    organization.id(), organization.name(), organization.slug(), organization.createdAt());
        }
    }
}
