const formLogin = document.querySelector("#formLogin");
const mensagem = document.querySelector("#mensagem");

function mostrarMensagem(texto, tipo = "") {
  mensagem.textContent = texto;
  mensagem.dataset.type = tipo;
}
function lerUsuarios() {
  try {
    const dados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch { return []; }
}
function auditar(tipo, usuario, detalhes = "") {
  try {
    const logs = JSON.parse(localStorage.getItem("arasakaAuditoria") || "[]");
    logs.unshift({ id: Date.now() + Math.random(), tipo, usuario: usuario || "desconhecido", detalhes, data: new Date().toISOString() });
    localStorage.setItem("arasakaAuditoria", JSON.stringify(logs.slice(0, 250)));
  } catch {}
}
formLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  const usuario = document.querySelector("#usuario").value.trim();
  const senha = document.querySelector("#senha").value;
  const encontrado = lerUsuarios().find((item) =>
    String(item.usuario || "").toLowerCase() === usuario.toLowerCase() && item.senha === senha && item.ativo !== false && item.papel !== "admin"
  );
  if (!encontrado) {
    auditar("LOGIN_FALHOU", usuario, "Credenciais inválidas");
    mostrarMensagem("Credenciais inválidas. Verifique os dados e tente novamente.", "error");
    return;
  }
  const sessao = {
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    usuario: encontrado.usuario,
    nome: encontrado.nome,
    papel: encontrado.papel || "colaborador",
    inicio: new Date().toISOString()
  };
  localStorage.setItem("usuarioLogado", encontrado.nome || encontrado.usuario);
  localStorage.setItem("arasakaSessaoAtual", JSON.stringify(sessao));
  const sessoes = JSON.parse(localStorage.getItem("arasakaSessoes") || "[]");
  sessoes.unshift({ ...sessao, estado: "ativa" });
  localStorage.setItem("arasakaSessoes", JSON.stringify(sessoes.slice(0, 100)));
  auditar("LOGIN_SUCESSO", encontrado.usuario, "Sessão local iniciada");
  mostrarMensagem("Acesso autorizado. Abrindo a rede corporativa...", "success");
  window.setTimeout(() => {
    window.location.href = sessao.papel === "admin" ? "admin.html" : "home.html";
  }, 350);
});