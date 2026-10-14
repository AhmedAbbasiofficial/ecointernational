import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { CATEGORIES, featuredProductIds, products } from "@/lib/eco-content";
import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /about-us", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/about-us");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a dedicated page for /contact-us", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/contact-us");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("uses at least four distinct configured products from the catalogue for the carousel", () => {
    expect(featuredProductIds.length).toBeGreaterThanOrEqual(4);
    expect(new Set(featuredProductIds).size).toBe(featuredProductIds.length);
    expect(featuredProductIds.every((id) => products.some((product) => product.id === id))).toBe(
      true,
    );
  });

  it("uses the required three product category links in the header menu", () => {
    const categoryNames = CATEGORIES.map((category) => category.name);

    expect(categoryNames).toEqual(["Solar Inverters", "Lithium Batteries", "All in One"]);
    expect(categoryNames).toHaveLength(3);
  });
});
