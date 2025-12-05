import express from "express";
import { WEBHOOK_CLIENTS } from "../server.js";
import { MAILTM_DATA } from "../server.js";
import MailtmService from "../services/mailtm.service.js";

const router = express.Router();

// MailTM chama ESTE endpoint quando chegar email
router.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", req.body);

  // MailTM só envia ID da mensagem
  const messageId = req.body["messageId"] || req.body["id"];

  if (!messageId) {
    return res.status(400).json({ error: "Webhook sem messageId" });
  }

  const fullMsg = await MailtmService.getMessageById(MAILTM_DATA.token, messageId);

  // Mapeia para o formato do frontend
  const email = {
    id: fullMsg.id,
    sender: fullMsg.from?.address ?? "",
    recipient: fullMsg.to?.[0]?.address ?? "",
    subject: fullMsg.subject ?? "",
    body: fullMsg.intro ?? "",
    date: new Date(fullMsg.createdAt),
    status: "pending",
    isManual: false,
    createdAt: new Date(fullMsg.createdAt),
    updatedAt: new Date(fullMsg.updatedAt ?? fullMsg.createdAt),
  };

  // Enviar para todos os WebSocket clientes ativos
  for (const ws of WEBHOOK_CLIENTS) {
    ws.send(JSON.stringify({ type: "NEW_EMAIL", email }));
  }

  res.json({ ok: true });
});

export default router;
