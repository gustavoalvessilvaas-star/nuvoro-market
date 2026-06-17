import type { Product } from "@/lib/types";
import { getSupabasePublic } from "@/lib/supabase/server";

const placeholder = (slug: string) => `/placeholders/${slug}.svg`;

export const seedProducts: Product[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "PawTrim LED Grinder",
    slug: "pawtrim-led-grinder",
    description: "A compact electric pet nail grinder with LED visibility for calmer at-home grooming routines.",
    short_description: "Gentle LED pet nail grinder for easier grooming.",
    headline: "Trim Your Pet's Nails Safely at Home",
    subheadline: "A gentle LED nail grinder designed to make grooming easier, safer and less stressful for pets and owners.",
    price: 29.95,
    compare_at_price: 49.95,
    cost_price: 9.5,
    category: "Pet Care",
    images: [placeholder("pawtrim-led-grinder"), placeholder("pawtrim-led-grinder-2")],
    benefits: ["Gentle grinding for safer trimming", "Built-in LED light for better visibility", "Easier grooming at home", "Designed for dogs and cats", "Compact and simple to use"],
    details: { "Product type": "Electric Pet LED Nail Grinder", "Bundle idea": "2 units for $49.95", "Ad angle": "Stop struggling with nail clippers." },
    faqs: [
      { question: "Is this for dogs and cats?", answer: "Yes. Use slow, gentle passes and follow your pet's comfort level." },
      { question: "How fast does it ship?", answer: "Most orders are prepared within 2-4 business days. Estimated delivery is shown before purchase." }
    ],
    status: "active",
    supplier_name: "Manual supplier TBD",
    supplier_url: "",
    shipping_estimate: "Estimated 7-14 business days"
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "FreshSeal Compact Vacuum Sealer",
    slug: "freshseal-compact-vacuum-sealer",
    description: "A compact food vacuum sealer for meal prep, pantry organization and reducing everyday food waste.",
    short_description: "Compact sealer for fresher food storage.",
    headline: "Keep Food Fresh Longer and Reduce Waste",
    subheadline: "Simple vacuum sealing for organized kitchens and smarter storage.",
    price: 34.95,
    compare_at_price: 59.95,
    cost_price: 14,
    category: "Home & Organization",
    images: [placeholder("freshseal-compact-vacuum-sealer")],
    benefits: ["Helps reduce food waste", "Compact countertop footprint", "Useful for meal prep", "Simple one-touch operation"],
    details: { "Product type": "Compact Food Vacuum Sealer" },
    faqs: [{ question: "Are bags included?", answer: "Starter supplies may vary by supplier. Confirm final bundle before launch." }],
    status: "active",
    shipping_estimate: "Estimated 7-14 business days"
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "PowerScrub Drill Brush Kit",
    slug: "powerscrub-drill-brush-kit",
    description: "A drill brush attachment kit for faster cleaning on tile, tubs, wheels and other durable surfaces.",
    short_description: "Turn your drill into a faster cleaning tool.",
    headline: "Clean Tough Stains Faster With Your Drill",
    subheadline: "Scrub durable surfaces with less effort using brush attachments made for common household jobs.",
    price: 24.95,
    compare_at_price: 39.95,
    cost_price: 8,
    category: "Home & Organization",
    images: [placeholder("powerscrub-drill-brush-kit")],
    benefits: ["Speeds up tough scrubbing", "Works with many standard drills", "Multiple brush shapes", "Great for deep cleaning days"],
    details: { "Product type": "Drill Brush Power Scrubber" },
    faqs: [{ question: "Is a drill included?", answer: "No. This kit includes brush attachments only." }],
    status: "active",
    shipping_estimate: "Estimated 7-14 business days"
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "ClearFlow Silicone Drain Protector",
    slug: "clearflow-silicone-drain-protector",
    description: "A flexible silicone drain protector that catches hair and debris before it builds up.",
    short_description: "Catch hair before it clogs the drain.",
    headline: "Stop Hair From Clogging Your Drain",
    subheadline: "A simple bathroom essential that helps keep drains cleaner with less fuss.",
    price: 14.95,
    compare_at_price: 24.95,
    cost_price: 3.5,
    category: "Home & Organization",
    images: [placeholder("clearflow-silicone-drain-protector")],
    benefits: ["Flexible silicone design", "Easy to clean", "Fits many common drains", "Simple everyday prevention"],
    details: { "Product type": "Silicone Drain Protector" },
    faqs: [{ question: "Will it fit every drain?", answer: "It fits many standard drains, but measure before launch photos are finalized." }],
    status: "active",
    shipping_estimate: "Estimated 7-14 business days"
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "SpaceStep Shoe Organizer",
    slug: "spacestep-shoe-organizer",
    description: "Stackable shoe organizers designed to make closet shelves neater and easier to scan.",
    short_description: "Double up shoe storage without remodeling.",
    headline: "Double Your Closet Space Instantly",
    subheadline: "Keep pairs together and make crowded shelves easier to manage.",
    price: 19.95,
    compare_at_price: 34.95,
    cost_price: 6,
    category: "Home & Organization",
    images: [placeholder("spacestep-shoe-organizer")],
    benefits: ["Saves shelf space", "Keeps shoes paired", "Adjustable stacked layout", "Useful for apartments and closets"],
    details: { "Product type": "Shoe Storage Organizer" },
    faqs: [{ question: "How many are included?", answer: "Set size depends on the supplier offer selected before launch." }],
    status: "active",
    shipping_estimate: "Estimated 7-14 business days"
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "ShadeSnap Magnetic Car Curtain",
    slug: "shadesnap-magnetic-car-curtain",
    description: "A magnetic car window curtain for shade and privacy while parked or riding as a passenger.",
    short_description: "Quick shade and privacy for car windows.",
    headline: "Instant Shade and Privacy for Your Car",
    subheadline: "Attach, adjust and remove in seconds for a more comfortable ride.",
    price: 22.95,
    compare_at_price: 39.95,
    cost_price: 7,
    category: "Car Essentials",
    images: [placeholder("shadesnap-magnetic-car-curtain")],
    benefits: ["Magnetic attachment", "Helps reduce glare", "Easy to remove", "Compact for travel"],
    details: { "Product type": "Magnetic Car Window Curtain" },
    faqs: [{ question: "Can I drive with it on front windows?", answer: "Follow local laws and never block required visibility while driving." }],
    status: "active",
    shipping_estimate: "Estimated 7-14 business days"
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    name: "GripGo Car Phone Holder",
    slug: "gripgo-car-phone-holder",
    description: "A secure phone mount that keeps navigation visible without cluttering the dashboard.",
    short_description: "Keep your phone stable and easy to see.",
    headline: "Keep Your Phone Secure and Visible While Driving",
    subheadline: "A practical mount for cleaner navigation and hands-free convenience.",
    price: 18.95,
    compare_at_price: 29.95,
    cost_price: 5,
    category: "Car Essentials",
    images: [placeholder("gripgo-car-phone-holder")],
    benefits: ["Stable grip", "Works for daily navigation", "Compact setup", "Easy angle adjustment"],
    details: { "Product type": "Phone Mount / Car Phone Holder" },
    faqs: [{ question: "Does it fit all phones?", answer: "It fits many common phone sizes. Confirm final specs with the chosen supplier." }],
    status: "active",
    shipping_estimate: "Estimated 7-14 business days"
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    name: "LiftDesk Laptop Stand",
    slug: "liftdesk-laptop-stand",
    description: "A portable laptop stand for cleaner desk setups and more comfortable screen height.",
    short_description: "Lift your laptop for a cleaner desk setup.",
    headline: "Improve Your Desk Setup and Posture in Seconds",
    subheadline: "A simple stand for remote work, study spaces and everyday laptop use.",
    price: 27.95,
    compare_at_price: 44.95,
    cost_price: 10,
    category: "Tech Accessories",
    images: [placeholder("liftdesk-laptop-stand")],
    benefits: ["Raises screen height", "Portable design", "Helps organize desk space", "Useful for work and study"],
    details: { "Product type": "Laptop Stand" },
    faqs: [{ question: "Is it adjustable?", answer: "Final adjustability depends on the selected supplier model." }],
    status: "active",
    shipping_estimate: "Estimated 7-14 business days"
  }
];

export function getActiveProducts() {
  return seedProducts.filter((product) => product.status === "active");
}

export function getProductBySlug(slug: string) {
  return seedProducts.find((product) => product.slug === slug && product.status === "active") || null;
}

export async function getStoreProducts() {
  const supabase = getSupabasePublic();
  if (!supabase) return getActiveProducts();
  const { data, error } = await supabase.from("products").select("*").eq("status", "active").order("created_at", { ascending: false });
  if (error || !data?.length) return getActiveProducts();
  return data as Product[];
}

export async function getStoreProductBySlug(slug: string) {
  const supabase = getSupabasePublic();
  if (!supabase) return getProductBySlug(slug);
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("status", "active").single();
  if (error || !data) return getProductBySlug(slug);
  return data as Product;
}
