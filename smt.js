import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 587,
  secure: false, // TLS true só se usar port 465
  auth: {
    user: "aluno.ifpi.edu.br",
    pass: "12345678",
  },
});

async function send() {
  const info = await transporter.sendMail({
    from: "Seu Nome <capir.2024116tads0030@aluno.ifpi.edu.br>",
    to: "francisco.igor89898@gmail.com",
    subject: "Teste SMTP2GO",
    text: "Funcionou!",
  });

  console.log("E-mail enviado:", info.messageId);
}

send().catch(console.error);
