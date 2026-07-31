CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(80) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment_items (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations (id),
    sku VARCHAR(64) NOT NULL,
    name VARCHAR(160) NOT NULL,
    description VARCHAR(500),
    tracking_type VARCHAR(20) NOT NULL,
    total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_equipment_available CHECK (reserved_quantity <= total_quantity)
);

CREATE INDEX idx_equipment_organization_name ON equipment_items (organization_id, name);
CREATE UNIQUE INDEX uq_equipment_organization_sku
    ON equipment_items (organization_id, LOWER(sku));

INSERT INTO organizations (id, name, slug)
VALUES ('11111111-1111-1111-1111-111111111111', 'Northstar Events', 'northstar-events');

INSERT INTO equipment_items (
    id, organization_id, sku, name, description, tracking_type, total_quantity, reserved_quantity
)
VALUES
    ('20000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
     'AUD-SPK-12', 'Atlas 12 speaker', 'Active 12-inch speaker for medium venues', 'SERIALIZED', 12, 4),
    ('20000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
     'LGT-BAR-RGB', 'Luma RGB light bar', 'Wireless RGB light bar with floor stand', 'SERIALIZED', 24, 6),
    ('20000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
     'FUR-CHA-BLK', 'Black folding chair', 'Commercial folding chair', 'BULK', 180, 42);
