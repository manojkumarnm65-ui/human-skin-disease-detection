import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

def send_otp_email(to_email, otp_code, full_name="User", purpose="registration"):
    """
    Dispatches a professional 6-digit OTP email to the specified recipient email.
    Supports standard SMTP / Gmail TLS/SSL delivery.
    If SMTP credentials are not configured, logs clearly and returns simulated flag.
    """
    env_file = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', '.env')
    if os.path.exists(env_file):
        load_dotenv(env_file, override=True)

    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME', '').strip()
    smtp_password = os.environ.get('SMTP_PASSWORD', '').replace(' ', '').strip()
    smtp_from_email = os.environ.get('SMTP_FROM_EMAIL', smtp_username or 'noreply@skincare.ai').strip()
    smtp_from_name = os.environ.get('SMTP_FROM_NAME', 'Human Skin Disease Detection AI').strip()
    smtp_use_tls = os.environ.get('SMTP_USE_TLS', 'True').lower() in ('true', '1', 'yes')

    # Subject line based on purpose
    if purpose == 'registration':
        subject = f"Your Verification Code: {otp_code} — Human Skin Disease Detection"
        action_text = "complete your user registration and access your clinical screening portal"
    else:
        subject = f"Password Reset Code: {otp_code} — Human Skin Disease Detection"
        action_text = "reset your password and restore access to your account"

    # HTML Email Template with Medical AI Theme
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020B1C; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #FFFFFF;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020B1C; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #071B33; border: 1px solid rgba(8, 201, 245, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
              
              <!-- Brand Header -->
              <tr>
                <td style="padding: 32px 40px; background: linear-gradient(135deg, rgba(8, 123, 255, 0.25) 0%, rgba(8, 201, 245, 0.15) 100%); border-bottom: 1px solid rgba(8, 201, 245, 0.25); text-align: center;">
                  <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: linear-gradient(135deg, #087BFF 0%, #08C9F5 100%); margin-bottom: 12px; font-size: 24px;">
                    🔬
                  </div>
                  <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">
                    Human Skin Disease <span style="color: #08C9F5;">Detection</span>
                  </h1>
                  <p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em;">
                    AI-Powered Dermatological Analysis
                  </p>
                </td>
              </tr>

              <!-- Main Content Area -->
              <tr>
                <td style="padding: 36px 40px;">
                  <p style="margin: 0 0 16px; font-size: 16px; color: #E2E8F0; line-height: 1.6;">
                    Hello <strong style="color: #FFFFFF;">{full_name}</strong>,
                  </p>
                  <p style="margin: 0 0 24px; font-size: 15px; color: #94A3B8; line-height: 1.6;">
                    Please use the following 6-digit one-time password (OTP) to {action_text}.
                  </p>

                  <!-- 6-Digit OTP Box -->
                  <div style="margin: 28px 0; padding: 22px; background: rgba(2, 11, 28, 0.85); border: 1px solid #08C9F5; border-radius: 12px; text-align: center; box-shadow: 0 0 25px rgba(8, 201, 245, 0.25);">
                    <div style="font-size: 12px; font-weight: 700; color: #08C9F5; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">
                      Verification Code
                    </div>
                    <div style="font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #08C9F5; font-family: 'Courier New', Courier, monospace;">
                      {otp_code}
                    </div>
                  </div>

                  <p style="margin: 0 0 12px; font-size: 14px; color: #94A3B8; line-height: 1.5; text-align: center;">
                    ⏳ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                  </p>

                  <!-- Security Advisory -->
                  <div style="margin-top: 30px; padding: 16px; background: rgba(245, 158, 11, 0.08); border-left: 4px solid #F59E0B; border-radius: 6px; font-size: 12px; color: #FDE68A; line-height: 1.5;">
                    <strong>Security Notice:</strong> If you did not initiate this request on Human Skin Disease Detection, please disregard this message or secure your account.
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: #020B1C; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; font-size: 12px; color: #64748B;">
                  <p style="margin: 0 0 6px;">
                    Human Skin Disease Detection &bull; Educational Dermatological AI System
                  </p>
                  <p style="margin: 0;">
                    Automated system notification &mdash; please do not reply directly to this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    plain_content = f"""
Human Skin Disease Detection — AI Verification Code

Hello {full_name},

Your 6-digit verification code is: {otp_code}

This code is valid for 10 minutes. Please enter this code to {action_text}.
If you did not request this verification code, please ignore this email.

Human Skin Disease Detection AI System
    """

    # If SMTP is configured, send the real email via SMTP
    if smtp_username and smtp_password:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{smtp_from_name} <{smtp_from_email}>"
            msg['To'] = to_email

            part1 = MIMEText(plain_content, 'plain')
            part2 = MIMEText(html_content, 'html')
            msg.attach(part1)
            msg.attach(part2)

            print(f"[EMAIL SERVICE] Connecting to {smtp_server}:{smtp_port} for {to_email}...", flush=True)
            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=12)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port, timeout=12)
                if smtp_use_tls:
                    server.starttls()

            server.login(smtp_username, smtp_password)
            server.sendmail(smtp_from_email, [to_email], msg.as_string())
            server.quit()
            print(f"[EMAIL SERVICE SUCCESS] Real OTP email successfully delivered to {to_email}!", flush=True)
            return {"success": True, "message": f"Verification code sent to {to_email}"}
        except Exception as e:
            err_msg = str(e)
            print(f"[EMAIL SERVICE ERROR] Failed to deliver email via SMTP: {err_msg}", flush=True)
            # Fallback info for development
            return {"success": False, "error": err_msg, "simulated": True}
    else:
        print(f"\n[EMAIL SERVICE NOTICE] SMTP credentials not set in backend/.env.", flush=True)
        print(f"To deliver actual emails to {to_email}, configure SMTP_USERNAME and SMTP_PASSWORD in backend/.env.", flush=True)
        print(f">>> Active OTP for {to_email}: {otp_code} <<<\n", flush=True)
        return {"success": False, "simulated": True, "message": "SMTP not configured in backend/.env"}
