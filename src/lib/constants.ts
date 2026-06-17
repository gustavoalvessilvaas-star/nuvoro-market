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
