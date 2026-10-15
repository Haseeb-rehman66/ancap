import { describe, expect, it } from "vitest";
import { isNavHrefActive, matchingNavHref } from "../navActive";

const hrefs = [
  "/dashboard",
  "/developers",
  "/ai/runs",
  "/dashboard/seller",
  "/explorer",
  "/acp",
  "/#product",
  "/",
];

describe("matchingNavHref", () => {
  it("keeps an exact section link current", () => {
    expect(matchingNavHref("/explorer", hrefs)).toBe("/explorer");
  });

  it("keeps the parent section current on a nested page", () => {
    expect(matchingNavHref("/explorer/stats", hrefs)).toBe("/explorer");
    expect(matchingNavHref("/developers/usage", hrefs)).toBe("/developers");
    expect(matchingNavHref("/ai/runs/run_123", hrefs)).toBe("/ai/runs");
  });

  it("prefers the longer link when two sections match", () => {
    expect(matchingNavHref("/dashboard/seller/earnings", hrefs)).toBe("/dashboard/seller");
    expect(isNavHrefActive("/dashboard/seller", "/dashboard", hrefs)).toBe(false);
    expect(isNavHrefActive("/dashboard/seller/earnings", "/dashboard/seller", hrefs)).toBe(true);
  });

  it("does not treat a shared prefix as the same section", () => {
    expect(isNavHrefActive("/acp-supply", "/acp", hrefs)).toBe(false);
    expect(isNavHrefActive("/ai/run/template", "/ai/runs", hrefs)).toBe(false);
  });

  it("ignores in-page jumps and only marks the site root on the root path", () => {
    expect(isNavHrefActive("/explorer", "/#product", hrefs)).toBe(false);
    expect(matchingNavHref("/", hrefs)).toBe("/");
    expect(matchingNavHref("/explorer", hrefs)).not.toBe("/");
  });

  it("ignores a trailing slash and a query string", () => {
    expect(matchingNavHref("/explorer/stats/", hrefs)).toBe("/explorer");
    expect(matchingNavHref("/explorer/stats?tab=chain", hrefs)).toBe("/explorer");
  });
});
