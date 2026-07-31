import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  getAccessToken: vi.fn().mockResolvedValue("test-token"),
  roles: ["OWNER"],
}));

vi.mock("@/components/auth-provider", () => ({
  useEquiplyAuth: () => ({
    status: "authenticated",
    roles: auth.roles,
    getAccessToken: auth.getAccessToken,
  }),
}));

import { InventoryManager } from "./inventory-manager";

const existingItem = {
  id: "item-1",
  sku: "AUD-001",
  name: "Altavoz Atlas",
  description: "Altavoz activo",
  trackingType: "SERIALIZED",
  totalQuantity: 8,
  reservedQuantity: 2,
  availableQuantity: 6,
  createdAt: "2026-07-31T12:00:00Z",
};

describe("InventoryManager", () => {
  beforeEach(() => {
    auth.getAccessToken.mockClear();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([existingItem])));
  });

  it("loads tenant equipment with a bearer token and exposes owner actions", async () => {
    render(<InventoryManager />);

    expect(await screen.findByText("Altavoz Atlas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Añadir equipo" })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/equipment",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
    const headers = (vi.mocked(fetch).mock.calls[0][1] as RequestInit).headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer test-token");
  });

  it("creates an equipment item from the accessible form", async () => {
    const createdItem = { ...existingItem, id: "item-2", sku: "LGT-002", name: "Barra Luma" };
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(jsonResponse([existingItem]))
        .mockResolvedValueOnce(jsonResponse(createdItem, 201)),
    );
    render(<InventoryManager />);

    await screen.findByText("Altavoz Atlas");
    fireEvent.click(screen.getByRole("button", { name: "Añadir equipo" }));
    fireEvent.change(screen.getByLabelText("SKU"), { target: { value: "LGT-002" } });
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Barra Luma" } });
    fireEvent.change(screen.getByLabelText("Cantidad total"), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear equipo" }));

    expect(await screen.findByText("Barra Luma")).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(vi.mocked(fetch).mock.calls[1][1]).toEqual(expect.objectContaining({ method: "POST" }));
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
