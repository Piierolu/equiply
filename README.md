# Equiply

Equiply is a multi-tenant SaaS for small event-equipment rental companies. It brings inventory, reservations, dispatches, returns, invoicing, and subscription management into one workspace.

## Problem

Rental teams often coordinate availability with spreadsheets and messaging. That makes overlapping reservations, missing equipment, late returns, and cross-branch stock difficult to control. Equiply provides a single operational record while keeping every company's data isolated.

## Current scope

The first vertical slice includes:

- OIDC authentication and role mapping through Keycloak.
- Organization context derived from a signed access token.
- Multi-tenant inventory CRUD with application-level isolation.
- An authenticated inventory interface with role-aware create, update, and delete actions.
- A persisted subscription simulation for plan changes and end-of-period cancellation.
- PostgreSQL migrations with Flyway.
- A responsive Next.js product dashboard.
- A public, indexable product page and a private, non-indexable dashboard demo.
- WCAG-oriented navigation, focus handling, contrast, and automated axe checks.
- Canonical metadata, JSON-LD, Open Graph image, `robots.txt`, and sitemap generation.
- Local infrastructure through Docker Compose.
- Backend architecture tests and frontend quality checks in CI.

Reservations and order logistics remain future product work. Stripe, Kafka, and S3 are optional extensions rather than MVP requirements and are documented in [`docs/architecture.md`](docs/architecture.md).

## Technical decisions

- **Modular monolith first:** Spring Modulith enforces domain boundaries without premature distributed transactions.
- **Shared database, tenant column:** business records carry `organization_id`; repositories never query tenant-owned data by ID alone.
- **Identity outside the domain:** Keycloak handles credentials and tokens, while Equiply owns organizations and memberships.
- **PostgreSQL before analytics infrastructure:** transactional reporting remains in PostgreSQL until an OLAP workload justifies ClickHouse.
- **Transactional events before Kafka:** domain events stay local initially. Kafka will receive integration events through an outbox, avoiding dual writes.

## Architecture

```text
Next.js -> Spring Boot modular monolith -> PostgreSQL
                  |       |       |
              Keycloak  Kafka   MinIO/S3
                      (optional) (optional)
```

See [`docs/architecture.md`](docs/architecture.md) for module boundaries and delivery stages.

## Run locally

Requirements: Docker Desktop with Compose.

```bash
cp .env.example .env
docker compose up --build
```

Kafka and MinIO do not start in the core demo. Enable their profiles only when implementing events or files:

```bash
docker compose --profile events up --build
docker compose --profile files up --build
```

Services:

| Service | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Keycloak | http://localhost:8180 |
| MinIO console (`files` profile) | http://localhost:9001 |

Local demo credentials are `owner@equiply.local` / `Equiply123!`. They are fixed in the development realm import and must never be used in production.

## Run quality checks

```bash
./backend/mvnw -f backend/pom.xml verify
npm --prefix frontend run lint
npm --prefix frontend run typecheck
npm --prefix frontend test
npm --prefix frontend run build
```

On Windows, use `backend\\mvnw.cmd` instead of `./backend/mvnw`.

## API

Authenticated endpoints currently exposed:

```text
GET    /api/v1/organizations/current
GET    /api/v1/equipment
GET    /api/v1/equipment/{id}
POST   /api/v1/equipment
PUT    /api/v1/equipment/{id}
DELETE /api/v1/equipment/{id}
GET    /api/v1/subscriptions/current
PUT    /api/v1/subscriptions/current
DELETE /api/v1/subscriptions/current
```

The API expects an `organization_id` UUID claim and realm roles in the Keycloak access token.

Subscription endpoints intentionally simulate billing and never process money. `PUT` and `DELETE` require `OWNER`; equipment mutations require `OWNER` or `MANAGER`.
