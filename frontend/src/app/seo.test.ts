import { describe, expect, it } from "vitest";

import robots from "./robots";
import sitemap from "./sitemap";

describe("technical SEO", () => {
  it("keeps the public site crawlable and the dashboard private", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules.allow).toBe("/");
    expect(rules.disallow).toContain("/dashboard");
  });

  it("only publishes canonical public routes in the sitemap", () => {
    const result = sitemap();

    expect(result).toHaveLength(1);
    expect(result[0].url).not.toContain("/dashboard");
  });
});
