package com.equiply.inventory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.equiply.identity.OrganizationContext;

class EquipmentServiceTest {

    private final OrganizationContext organizationContext = mock(OrganizationContext.class);
    private final EquipmentRepository repository = mock(EquipmentRepository.class);
    private final EquipmentService service = new EquipmentService(organizationContext, repository);

    @Test
    void readsEquipmentWithinTheAuthenticatedOrganization() {
        UUID organizationId = UUID.randomUUID();
        UUID equipmentId = UUID.randomUUID();
        EquipmentItem item = new EquipmentItem(
                organizationId, "LGT-001", "Light bar", null, TrackingType.SERIALIZED, 8);

        when(organizationContext.organizationId()).thenReturn(organizationId);
        when(repository.findByIdAndOrganizationId(equipmentId, organizationId)).thenReturn(Optional.of(item));

        var result = service.find(equipmentId);

        assertThat(result.name()).isEqualTo("Light bar");
        verify(repository).findByIdAndOrganizationId(equipmentId, organizationId);
    }

    @Test
    void doesNotFallBackToAnUnscopedLookupWhenEquipmentBelongsToAnotherOrganization() {
        UUID authenticatedOrganization = UUID.randomUUID();
        UUID equipmentId = UUID.randomUUID();

        when(organizationContext.organizationId()).thenReturn(authenticatedOrganization);
        when(repository.findByIdAndOrganizationId(equipmentId, authenticatedOrganization)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.find(equipmentId))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");

        verify(repository).findByIdAndOrganizationId(equipmentId, authenticatedOrganization);
    }
}
