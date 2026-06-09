import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, feature } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      // Graceful degradation: log and return success so UI still works during dev
      console.warn('RESEND_API_KEY not set — skipping email send.')
      return NextResponse.json({ success: true })
    }

    const notifyEmail = process.env.NOTIFICATION_EMAIL || 'customercare_datasense@gmail.com'

    // 1. Send confirmation to the user
    await resend.emails.send({
      from: 'DataSense AI <waitlist@updates.datasense-ai.com>',
      to: email,
      subject: `You're on the waitlist for ${feature}! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#09090b;font-family:'Inter',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#0f0f15;border:1px solid #1a1a2e;border-radius:16px;overflow:hidden;">
                <!-- Header bar -->
                <tr><td style="background:linear-gradient(90deg,#8b5cf6,#7c3aed);height:4px;"></td></tr>
                <!-- Logo -->
                <tr><td style="padding:32px 40px 0;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:linear-gradient(135deg,#8b5cf6,#a78bfa);border-radius:8px;padding:6px 10px;">
                        <span style="color:#fff;font-weight:700;font-size:14px;">DS</span>
                      </td>
                      <td style="padding-left:10px;color:#fff;font-weight:600;font-size:16px;">DataSense AI</td>
                    </tr>
                  </table>
                </td></tr>
                <!-- Body -->
                <tr><td style="padding:28px 40px 32px;">
                  <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0 0 12px;">You're on the list! 🎉</h1>
                  <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 20px;">
                    Thanks for signing up for early access to <strong style="color:#a78bfa;">${feature}</strong>.
                    We'll send you a personal email the moment it's ready to use.
                  </p>
                  <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 28px;">
                    In the meantime, you can start using DataSense AI's current features for free — no credit card needed.
                  </p>
                  <a href="https://datasense-ai.vercel.app/dashboard"
                     style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;font-weight:600;font-size:15px;text-decoration:none;padding:12px 28px;border-radius:10px;">
                    Go to Dashboard →
                  </a>
                </td></tr>
                <!-- Footer -->
                <tr><td style="padding:20px 40px;border-top:1px solid #1a1a2e;">
                  <p style="color:#52525b;font-size:12px;margin:0;">
                    © ${new Date().getFullYear()} DataSense AI · You received this because you joined our waitlist.
                  </p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    // 2. Notify owner
    await resend.emails.send({
      from: 'DataSense AI Waitlist <waitlist@updates.datasense-ai.com>',
      to: notifyEmail,
      subject: `New waitlist signup: ${feature}`,
      html: `
        <p><strong>New signup on the <em>${feature}</em> waitlist:</strong></p>
        <p style="font-size:18px;">${email}</p>
        <p style="color:#888;font-size:13px;">Time: ${new Date().toUTCString()}</p>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('Waitlist API error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
