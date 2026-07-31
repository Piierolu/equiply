CREATE TABLE organization_subscriptions (
    organization_id UUID PRIMARY KEY REFERENCES organizations (id),
    plan VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    current_period_ends_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_subscription_plan CHECK (plan IN ('STARTER', 'GROWTH', 'PRO')),
    CONSTRAINT chk_subscription_status CHECK (status IN ('ACTIVE', 'CANCELED'))
);

INSERT INTO organization_subscriptions (
    organization_id, plan, status, current_period_ends_at
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'GROWTH',
    'ACTIVE',
    CURRENT_TIMESTAMP + INTERVAL '30 days'
);
