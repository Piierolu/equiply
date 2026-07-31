package com.equiply.inventory;

import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/equipment")
class EquipmentController {

    private final EquipmentService equipment;

    EquipmentController(EquipmentService equipment) {
        this.equipment = equipment;
    }

    @GetMapping
    List<EquipmentResponse> findAll() {
        return equipment.findAll();
    }

    @GetMapping("/{id}")
    EquipmentResponse find(@PathVariable UUID id) {
        return equipment.find(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    ResponseEntity<EquipmentResponse> create(@Valid @RequestBody EquipmentRequest request) {
        EquipmentResponse response = equipment.create(request);
        return ResponseEntity.created(URI.create("/api/v1/equipment/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    EquipmentResponse update(@PathVariable UUID id, @Valid @RequestBody EquipmentRequest request) {
        return equipment.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'MANAGER')")
    ResponseEntity<Void> delete(@PathVariable UUID id) {
        equipment.delete(id);
        return ResponseEntity.noContent().build();
    }

    record EquipmentRequest(
            @NotBlank @Size(max = 64) String sku,
            @NotBlank @Size(max = 160) String name,
            @Size(max = 500) String description,
            @NotNull TrackingType trackingType,
            @Min(0) @Max(1_000_000) int totalQuantity) {
    }

    record EquipmentResponse(
            UUID id,
            String sku,
            String name,
            String description,
            TrackingType trackingType,
            int totalQuantity,
            int reservedQuantity,
            int availableQuantity,
            Instant createdAt) {

        static EquipmentResponse from(EquipmentItem item) {
            return new EquipmentResponse(
                    item.id(), item.sku(), item.name(), item.description(), item.trackingType(),
                    item.totalQuantity(), item.reservedQuantity(), item.availableQuantity(), item.createdAt());
        }
    }
}
