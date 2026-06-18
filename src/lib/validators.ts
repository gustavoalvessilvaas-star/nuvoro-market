import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Enter your full name"),
  customer_email: z.string().email("Enter a valid email"),
  customer_phone: z.string().optional(),
  address1: z.string().min(3, "Enter address line 1"),
  address2: z.string().optional(),
  city: z.string().min(2, "Enter city"),
  state: z.string().min(2, "Enter state"),
  zip: z.string().min(5, "Enter ZIP code"),
  country: z.string().default("United States")
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  order_id: z.string().optional(),
  reason: z.enum(["Order question", "Tracking", "Return/refund", "Product question", "Other"]),
  message: z.string().min(10),
  company: z.string().optional()
});

export const trackingSchema = z.object({
  order_id: z.string().min(6),
  customer_email: z.string().email()
});

export const eventSchema = z.object({
  event_name: z.enum(["PageView", "ViewContent", "ViewItemList", "AddToCart", "ViewCart", "InitiateCheckout", "AddShippingInfo", "AddPaymentInfo", "Purchase", "Refund", "Lead", "Search", "ContactSubmit"]),
  product_id: z.string().optional(),
  order_id: z.string().optional(),
  customer_email: z.string().email().optional(),
  source: z.string().default("web"),
  metadata: z.record(z.unknown()).optional()
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  source: z.string().default("home_newsletter")
});
