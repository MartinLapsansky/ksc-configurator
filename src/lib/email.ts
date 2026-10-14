import { Resend } from "resend";
import type { OrderNotificationRecipient } from "@/types/preview";
import { formatOrderNumber } from "@/lib/orderNumber";

/**
 * Email notifications sent after an order/enquiry is created.
 */
const FROM_EMAIL = "no-reply@customizeit.kcsports.ie";
const SALES_EMAIL = "kcscustomizeit@gmail.com";
const LOGO_URL = "https://customizeit.kcsports.ie/products/logos/kcs_logo_header.png";

function renderCustomerEmailHtml(order: OrderNotificationRecipient): string {
  const customerName = order.firstName;
  const orderNumber = formatOrderNumber(order.orderNumber);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Request Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #e4e4e7;">
                    <tr>
                        <td align="center" style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #f0f0f2;">
                            <img src="${LOGO_URL}" alt="KCS SINCE 1996" width="130" style="display: block; width: 130px; max-width: 100%; height: auto; border: 0;" />
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="font-size: 15px; font-weight: 600; color: #111113; padding-bottom: 20px;">
                                        Hi ${customerName},
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px; line-height: 1.6; color: #52525b; padding-bottom: 16px;">
                                        Thank you for submitting your quote request through Customizeit. Your reference number is <strong>${orderNumber}</strong>.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px; line-height: 1.6; color: #52525b; padding-bottom: 24px;">
                                        Our sales team is currently reviewing your request and will be in contact shortly.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 14px; line-height: 1.6; color: #52525b; padding-top: 8px; border-top: 1px solid #f0f0f2;">
                                        Kind Regards,<br>
                                        <strong style="color: #111113;">The KCS Sales Team</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #f0f0f2; font-size: 12px; color: #a1a1aa;">
                            This is an automated message, please do not reply directly to this email.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

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
  const orderNumber = formatOrderNumber(order.orderNumber);

  try {
    const [customerResult, salesResult] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [order.email],
        subject: "Quote Request Received",
        html: renderCustomerEmailHtml(order),
        text: `Dear ${customerName}, we received your quote request with reference number: ${orderNumber}. Our sales team is currently reviewing your request and will be in contact shortly.`,
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