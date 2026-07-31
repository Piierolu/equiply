package com.equiply.inventory;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import com.equiply.identity.OrganizationContext;

@SpringBootTest
@Testcontainers(disabledWithoutDocker = true)
@Transactional
class EquipmentTenantIsolationIntegrationTest {

    private static final UUID OTHER_ORGANIZATION_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Container
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:17-alpine");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @MockitoBean
    private OrganizationContext organizationContext;

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void equipmentFromAnotherOrganizationIsReportedAsNotFound() {
        jdbcTemplate.update(
                "INSERT INTO organizations (id, name, slug) VALUES (?, ?, ?)",
                OTHER_ORGANIZATION_ID, "Other Events", "other-events");

        UUID ownerOrganizationId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        EquipmentItem item = equipmentRepository.save(new EquipmentItem(
                ownerOrganizationId, "TENANT-ONLY", "Private equipment", null, TrackingType.BULK, 5));
        when(organizationContext.organizationId()).thenReturn(OTHER_ORGANIZATION_ID);

        assertThatThrownBy(() -> equipmentService.find(item.id()))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
    }
}
