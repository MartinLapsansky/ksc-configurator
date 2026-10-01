import { Resend } from "resend";

/**
 * Email notifications sent after an order/enquiry is created.
 *
 * The "from" address must be a domain verified in Resend. Until the
 * production domain's DNS records are configured, Resend's test address is
 * used as a placeholder.
 */
const FROM_EMAIL = "onboarding@resend.dev";
const SALES_EMAIL = "martin.lapsa2@gmail.com";

type OrderNotificationRecipient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  county: string;
  country: string;
  organisation: string;
  quantity: number;
  message: string;
};

/**
 * Sends the customer confirmation and the internal sales notification.
 *
 * Returns `true` when both emails are accepted by Resend. Failures are logged
 * but intentionally do not block order creation.
 */
export async function sendOrderNotifications(
  order: OrderNotificationRecipient,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured; skipping order emails.");
    return false;
  }

  const resend = new Resend(apiKey);

  const customerName = order.firstName;
  const orderNumber = order.id;

  try {
    const [customerResult, salesResult] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [order.email],
        subject: "We received your order",
        text: `Dear ${customerName}, we received your order with order number: ${orderNumber}, we will reach you soon with another informations.`,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [SALES_EMAIL],
        subject: `New order created: ${orderNumber}`,
        text: [
          `New order created.`,
          ``,
          `Order number: ${orderNumber}`,
          `Name: ${order.firstName} ${order.lastName}`,
          `Email: ${order.email}`,
          `Organisation: ${order.organisation || "-"}`,
          `Phone: ${order.phoneCountryCode} ${order.phoneNumber}`,
          `County: ${order.county}`,
          `Country: ${order.country || "-"}`,
          `Quantity: ${order.quantity}`,
          ``,
          `Message: ${order.message || "-"}`,
        ].join("\n"),
      }),
    ]);

    if (customerResult.error) {
      console.error("Failed to send customer email:", customerResult.error);
    }

    if (salesResult.error) {
      console.error("Failed to send sales email:", salesResult.error);
    }

    return !customerResult.error && !salesResult.error;
  } catch (error) {
    console.error("Error sending order notifications:", error);
    return false;
  }
}