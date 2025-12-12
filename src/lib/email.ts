import nodemailer from "nodemailer";

// Configuração do transporter SMTP
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error(
      "SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD environment variables."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true para 465, false para outras portas
    auth: {
      user,
      pass: password,
    },
  });
};

// Função para enviar email de verificação
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<void> {
  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "FlicApp";

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: "Código de Verificação - FlicApp",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
            <h1 style="color: #2563eb; margin-bottom: 20px;">Código de Verificação</h1>
            <p style="font-size: 16px; margin-bottom: 30px;">
              Use o código abaixo para verificar seu email:
            </p>
            <div style="background-color: #ffffff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; margin: 0;">
                ${code}
              </p>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Este código expira em 10 minutos.
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              Se você não solicitou este código, ignore este email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Código de Verificação - FlicApp
      
      Use o código abaixo para verificar seu email:
      
      ${code}
      
      Este código expira em 10 minutos.
      
      Se você não solicitou este código, ignore este email.
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Função para enviar email de recuperação de senha
export async function sendPasswordResetEmail(
  email: string,
  code: string,
  token: string
): Promise<void> {
  const transporter = createTransporter();
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "FlicApp";
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: "Recuperação de Senha - FlicApp",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h1 style="color: #2563eb; margin-bottom: 20px;">Recuperação de Senha</h1>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Você solicitou a recuperação de senha. Use uma das opções abaixo para redefinir sua senha:
            </p>
            
            <div style="background-color: #ffffff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #2563eb;">
                Opção 1: Use o código de 6 dígitos
              </p>
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; margin: 0;">
                ${code}
              </p>
            </div>

            <div style="background-color: #ffffff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #2563eb;">
                Opção 2: Clique no link abaixo
              </p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
                Redefinir Senha
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              <strong>Importante:</strong>
            </p>
            <ul style="font-size: 14px; color: #666; margin-top: 10px;">
              <li>O código expira em 10 minutos</li>
              <li>O link expira em 1 hora</li>
              <li>Se você não solicitou esta recuperação, ignore este email</li>
            </ul>
            
            <p style="font-size: 12px; color: #999; margin-top: 30px;">
              Ou copie e cole este link no seu navegador:<br>
              <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Recuperação de Senha - FlicApp
      
      Você solicitou a recuperação de senha. Use uma das opções abaixo para redefinir sua senha:
      
      Opção 1: Use o código de 6 dígitos
      ${code}
      
      Opção 2: Acesse o link abaixo
      ${resetUrl}
      
      Importante:
      - O código expira em 10 minutos
      - O link expira em 1 hora
      - Se você não solicitou esta recuperação, ignore este email
    `,
  };

  await transporter.sendMail(mailOptions);
}
