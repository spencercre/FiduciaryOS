import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'
import process from 'node:process'
import { Buffer } from 'node:buffer'

// https://vite.dev/config/
const renderVerificationEmailHtml = ({ code }) => {
  const safeCode = String(code || '').replace(/[^0-9]/g, '').slice(0, 6);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0;background:#f8fafc;padding:24px;font-family:Inter,Arial,sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="height:6px;background:#FF5C35;"></div>
      <div style="padding:32px 28px 8px 28px;text-align:center;">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:14px;background:#183B56;box-shadow:0 8px 24px rgba(15,23,42,0.12);">
          <div style="width:18px;height:18px;border-radius:4px;background:#F5C26B;"></div>
        </div>
        <div style="margin-top:12px;font-weight:800;letter-spacing:0.02em;font-size:18px;color:#183B56;">Fiduciary Operating System</div>
      </div>

      <div style="padding:18px 28px 32px 28px;text-align:center;">
        <div style="font-size:22px;font-weight:800;margin:8px 0 10px 0;">Verify your email</div>
        <div style="font-size:14px;line-height:1.55;color:#334155;margin:0 auto;max-width:480px;">Enter this code in your browser to verify your email:</div>

        <div style="margin:22px auto 10px auto;display:inline-block;background:#183B56;color:#ffffff;border-radius:12px;padding:12px 18px;font-size:28px;font-weight:900;letter-spacing:0.28em;font-family:'JetBrains Mono',ui-monospace,Menlo,Monaco,Consolas,monospace;">
          ${safeCode.split('').join(' ')}
        </div>

        <div style="font-size:12px;color:#64748b;margin-top:10px;">Code will expire in 30 minutes.</div>

        <div style="margin-top:26px;font-size:12px;color:#64748b;">Not you? If you didn’t request a code to sign up for Fiduciary Operating System, you can safely ignore this email.</div>
      </div>
    </div>
    <div style="max-width:640px;margin:14px auto 0 auto;font-size:11px;color:#94a3b8;text-align:center;">© ${new Date().getFullYear()} Fiduciary Operating System</div>
  </body>
</html>`;
};

const renderVerificationEmailText = ({ code }) => {
  const safeCode = String(code || '').replace(/[^0-9]/g, '').slice(0, 6);
  return `Fiduciary Operating System\n\nVerify your email\n\nEnter this code in your browser to verify your email:\n${safeCode}\n\nCode will expire in 30 minutes.\n\nIf you didn’t request this code, you can ignore this email.`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const smtpHost = env.SMTP_HOST;
  const smtpPort = env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined;
  const smtpSecure = env.SMTP_SECURE === 'true' || env.SMTP_SECURE === '1';
  const smtpUser = env.SMTP_USER;
  const smtpPass = env.SMTP_PASS;
  const smtpFrom = env.SMTP_FROM || 'Fiduciary Operating System <no-reply@fiduciary-os.com>';

  return {
    plugins: [
      react(),
      {
        name: 'fos-verification-email',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url ? new URL(req.url, 'http://localhost') : null;
            if (!url || url.pathname !== '/api/send-verification') return next();
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
              return;
            }

            const chunks = [];
            req.on('data', (c) => chunks.push(c));
            req.on('end', async () => {
              try {
                const raw = Buffer.concat(chunks).toString('utf8');
                const body = raw ? JSON.parse(raw) : {};
                const email = String(body.email || '').trim();
                const code = String(body.code || '').replace(/[^0-9]/g, '').slice(0, 6);

                if (!/.+@.+\..+/.test(email)) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: false, error: 'Invalid email address' }));
                  return;
                }
                if (code.length !== 6) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: false, error: 'Invalid verification code' }));
                  return;
                }
                if (!smtpHost || !smtpUser || !smtpPass || !smtpPort) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      ok: false,
                      error: 'Email delivery is not configured on this server.'
                    })
                  );
                  return;
                }

                const transporter = nodemailer.createTransport({
                  host: smtpHost,
                  port: smtpPort,
                  secure: smtpSecure,
                  auth: { user: smtpUser, pass: smtpPass }
                });

                await transporter.sendMail({
                  from: smtpFrom,
                  to: email,
                  subject: 'Your Fiduciary OS verification code',
                  html: renderVerificationEmailHtml({ code }),
                  text: renderVerificationEmailText({ code })
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true }));
              } catch (err) {
                void err;
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, error: 'Failed to send verification email' }));
              }
            });
          });
        }
      }
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('/firebase/') || id.includes('\\firebase\\') || id.includes('node_modules/firebase')) return 'firebase';
            if (id.includes('/react/') || id.includes('\\react\\') || id.includes('node_modules/react')) return 'react';
            if (id.includes('/react-dom/') || id.includes('\\react-dom\\') || id.includes('node_modules/react-dom')) return 'react-dom';
            if (id.includes('/lucide-react/') || id.includes('\\lucide-react\\') || id.includes('node_modules/lucide-react')) return 'icons';
            return 'vendor';
          }
        }
      }
    }
  };
})
