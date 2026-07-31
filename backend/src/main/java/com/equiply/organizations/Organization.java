package com.equiply.organizations;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "organizations")
class Organization {

    @Id
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Organization() {
    }

    UUID id() {
        return id;
    }

    String name() {
        return name;
    }

    String slug() {
        return slug;
    }

    Instant createdAt() {
        return createdAt;
    }
}
