import { Resend } from "resend";
import type { Order } from "@/lib/types";

const from = process.env.FROM_EMAIL || "Nuvoro Market <orders@nuvoromarket.com>";
const support = process.env.SUPPORT_EMAIL || "support@nuvoromarket.com";

function getClient() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

async function send(to: string, subject: string, html: string) {
  const client = getClient();
  if (!client) {
    console.log("[email:dev]", { to, subject, html });
    return { logged: true };
  }
  return client.emails.send({ from, to, subject, html });
}

export const emailTemplates = {
  orderConfirmation: (order: Partial<Order>) => `<h1>Order received</h1><p>Thanks for shopping with Nuvoro Market.</p><p>Order: ${order.id}</p>`,
  paymentApproved: (order: Partial<Order>) => `<h1>Payment approved</h1><p>Your payment for order ${order.id} was approved.</p>`,
  shipped: (order: Partial<Order>) => `<h1>Your order shipped</h1><p>Tracking code: ${order.tracking_code || "Pending"}</p>`,
  delivered: (order: Partial<Order>) => `<h1>Delivered</h1><p>Your order ${order.id} is marked delivered.</p>`,
  supportNotification: (data: { name: string; email: string; message: string }) => `<h1>New support request</h1><p>${data.name} (${data.email})</p><p>${data.message}</p>`
};

export async function sendOrderConfirmation(order: Partial<Order>) {
  if (!order.customer_email) return;
  return send(order.customer_email, "Nuvoro Market order confirmation", emailTemplates.orderConfirmation(order));
}

export async function sendSupportNotification(data: { name: string; email: string; message: string }) {
  return send(support, "New Nuvoro Market support request", emailTemplates.supportNotification(data));
}
