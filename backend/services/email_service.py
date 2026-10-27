import os
import re
import smtplib
import email.utils
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

def sanitize_recipient(email_input):
    """Safely extracts and sanitizes a valid bare email address."""
    if not email_input:
        return ""
    clean = str(email_input).strip()
    _, addr = email.utils.parseaddr(clean)
    if addr and '@' in addr:
        return addr.strip().lower()
    match = re.search(r'[\w\.\+\-]+@[\w\.\-]+\.\w+', clean)
    if match:
        return match.group(0).strip().lower()
    return clean.lower()

def _load_smtp_config():
    """Loads and normalizes SMTP configuration from backend/.env."""
    env_file = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', '.env')
    if os.path.exists(env_file):
        load_dotenv(env_file, override=True)

    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com').strip()
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_username = os.environ.get('SMTP_USERNAME', '').strip()
    smtp_password = os.environ.get('SMTP_PASSWORD', '').replace(' ', '').strip()
    
    # If using Gmail, envelope from must be the authenticated username
    is_gmail = 'gmail.com' in smtp_server.lower() or 'google' in smtp_server.lower()
    smtp_from_email = smtp_username if is_gmail else (os.environ.get('SMTP_FROM_EMAIL', '').strip() or smtp_username)
    smtp_from_name = os.environ.get('SMTP_FROM_NAME', 'Human Skin Disease Detection AI').strip()
    smtp_use_tls = os.environ.get('SMTP_USE_TLS', 'True').lower() in ('true', '1', 'yes')

    return {
        'server': smtp_server,
        'port': smtp_port,
        'username': smtp_username,
        'password': smtp_password,
        'from_email': smtp_from_email,
        'from_name': smtp_from_name,
        'use_tls': smtp_use_tls,
        'is_gmail': is_gmail
    }

def _open_smtp_session(cfg):
    """
    Connects and logs into SMTP server with automatic port/protocol fallback.
    Tries 587 (STARTTLS) and 465 (SSL) to guarantee delivery across strict network firewalls.
    """
    primary_port = cfg['port']
    primary_is_ssl = (primary_port == 465)
    fallback_port = 465 if primary_port != 465 else 587
    fallback_is_ssl = (fallback_port == 465)

    attempts = [
        (primary_port, primary_is_ssl),
        (fallback_port, fallback_is_ssl)
    ]

    last_exc = None
    for port, is_ssl in attempts:
        try:
            print(f"[EMAIL SERVICE] Connecting to {cfg['server']}:{port} (SSL={is_ssl})...", flush=True)
            if is_ssl:
                server = smtplib.SMTP_SSL(cfg['server'], port, timeout=14)
            else:
                server = smtplib.SMTP(cfg['server'], port, timeout=14)
                if cfg['use_tls']:
                    server.starttls()

            server.login(cfg['username'], cfg['password'])
            return server, port
        except Exception as e:
            last_exc = e
            print(f"[EMAIL SERVICE] Connection to port {port} failed: {e}. Trying fallback...", flush=True)

    raise last_exc

def send_email(to_email, subject, html_content, plain_content=None):
    """
    Universal email delivery function to dispatch any email to a specific recipient.
    Includes full recipient sanitization and multi-port delivery fallback.
    """
    clean_to = sanitize_recipient(to_email)
    if not clean_to or '@' not in clean_to:
        return {"success": False, "error": f"Invalid recipient email address: '{to_email}'"}

    cfg = _load_smtp_config()
    if not cfg['username'] or not cfg['password']:
        print(f"\n[EMAIL SERVICE NOTICE] SMTP credentials not set in backend/.env.")
        print(f"Would have delivered '{subject}' to: {clean_to}\n", flush=True)
        return {"success": False, "simulated": True, "message": "SMTP not configured in backend/.env", "recipient": clean_to}

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f'"{cfg["from_name"]}" <{cfg["from_email"]}>'
        msg['To'] = clean_to
        msg['Reply-To'] = cfg["from_email"]

        if plain_content:
            msg.attach(MIMEText(plain_content, 'plain'))
        if html_content:
            msg.attach(MIMEText(html_content, 'html'))

        server, active_port = _open_smtp_session(cfg)
        server.sendmail(cfg['from_email'], [clean_to], msg.as_string())
        server.quit()
        print(f"[EMAIL SERVICE SUCCESS] Real email delivered to {clean_to} via port {active_port}!", flush=True)
        return {"success": True, "message": f"Email successfully delivered to {clean_to}", "recipient": clean_to}
    except Exception as e:
        err_msg = str(e)
        print(f"[EMAIL SERVICE ERROR] Failed to deliver email to {clean_to}: {err_msg}", flush=True)
        return {"success": False, "error": err_msg, "simulated": True, "recipient": clean_to}

def send_otp_email(to_email, otp_code, full_name="User", purpose="registration"):
    """
    Dispatches a professional 6-digit OTP verification email to the specified recipient email.
    Supports standard SMTP / Gmail TLS/SSL delivery with automatic error recovery.
    """
    clean_to = sanitize_recipient(to_email)

    if purpose == 'registration':
        subject = f"Your Verification Code: {otp_code} — Human Skin Disease Detection"
        action_text = "complete your user registration and access your clinical screening portal"
    else:
        subject = f"Password Reset Code: {otp_code} — Human Skin Disease Detection"
        action_text = "reset your password and restore access to your account"

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
                    AI-Powered Dermatological Analysis System
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
                    Human Skin Disease Detection &bull; Educational Dermatological AI Platform
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

Human Skin Disease Detection AI Platform
    """

    res = send_email(to_email=clean_to, subject=subject, html_content=html_content, plain_content=plain_content)
    if not res.get('success'):
        print(f"\n>>> Active OTP for {clean_to}: {otp_code} <<<\n", flush=True)
    return res

def send_prediction_report_email(to_email, patient_name, prediction_data, disease_info=None, personal_note=""):
    """
    Sends a complete clinical screening summary and risk assessment report to any designated recipient email.
    """
    clean_to = sanitize_recipient(to_email)
    condition_name = prediction_data.get('predicted_class', 'Dermatological Condition')
    confidence = prediction_data.get('confidence', 0.0)
    severity = prediction_data.get('severity_level', 'Clinical Review Recommended')

    subject = f"Clinical Screening Report: {condition_name} ({confidence}%) — Human Skin Disease Detection"

    causes_html = ""
    if disease_info and disease_info.get('causes'):
        causes_items = "".join([f"<li style='margin-bottom: 6px;'>{c}</li>" for c in disease_info.get('causes')[:4]])
        causes_html = f"""
        <div style="margin-top: 20px; padding: 16px; background: rgba(8, 201, 245, 0.08); border-left: 4px solid #08C9F5; border-radius: 6px;">
          <h4 style="margin: 0 0 8px; color: #08C9F5; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Key Biological & Environmental Causes</h4>
          <ul style="margin: 0; padding-left: 20px; color: #CBD5E1; font-size: 13px; line-height: 1.5;">
            {causes_items}
          </ul>
        </div>
        """

    note_html = ""
    if personal_note:
        note_html = f"""
        <div style="margin-bottom: 20px; padding: 14px; background: rgba(255, 255, 255, 0.04); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
          <strong style="color: #FFFFFF; font-size: 13px;">Sender Note:</strong>
          <p style="margin: 4px 0 0; color: #CBD5E1; font-size: 13px;">{personal_note}</p>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020B1C; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #FFFFFF;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020B1C; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 640px; background-color: #071B33; border: 1px solid rgba(8, 201, 245, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
              
              <tr>
                <td style="padding: 28px 36px; background: linear-gradient(135deg, rgba(8, 123, 255, 0.25) 0%, rgba(8, 201, 245, 0.15) 100%); border-bottom: 1px solid rgba(8, 201, 245, 0.25); text-align: center;">
                  <h2 style="margin: 0; font-size: 20px; color: #FFFFFF;">Human Skin Disease Detection</h2>
                  <p style="margin: 4px 0 0; font-size: 12px; color: #08C9F5; text-transform: uppercase; letter-spacing: 0.1em;">
                    Dermatological AI Screening Report
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 32px 36px;">
                  {note_html}
                  <p style="color: #94A3B8; font-size: 14px; margin-top: 0;">
                    Patient Name: <strong style="color: #FFFFFF;">{patient_name}</strong>
                  </p>

                  <div style="padding: 20px; background: rgba(2, 11, 28, 0.85); border: 1px solid rgba(8, 201, 245, 0.4); border-radius: 12px; margin: 20px 0;">
                    <div style="font-size: 12px; color: #94A3B8; text-transform: uppercase;">Top Diagnostic Classification</div>
                    <div style="font-size: 26px; font-weight: 800; color: #08C9F5; margin: 6px 0;">
                      {condition_name}
                    </div>
                    <div style="display: flex; gap: 16px; font-size: 13px; color: #E2E8F0; margin-top: 8px;">
                      <span>Model Confidence: <strong>{confidence}%</strong></span> &bull; 
                      <span>Classification Risk: <strong>{severity}</strong></span>
                    </div>
                  </div>

                  {causes_html}

                  <div style="margin-top: 24px; padding: 16px; background: rgba(239, 68, 68, 0.08); border-left: 4px solid #EF4444; border-radius: 6px; font-size: 12px; color: #FCA5A5; line-height: 1.5;">
                    <strong>Important Medical Notice:</strong> This report is generated by an educational AI research model and is not a clinical medical diagnosis. Please consult a board-certified dermatologist for direct clinical evaluation and biopsy.
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 18px 36px; background-color: #020B1C; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; font-size: 11px; color: #64748B;">
                  Human Skin Disease Detection &bull; Automated Diagnostic Dispatch to {clean_to}
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
Human Skin Disease Detection — AI Screening Report
Patient: {patient_name}
Detected Condition: {condition_name}
Model Confidence: {confidence}%
Risk Severity: {severity}

Important Notice: This educational report is generated for screening assistance and does not substitute for clinical medical evaluation by a licensed physician.
    """

    return send_email(to_email=clean_to, subject=subject, html_content=html_content, plain_content=plain_content)
