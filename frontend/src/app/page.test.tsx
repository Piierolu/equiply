import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("public landing page", () => {
  it("has a clear document structure and demo entry point", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cada equipo");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getAllByRole("link", { name: /demo/i }).length).toBeGreaterThan(0);
  });

  it("has no detectable axe accessibility violations", async () => {
    const { container } = render(<Home />);

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
