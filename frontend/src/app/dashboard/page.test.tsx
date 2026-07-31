import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import DashboardPage from "./page";

describe("operations dashboard", () => {
  it("exposes landmarks and an accessible mobile navigation trigger", () => {
    render(<DashboardPage />);

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("button", { name: "Abrir navegación" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navegación del panel" })).toBeInTheDocument();
  });

  it("has no detectable axe accessibility violations", async () => {
    const { container } = render(<DashboardPage />);

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
