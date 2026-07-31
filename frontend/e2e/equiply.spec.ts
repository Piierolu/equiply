import { mkdir } from "node:fs/promises";
import path from "node:path";

import { expect, Page, test } from "@playwright/test";

const demoUser = process.env.E2E_USERNAME ?? "owner@equiply.local";
const demoPassword = process.env.E2E_PASSWORD ?? "Equiply123!";

test("authenticates and completes the inventory CRUD flow", async ({ page }) => {
  await login(page);

  await expect(page.getByRole("heading", { name: "Buenos días, Luis." })).toBeVisible();
  await expect(page.getByText("Altavoz Atlas 12")).toBeVisible();
  await expect(page.locator("#billing").getByText("Growth", { exact: true }).filter({ visible: true })).toBeVisible();

  const uniqueSuffix = Date.now().toString().slice(-7);
  const itemName = `Flight case E2E ${uniqueSuffix}`;
  const sku = `E2E-${uniqueSuffix}`;

  await page.getByRole("button", { name: "Añadir equipo" }).click();
  await page.getByLabel("SKU").fill(sku);
  await page.getByLabel("Nombre").fill(itemName);
  await page.getByLabel("Descripción (opcional)").fill("Elemento temporal creado por Playwright");
  await page.getByLabel("Cantidad total").fill("2");
  await page.getByRole("button", { name: "Crear equipo" }).click();

  await expect(page.getByText(itemName)).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: `Eliminar ${itemName}` }).click();
  await expect(page.getByText(itemName)).toHaveCount(0);
});

test("captures portfolio screenshots", async ({ page }) => {
  test.skip(process.env.CAPTURE_SCREENSHOTS !== "1", "Screenshot capture is an explicit local task");

  const screenshots = path.resolve(process.cwd(), "../docs/screenshots");
  await mkdir(screenshots, { recursive: true });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: path.join(screenshots, "landing.png"), fullPage: true, animations: "disabled" });

  await login(page);
  await expect(page.getByText("Altavoz Atlas 12")).toBeVisible();
  await page.screenshot({ path: path.join(screenshots, "dashboard.png"), fullPage: true, animations: "disabled" });
});

async function login(page: Page) {
  await page.goto("/dashboard");

  await Promise.race([
    page.locator("#username").waitFor({ state: "visible" }),
    page.getByRole("heading", { name: "Buenos días, Luis." }).waitFor({ state: "visible" }),
  ]);

  if (await page.locator("#username").isVisible()) {
    await page.locator("#username").fill(demoUser);
    await page.locator("#password").fill(demoPassword);
    await page.locator("#kc-login").click();
  }

  await page.waitForURL(/^http:\/\/localhost:3000\/dashboard/);
  await expect(page.getByRole("heading", { name: "Buenos días, Luis." })).toBeVisible();
}
