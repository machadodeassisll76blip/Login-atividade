const formAdminLogin = document.querySelector("#formAdminLogin");
const msgAdmin = document.querySelector("#mensagemAdminLogin");

function eventoAdmin(tipo, usuario, detalhes) {
  try {
    const logs = JSON.parse(localStorage.getItem("arasakaAuditoria") || "[]");
    logs.unshift({ id: Date.now() + Math.random(), tipo, usuario: usuario || "desconhecido", detalhes, data: new Date().toISOString() });
    localStorage.setItem("arasakaAuditoria", JSON.stringify(logs.slice(0, 250)));
  } catch {}
}

formAdminLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  const usuario = document.querySelector("#usuarioAdmin").value.trim();
  const senha = document.querySelector("#senhaAdmin").value;

  // Conta administrativa fixa para demonstração. Não use este modelo em produção.
  if (usuario !== "admin" || senha !== "1234") {
    eventoAdmin("LOGIN_ADMIN_FALHOU", usuario, "Credenciais administrativas inválidas");
    msgAdmin.textContent = "Acesso negado. Verifique as credenciais administrativas.";
    msgAdmin.dataset.type = "error";
    return;
  }

  const sessao = {
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    usuario: "admin",
    nome: "Administrador Arasaka",
    papel: "admin",
    inicio: new Date().toISOString()
  };
  localStorage.setItem("usuarioLogado", sessao.nome);
  localStorage.setItem("arasakaSessaoAtual", JSON.stringify(sessao));
  let sessoes = [];
  try {
    sessoes = JSON.parse(localStorage.getItem("arasakaSessoes") || "[]");
    if (!Array.isArray(sessoes)) sessoes = [];
  } catch {}
  sessoes.unshift({ ...sessao, estado: "ativa" });
  localStorage.setItem("arasakaSessoes", JSON.stringify(sessoes.slice(0, 100)));
  eventoAdmin("LOGIN_ADMIN_SUCESSO", "admin", "Sessão administrativa local iniciada");
  msgAdmin.textContent = "Acesso autorizado. Abrindo painel...";
  msgAdmin.dataset.type = "success";
  window.setTimeout(() => { window.location.href = "admin.html"; }, 350);
});
