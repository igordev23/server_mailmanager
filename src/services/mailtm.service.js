async function getDomain() {
  const domainRes = await fetch("https://api.mail.tm/domains");
  const json = await domainRes.json();
  return json["hydra:member"][0].domain;
}

async function createMailTmAccount() {
  const domain = await getDomain();

  const email = `user${Date.now()}@${domain}`;
  const password = "12345678";

  const accountRes = await fetch("https://api.mail.tm/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password }),
  });

  const account = await accountRes.json();

  const tokenRes = await fetch("https://api.mail.tm/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: email, password }),
  });

  const token = await tokenRes.json();

  return {
    email,
    token: token.token,
    id: token.id,
  };
}

async function getInbox(token) {
  const msgRes = await fetch("https://api.mail.tm/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const inbox = await msgRes.json();
  
  // Garantir array sempre
  return Array.isArray(inbox["hydra:member"]) ? inbox["hydra:member"] : [];
}


async function getMessageById(token, messageId) {
  const msgRes = await fetch(`https://api.mail.tm/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await msgRes.json();
}

async function getSource(id, token) {
  const res = await fetch(`https://api.mail.tm/sources/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return await res.text();
}

export default {
  createMailTmAccount,
  getInbox,
  getMessageById,
  getSource
};
