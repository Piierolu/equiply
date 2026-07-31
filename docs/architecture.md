# Equiply architecture

## Domain boundaries

| Module | Responsibility | Stage |
| --- | --- | --- |
| `identity` | Token interpretation, current organization, roles | Started |
| `organizations` | Companies, branches, memberships, invitations | Started |
| `inventory` | Catalog, physical units, availability, stock movements | Started |
| `reservations` | Date ranges, quotes, allocation requests | Planned |
| `orders` | Preparation, dispatch, partial returns, damages | Planned |
| `invoicing` | Customer invoices and PDF generation | Planned |
| `subscriptions` | Persisted Equiply plans and simulated lifecycle | Started |
| `notifications` | Email and in-app delivery | Planned |
| `files` | S3-compatible metadata and signed access | Planned |

Spring Modulith verifies module dependencies in the test suite. Domain entities are not exposed across boundaries; modules collaborate through public application APIs and events.

## Multi-tenancy

Equiply uses a shared PostgreSQL schema with an `organization_id` discriminator.

Security invariants:

1. The active organization comes from a validated JWT, never from a request parameter.
2. Tenant-owned repository methods include `organization_id` in reads, updates, and deletes.
3. Unique constraints include `organization_id` where uniqueness is tenant-scoped.
4. Integration tests must prove that one organization cannot observe or mutate another's records.
5. PostgreSQL row-level security may be added as defense in depth after transaction-scoped tenant propagation is established.

## Event strategy

The monolith first uses transactional Spring application events. Integration events such as `ReservationConfirmed`, `InventoryAllocated`, `EquipmentDispatched`, `EquipmentReturned`, and `InvoiceIssued` will be written to an outbox in the same transaction as domain state. A relay will publish them to Kafka, and consumers will persist processed event IDs for idempotency.

This avoids publishing to Kafka inside a database transaction and makes retries safe.

## Subscription strategy

The portfolio MVP uses a clearly labeled subscription simulation persisted per organization. It demonstrates authorization, plan limits, activation, and end-of-period cancellation without external credentials or real money. Stripe is a future replacement only if a live payment integration becomes a portfolio goal; at that point webhook events must be verified and processed idempotently.

## Deployment shape

The public demo can run the frontend separately and deploy the backend as one container with managed PostgreSQL. Keycloak runs as an independent service. Kafka, S3, and a full observability stack should only be deployed when their corresponding features exist.
