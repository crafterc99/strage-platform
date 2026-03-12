import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Strage Clothing <orders@strage.com>'
const ADMIN_EMAIL = 'admin@strage.com'

interface Order {
  orderNumber: string
  garmentType: string
  quantity: number
  status: string
}

export async function sendOrderConfirmation(customerEmail: string, order: Order) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] Skipping (no API key):', 'Order confirmation to', customerEmail)
    return
  }

  await resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a5c2e;">Order Confirmed</h1>
        <p>Thank you for your order! Here are the details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Order #</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.orderNumber}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Garment</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.garmentType}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Quantity</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.quantity}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Status</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.status}</td></tr>
        </table>
        <p style="margin-top: 20px;">We'll be in touch shortly with a quote. You can track your order status in your portal.</p>
        <p style="color: #666;">— Strage Clothing Team</p>
      </div>
    `,
  })
}

export async function sendAdminNotification(order: Order) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] Skipping (no API key):', 'Admin notification for', order.orderNumber)
    return
  }

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Order — ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Order Received</h2>
        <p><strong>Order:</strong> ${order.orderNumber}</p>
        <p><strong>Garment:</strong> ${order.garmentType}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><a href="${process.env.CLIENT_URL}/admin/orders">View in Admin Portal</a></p>
      </div>
    `,
  })
}
