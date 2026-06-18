"use client";

import { trackEvent } from "@/lib/tracking-client";

const sortOptions = [
  ["featured", "Featured"],
  ["best-sellers", "Best sellers"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["biggest-discount", "Biggest discount"],
  ["newest", "Newest"]
];

export function SearchForm({ query, category, sort }: { query?: string; category: string; sort: string }) {
  return (
    <form
      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_auto]"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const value = new FormData(form).get("q");
        if (value) trackEvent("Search", { search_term: String(value) });
      }}
    >
      <label className="sr-only" htmlFor="product-search">Search products</label>
      <input id="product-search" className="field min-w-0" name="q" defaultValue={query} placeholder="Search products" />
      <label className="sr-only" htmlFor="product-sort">Sort products</label>
      <select
        id="product-sort"
        className="field"
        name="sort"
        defaultValue={sort}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <input type="hidden" name="category" value={category} />
      <button className="btn-primary">Search</button>
    </form>
  );
}
