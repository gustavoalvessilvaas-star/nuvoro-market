"use client";

import { trackEvent } from "@/lib/tracking-client";

export function SearchForm({ query, category }: { query?: string; category: string }) {
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const value = new FormData(form).get("q");
        if (value) trackEvent("Search", { search_term: String(value) });
      }}
    >
      <input className="field min-w-0 sm:w-72" name="q" defaultValue={query} placeholder="Search products" />
      <input type="hidden" name="category" value={category} />
      <button className="btn-primary">Search</button>
    </form>
  );
}
