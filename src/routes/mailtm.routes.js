import express from "express";
import MailtmService from "../services/mailtm.service.js";
import { MAILTM_DATA } from "../server.js";

const router = express.Router();

// Helper para mapear mensagens do MailTM → Email entity
function mapMailTmToEmail(msg) {
  return {
    id: msg.id,
    sender: msg.from?.address ?? "",
    recipient: msg.to?.[0]?.address ?? "",
    subject: msg.subject ?? "",
    body: msg.intro ?? "", // resumo da mensagem; se quiser corpo completo, usar sourceUrl
    date: new Date(msg.createdAt),
    state: undefined,
    city: undefined,
    status: "pending", // todo email novo começa pendente
    isManual: false,
    createdAt: new Date(msg.createdAt),
    updatedAt: new Date(msg.updatedAt ?? msg.createdAt),
  };
}

// Rota para visualizar conta criada
router.get("/info", (req, res) => {
  res.json(MAILTM_DATA);
});

// Inbox usando token automático
router.get("/inbox", async (req, res) => {
  try {
    const rawInbox = await MailtmService.getInbox(MAILTM_DATA.token);

    // Garantir que seja sempre um array
    const emails = Array.isArray(rawInbox) ? rawInbox.map(mapMailTmToEmail) : [];

    res.json(emails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar inbox" });
  }
});


// Mensagem por id
router.get("/message/:id", async (req, res) => {
  try {
    const rawMsg = await MailtmService.getMessageById(
      MAILTM_DATA.token,
      req.params.id
    );

    if (!rawMsg || !rawMsg.id) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    const email = mapMailTmToEmail(rawMsg);
    res.json(email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar mensagem" });
  }
});


// Source completo (opcional)
router.get("/source/:id", async (req, res) => {
  try {
    const source = await MailtmService.getSource(
      req.params.id,
      MAILTM_DATA.token
    );
    res.send(source);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar source" });
  }
});

export default router;
