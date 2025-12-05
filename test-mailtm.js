async function main() {
  try {
    console.log("🔍 Buscando domínios disponíveis...");

    const domainRes = await fetch("https://api.mail.tm/domains");
    const domainJson = await domainRes.json();

    if (!domainJson["hydra:member"] || domainJson["hydra:member"].length === 0) {
      console.log("Nenhum domínio disponível:", domainJson);
      return;
    }

    const domain = domainJson["hydra:member"][0].domain;
    console.log("📡 Usando domínio:", domain);

    const email = `user${Date.now()}@${domain}`;
    const password = "12345678";

    console.log("📨 Criando conta:", email);

    const accountRes = await fetch("https://api.mail.tm/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: email, password }),
    });

    const account = await accountRes.json();
    console.log("Conta criada:", account);

    if (account.detail) {
      console.log("❌ Erro ao criar conta:", account);
      return;
    }

    console.log("🔑 Gerando token...");

    const tokenRes = await fetch("https://api.mail.tm/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: email, password }),
    });

    const tokenData = await tokenRes.json();
    console.log("Token:", tokenData);

    if (!tokenData.token) {
      console.log("❌ Erro ao gerar token:", tokenData);
      return;
    }

    console.log("\n📬 ENVIE EMAIL PARA ESTE ENDEREÇO:");
    console.log("👉", email, "\n");

    console.log("🚀 Monitorando novos emails...\n");

    // ======================
    //   LOOP CONTÍNUO
    // ======================
    let lastMessageId = null;

    while (true) {
      const msgRes = await fetch("https://api.mail.tm/messages", {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });

      const inbox = await msgRes.json();

      const messages = inbox["hydra:member"] || [];

      if (messages.length > 0) {
        const latest = messages[0];

        if (latest.id !== lastMessageId) {
          console.log("📨 NOVA MENSAGEM RECEBIDA:");
          console.log("De:", latest.from?.address);
          console.log("Assunto:", latest.subject);
          console.log("ID:", latest.id);
          console.log("-----------------------------");

          lastMessageId = latest.id;
        }
      }

      // espera 10 segundos sem encerrar servidor
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  } catch (error) {
    console.error("Erro geral:", error);
  }
}

main();
