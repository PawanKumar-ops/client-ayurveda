import { Resend } from 'resend'
import type { Order } from '@/lib/order-types'

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

function orderEmailHtml(o: Order, trackUrl: string) {
  const first = esc(o.customer.name.split(' ')[0])
  const rows = o.items
    .map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(i.title)} &times; ${i.qty}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${inr(i.price * i.qty)}</td></tr>`)
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#f6f1e7;font-family:Georgia,serif;color:#1f2a24">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <p style="font-size:22px;font-style:italic;margin:0 0 24px">yubhi ayurveda</p>
  <div style="background:#fff;border-radius:16px;padding:32px">
    <h1 style="font-size:26px;font-weight:normal;margin:0 0 12px">Thank you, ${first}.</h1>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#4a554e;margin:0 0 24px">
      Your order has been placed. We're preparing your ritual with care, and we'll keep you posted every step of the way.
    </p>
    <div style="background:#eef3ec;border-radius:12px;padding:16px 20px;margin:0 0 24px;font-family:Arial,sans-serif">
      <p style="margin:0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#4a554e">Your tracking ID</p>
      <p style="margin:6px 0 0;font-size:22px;letter-spacing:2px;font-weight:bold;color:#24382d">${esc(o.id)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}
      <tr><td style="padding:8px 0;color:#4a554e">Shipping</td><td style="padding:8px 0;text-align:right;color:#4a554e">${o.shipping ? inr(o.shipping) : 'Free'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold">Total (Cash on Delivery)</td><td style="padding:8px 0;text-align:right;font-weight:bold">${inr(o.total)}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#4a554e;margin:24px 0 0">
      Delivering to: ${esc(o.customer.name)}, ${esc(o.address)}, ${esc(o.city)}, ${esc(o.state)} ${esc(o.postalcode)}
    </p>
    <a href="${esc(trackUrl)}" style="display:inline-block;margin-top:28px;background:#24382d;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:1.5px;text-transform:uppercase">Track your order</a>
  </div>
  <p style="font-family:Arial,sans-serif;font-size:12px;color:#7a837d;text-align:center;margin-top:24px">
    Simplified Ayurveda. Advanced Biochemistry. Thank you for choosing us.
  </p>
</div></body></html>`
}

/** Sends the order confirmation. Returns false (and logs) instead of throwing so a mail outage never loses an order. */
export async function sendOrderConfirmation(o: Order, customerEmail: string, origin: string) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!key || !from) {
    console.error('Order email skipped: RESEND_API_KEY or EMAIL_FROM is not configured')
    return false
  }
  const base = process.env.APP_URL || origin
  const trackUrl = `${base.replace(/\/$/, '')}/track?id=${encodeURIComponent(o.id)}`
  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to: customerEmail,
      subject: `Order confirmed — tracking ID ${o.id}`,
      html: orderEmailHtml(o, trackUrl),
      text: `Thank you, ${o.customer.name}. Your order has been placed.\nTracking ID: ${o.id}\nTotal (Cash on Delivery): ${inr(o.total)}\nTrack your order: ${trackUrl}`,
    })
    if (error) { console.error('Order email failed', error); return false }
    return true
  } catch (err) {
    console.error('Order email failed', err)
    return false
  }
}
