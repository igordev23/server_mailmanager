import express from "express";
import cors from "cors";
import mailtmRoutes from "./routes/mailtm.routes.js";
import MailtmService from "./services/mailtm.service.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/emails", emailRoutes);
app.use("/mailtm", mailtmRoutes);

export let MAILTM_DATA = null;

async function startServer() {
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
console.log("Servidor rodando na porta " + PORT);

MAILTM_DATA = await MailtmService.createMailTmAccount();
console.log("Conta criada:");
console.log("Email:", MAILTM_DATA.email);
console.log("Token:", MAILTM_DATA.token);

const baseUrl = process.env.RENDER_EXTERNAL_URL;
if (!baseUrl) {
  console.log("A variável RENDER_EXTERNAL_URL não está definida.");
  return;
}

setInterval(async () => {
  try {
    console.log("Rodando sync automático...");
    const response = await fetch(baseUrl + "/mailtm/sync");
    const json = await response.json();
    console.log("Resultado:", json);
  } catch (err) {
    console.error("Erro no sync:", err);
  }
}, 10000);


});
}

startServer();