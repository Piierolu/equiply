package com.equiply.inventory;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.equiply.identity.OrganizationContext;
import com.equiply.inventory.EquipmentController.EquipmentRequest;
import com.equiply.inventory.EquipmentController.EquipmentResponse;

@Service
@Transactional
class EquipmentService {

    private final OrganizationContext organizationContext;
    private final EquipmentRepository equipment;

    EquipmentService(OrganizationContext organizationContext, EquipmentRepository equipment) {
        this.organizationContext = organizationContext;
        this.equipment = equipment;
    }

    @Transactional(readOnly = true)
    List<EquipmentResponse> findAll() {
        return equipment.findAllByOrganizationIdOrderByName(organizationContext.organizationId()).stream()
                .map(EquipmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    EquipmentResponse find(UUID id) {
        return EquipmentResponse.from(findForCurrentOrganization(id));
    }

    EquipmentResponse create(EquipmentRequest request) {
        UUID organizationId = organizationContext.organizationId();
        if (equipment.existsByOrganizationIdAndSkuIgnoreCase(organizationId, request.sku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An equipment item with this SKU already exists");
        }

        EquipmentItem item = new EquipmentItem(
                organizationId,
                request.sku().trim(),
                request.name().trim(),
                normalizeDescription(request.description()),
                request.trackingType(),
                request.totalQuantity());
        return EquipmentResponse.from(equipment.save(item));
    }

    EquipmentResponse update(UUID id, EquipmentRequest request) {
        UUID organizationId = organizationContext.organizationId();
        EquipmentItem item = equipment.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment item not found"));

        if (equipment.existsByOrganizationIdAndSkuIgnoreCaseAndIdNot(organizationId, request.sku(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An equipment item with this SKU already exists");
        }
        if (request.totalQuantity() < item.reservedQuantity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Total quantity cannot be lower than reserved quantity");
        }

        item.update(
                request.sku().trim(),
                request.name().trim(),
                normalizeDescription(request.description()),
                request.trackingType(),
                request.totalQuantity());
        return EquipmentResponse.from(item);
    }

    void delete(UUID id) {
        equipment.delete(findForCurrentOrganization(id));
    }

    private EquipmentItem findForCurrentOrganization(UUID id) {
        return equipment.findByIdAndOrganizationId(id, organizationContext.organizationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment item not found"));
    }

    private String normalizeDescription(String description) {
        return description == null || description.isBlank() ? null : description.trim();
    }
}
