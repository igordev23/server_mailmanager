import express from "express";
import MailtmService from "../services/mailtm.service.js";
import { MAILTM_DATA } from "../server.js";
import { supabase } from "../supabaseClient.js";

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
router.get("/sync", async (req, res) => {
  try {
    console.log("---------- SYNC START ----------");

    const rawInbox = await MailtmService.getInbox(MAILTM_DATA.token);

    console.log("Inbox cru:", rawInbox);

    if (!rawInbox || rawInbox.length === 0) {
      console.log("Nenhuma mensagem na MailTM.");
      return res.json({ synced: 0, inserted: 0, newEmails: false });
    }

    // Mapeia
    const mapped = rawInbox.map(mapMailTmToEmail);

    console.log("Emails mapeados:", mapped);

    // Lista apenas IDs da MailTM
    const mailtmIds = mapped.map(m => m.id);

    // Busca todos IDs já existentes no Supabase de uma vez (MUUUUITO mais eficiente)
    const { data: existingInDb, error: fetchError } = await supabase
      .from("emails")
      .select("mailtm_id")
      .in("mailtm_id", mailtmIds);

    if (fetchError) {
      console.error("Erro Supabase ao buscar ids:", fetchError);
      return res.status(500).json({ error: "Erro Supabase ao buscar ids" });
    }

    const existingIds = new Set(existingInDb?.map(e => e.mailtm_id));

    // Filtra somente os emails novos
    const newEmails = mapped.filter(m => !existingIds.has(m.id));

    console.log("Novos emails encontrados:", newEmails.length);

    if (newEmails.length === 0) {
      console.log("Nenhum email novo. Nada a inserir.");
      return res.json({ synced: mapped.length, inserted: 0, newEmails: false });
    }

    // Inserir todos de uma vez (melhor performance)
    const insertPayload = newEmails.map(msg => ({
      mailtm_id: msg.id,
      sender: msg.sender,
      recipient: msg.recipient,
      subject: msg.subject,
      body: msg.body,
      date: msg.date,
      state: msg.state,
      city: msg.city,
      status: msg.status,
      is_manual: msg.isManual
    }));

    const { error: insertError, data: insertedData } = await supabase
      .from("emails")
      .insert(insertPayload)
      .select("*");

    if (insertError) {
      console.error("❌ Erro ao inserir no Supabase:", insertError);
      return res.status(500).json({ error: "Erro ao inserir no Supabase" });
    }

    console.log("✔ Inseridos com sucesso:", insertedData);

    console.log("---------- SYNC END ----------");

    res.json({
      synced: mapped.length,
      inserted: newEmails.length,
      newEmails: true
    });

  } catch (error) {
    console.error("🔥 ERRO FATAL NO SYNC:", error);
    res.status(500).json({ error: "Erro ao sincronizar emails" });
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
