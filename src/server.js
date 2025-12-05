import express from "express";
import cors from "cors";
import mailtmRoutes from "./routes/mailtm.routes.js";
import MailtmService from "./services/mailtm.service.js";

const app = express();
app.use(cors());
app.use(express.json());

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
});
