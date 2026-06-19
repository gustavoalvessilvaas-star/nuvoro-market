export const siteConfig = {
  name: "Nuvoro Market",
  slogan: "Smart finds for everyday living.",
  description: "Discover practical products designed to make your home, car, pet care and daily routine easier.",
  promise: "Make everyday life easier with smart, useful and affordable products.",
  supportEmail: process.env.SUPPORT_EMAIL || "support@nuvoromarket.com",
  currency: "USD"
};

export const categories = [
  "Home & Organization",
  "Pet Care",
  "Car Essentials",
  "Travel & Outdoor",
  "Tech Accessories"
];

export const fulfillmentSteps = [
  "order_received",
  "processing",
  "shipped",
  "in_transit",
  "delivered"
] as const;

export const defaultBundleOptions = [
  { id: "single", label: "1x PawTrim LED Grinder", quantity: 1, totalPrice: 29.95 },
  { id: "double", label: "2x PawTrim LED Grinder", quantity: 2, totalPrice: 49.95, badge: "Best Value" },
  { id: "triple", label: "3x PawTrim LED Grinder", quantity: 3, totalPrice: 64.95, badge: "Family Pack" }
] as const;
