import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";

const articles: Record<string, { title: string; intro: string; sections: Array<[string, string]> }> = {
  "pet-grooming-at-home": {
    title: "How to Make Pet Grooming Easier at Home",
    intro: "A calmer grooming routine starts with patience, short sessions and tools that make the task feel more controlled.",
    sections: [
      ["Start slowly", "Let your pet inspect tools before use and keep the first session short."],
      ["Focus on comfort", "Use gentle handling, breaks and rewards instead of rushing the process."],
      ["Know when to pause", "If your pet seems distressed or a nail looks injured, stop and contact a professional."]
    ]
  },
  "smart-home-organization-finds": {
    title: "Smart Home Organization Finds for Small Spaces",
    intro: "Small storage upgrades can make apartments, closets and kitchens easier to use every day.",
    sections: [
      ["Choose visible wins", "Pick products that solve a daily annoyance you can see and feel."],
      ["Measure first", "Check dimensions before buying organizers or storage accessories."],
      ["Avoid clutter", "Useful products should simplify routines, not add more objects to manage."]
    ]
  },
  "car-essentials-for-daily-driving": {
    title: "Car Essentials for Daily Driving",
    intro: "Good car accessories support comfort, visibility and organization without distracting from safe driving.",
    sections: [
      ["Keep visibility clear", "Never use accessories that block required visibility or controls."],
      ["Prioritize simple setup", "Daily-use items should be easy to install, adjust and remove."],
      ["Check local rules", "Window, mount and shade accessories may be subject to local driving laws."]
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles[params.slug];
  return { title: article?.title || "Journal" };
}

export default function JournalArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug];
  if (!article) notFound();

  return (
    <article className="container-page max-w-3xl py-12">
      <SectionHeading eyebrow="Smart Finds Journal" title={article.title}>
        <p>{article.intro}</p>
      </SectionHeading>
      <div className="mt-8 grid gap-5">
        {article.sections.map(([title, text]) => (
          <section key={title} className="card-surface p-6">
            <h2 className="text-xl font-black text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">{text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
