import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// LISTAR EMAILS
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// BUSCAR 1 EMAIL
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error });
  res.json(data);
});

// ATUALIZAR (classificação, estado, cidade, etc.)
// ATUALIZAR (classificação, estado, cidade, etc.)
router.put("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("emails")
      .update({
        ...req.body,
        updated_at: new Date()
      })
      .eq("id", req.params.id)
      .select("*") // <- garante que retorna o registro atualizado
      .single();

    if (error) return res.status(500).json({ error });
    res.json(data);
  } catch (err) {
    console.error("Erro no PUT /emails/:id:", err);
    res.status(500).json({ error: "Erro inesperado ao atualizar email" });
  }
});


// DELETAR
router.delete("/:id", async (req, res) => {
  const { error } = await supabase
    .from("emails")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});

// CREATE - Inserir email manualmente
router.post("/", async (req, res) => {
  try {
    // Campos permitidos vindo do cliente
    const {
      sender,
      recipient,
      subject,
      body,
      date,
      state,
      city,
      status,
      is_manual
    } = req.body;

    // Monta o payload apenas com os campos permitidos
    const payload = {
      sender: sender ?? null,
      recipient: recipient ?? null,
      subject: subject ?? null,
      body: body ?? null,
      // se o cliente enviar date, tenta converter; senão usa agora()
      date: date ? new Date(date) : new Date(),
      state: state ?? null,
      city: city ?? null,
      status: status ?? "pending",
      // força como manual se não for informado explicitamente
      is_manual: typeof is_manual === "boolean" ? is_manual : true,
      // created_at/updated_at são gerenciados pelo banco (mas podemos definir updated_at)
      updated_at: new Date()
    };

    // Inserir no Supabase e retornar o registro criado
    const { data, error } = await supabase
      .from("emails")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao inserir email manualmente:", error);
      return res.status(500).json({ error });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error("Erro inesperado no POST /emails:", err);
    return res.status(500).json({ error: "Erro inesperado ao criar email" });
  }
});


export default router;
