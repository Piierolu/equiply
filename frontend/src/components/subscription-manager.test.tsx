import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  getAccessToken: vi.fn().mockResolvedValue("test-token"),
}));

vi.mock("@/components/auth-provider", () => ({
  useEquiplyAuth: () => ({
    status: "authenticated",
    roles: ["OWNER"],
    getAccessToken: auth.getAccessToken,
  }),
}));

import { SubscriptionManager } from "./subscription-manager";

describe("SubscriptionManager", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      plan: "GROWTH",
      status: "ACTIVE",
      maxBranches: 5,
      maxUsers: 20,
      currentPeriodEndsAt: "2026-08-30T12:00:00Z",
      updatedAt: "2026-07-31T12:00:00Z",
      simulated: true,
    }), { status: 200, headers: { "Content-Type": "application/json" } })));
  });

  it("shows the persisted simulated plan and owner controls", async () => {
    render(<SubscriptionManager />);

    expect(await screen.findByText("Growth")).toBeInTheDocument();
    expect(screen.getByText("SIMULACIÓN")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gestionar plan simulado" })).toBeInTheDocument();
  });
});
