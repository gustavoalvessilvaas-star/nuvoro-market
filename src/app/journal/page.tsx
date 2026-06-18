import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

const posts = [
  { slug: "pet-grooming-at-home", title: "How to Make Pet Grooming Easier at Home", excerpt: "Simple, low-pressure tips for calmer routine care." },
  { slug: "smart-home-organization-finds", title: "Smart Home Organization Finds for Small Spaces", excerpt: "Practical ways to make everyday storage easier." },
  { slug: "car-essentials-for-daily-driving", title: "Car Essentials for Daily Driving", excerpt: "Useful accessories that support cleaner, more comfortable drives." }
];

export const metadata = { title: "Smart Finds Journal" };

export default function JournalPage() {
  return (
    <section className="container-page py-12">
      <SectionHeading eyebrow="Journal" title="Smart Finds Journal">
        <p>Helpful guides for practical routines, product research and smarter everyday shopping.</p>
      </SectionHeading>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/journal/${post.slug}`} className="card-surface p-6 hover:-translate-y-1 hover:shadow-soft">
            <p className="eyebrow">Guide</p>
            <h2 className="mt-3 text-xl font-black text-ink">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
