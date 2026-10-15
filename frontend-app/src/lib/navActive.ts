/** In-page jumps such as `/#product` are not routes and never count as the current page. */
export function isNavPageHref(href: string): boolean {
  return !href.startsWith("/#");
}

function normalizePath(pathname: string | null | undefined): string {
  const path = String(pathname || "").split("?")[0].split("#")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

/**
 * The current nav href is the longest page link that is the path itself or a
 * parent of it. A shorter link must not stay current when a more specific
 * link also matches (`/dashboard` vs `/dashboard/seller`).
 */
export function matchingNavHref(pathname: string | null | undefined, hrefs: readonly string[]): string | null {
  const path = normalizePath(pathname);
  let best: string | null = null;
  let bestLength = -1;
  for (const href of hrefs) {
    if (!isNavPageHref(href)) continue;
    const target = normalizePath(href);
    const matches = path === target || (target !== "/" && path.startsWith(`${target}/`));
    if (!matches || target.length <= bestLength) continue;
    best = href;
    bestLength = target.length;
  }
  return best;
}

export function isNavHrefActive(
  pathname: string | null | undefined,
  href: string,
  hrefs: readonly string[],
): boolean {
  return matchingNavHref(pathname, hrefs) === href;
}
