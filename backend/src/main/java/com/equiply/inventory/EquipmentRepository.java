package com.equiply.inventory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

interface EquipmentRepository extends JpaRepository<EquipmentItem, UUID> {

    List<EquipmentItem> findAllByOrganizationIdOrderByName(UUID organizationId);

    Optional<EquipmentItem> findByIdAndOrganizationId(UUID id, UUID organizationId);

    boolean existsByOrganizationIdAndSkuIgnoreCase(UUID organizationId, String sku);

    boolean existsByOrganizationIdAndSkuIgnoreCaseAndIdNot(UUID organizationId, String sku, UUID id);
}
