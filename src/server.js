import express from "express";
import cors from "cors";
import mailtmRoutes from "./routes/mailtm.routes.js";
import MailtmService from "./services/mailtm.service.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/emails", emailRoutes);

// 🔥 Variável global para guardar email e token
export let MAILTM_DATA = null;

app.use("/mailtm", mailtmRoutes);

// 🔥 Quando o servidor iniciar, cria o email automaticamente
app.use("/mailtm", mailtmRoutes);

app.listen(3000, async () => {
  console.log("Servidor rodando na porta 3000 🚀");

  MAILTM_DATA = await MailtmService.createMailTmAccount();
  console.log("Conta criada:", MAILTM_DATA);
  console.log("📧 Email:", MAILTM_DATA.email);
  console.log("🔑 Token:", MAILTM_DATA.token);
  // 🔥 Iniciar sincronização automática a cada 10 segundos
setInterval(async () => {
  try {
    console.log("⏱ Rodando sync automático...");
    const response = await fetch("http://localhost:3000/mailtm/sync");
    const json = await response.json();
    console.log("Resultado:", json);
  } catch (err) {
    console.error("Erro no sync automático:", err);
  }
}, 10000); // 10 segundos

});
