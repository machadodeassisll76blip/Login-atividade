const sessaoAtual = (() => { try { return JSON.parse(localStorage.getItem("arasakaSessaoAtual") || "null"); } catch { return null; } })();
const nomeAtual = localStorage.getItem("usuarioLogado");
const registroSessao = (() => { try { return JSON.parse(localStorage.getItem("arasakaSessoes") || "[]").find((s) => s.id === sessaoAtual?.id); } catch { return null; } })();
if (!sessaoAtual || !nomeAtual || !registroSessao || registroSessao.estado !== "ativa") window.location.replace("index.html");
else {
  document.querySelector("#nomeUsuario").textContent = nomeAtual;
  document.querySelector("#avatarUsuario").textContent = nomeAtual.trim().charAt(0).toUpperCase() || "U";
  const linkGestao = document.querySelector("#linkGestao");
  if (linkGestao && sessaoAtual.papel === "admin") linkGestao.hidden = false;
}
const padrao = [
  { id:"ARS-001", nome:"Kestrel Smart Platform", classe:"Plataforma inteligente", departamento:"Pesquisa & Desenvolvimento", estado:"Em avaliação" },
  { id:"ARS-002", nome:"Aegis Personal Shield", classe:"Equipamento de proteção", departamento:"Segurança Corporativa", estado:"Aprovado para catálogo" },
  { id:"ARS-003", nome:"Mantis Robotics Unit", classe:"Robótica de defesa", departamento:"Robótica", estado:"Em desenvolvimento" },
  { id:"ARS-004", nome:"Sentinel Compliance Suite", classe:"Sistema não letal", departamento:"Conformidade", estado:"Em avaliação" }
];
function lerItens() {
  try { const itens = JSON.parse(localStorage.getItem("arasakaInventario") || "null"); return Array.isArray(itens) && itens.length ? itens : padrao; }
  catch { return padrao; }
}
function escapar(texto) { return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }
function renderizar() {
  const termo = document.querySelector("#buscaItem").value.trim().toLowerCase();
  const classe = document.querySelector("#filtroClasse").value;
  const itens = lerItens().filter((i) => (!classe || i.classe === classe) && [i.nome,i.id,i.classe,i.departamento,i.estado].some((v) => String(v || "").toLowerCase().includes(termo)));
  document.querySelector("#totalItens").textContent = lerItens().length;
  document.querySelector("#dataCatalogo").textContent = new Date().toLocaleDateString("pt-BR");
  const grade = document.querySelector("#gradeCatalogo");
  grade.innerHTML = itens.length ? itens.map((i) => `<article class="panel module-card arms-card" data-code="${escapar(i.id)}"><span class="module-code">${escapar(i.id)} // ARASAKA ARMS</span><h3>${escapar(i.nome)}</h3><p>${escapar(i.classe)} · ${escapar(i.departamento)}</p><p class="arms-state">${escapar(i.estado)}</p><button class="button-secondary" type="button" data-solicitar="${escapar(i.id)}">Solicitar ficha</button></article>`).join("") : '<p class="empty-cell">Nenhum item corresponde aos filtros selecionados.</p>';
  grade.querySelectorAll("[data-solicitar]").forEach((botao) => botao.addEventListener("click", () => solicitar(botao.dataset.solicitar)));
  renderizarSolicitacoes();
}
function solicitar(id) {
  const item = lerItens().find((i) => i.id === id);
  if (!item) return;
  const lista = (() => { try { const v=JSON.parse(localStorage.getItem("arasakaSolicitacoes") || "[]"); return Array.isArray(v)?v:[]; } catch { return []; } })();
  lista.unshift({ id:Date.now(), itemId:item.id, item:item.nome, usuario:sessaoAtual?.usuario || nomeAtual, data:new Date().toISOString(), estado:"Registrada localmente" });
  localStorage.setItem("arasakaSolicitacoes", JSON.stringify(lista.slice(0,100)));
  const logs = (() => { try { const v=JSON.parse(localStorage.getItem("arasakaAuditoria") || "[]"); return Array.isArray(v)?v:[]; } catch { return []; } })();
  logs.unshift({ id:Date.now()+Math.random(), tipo:"SOLICITACAO_CATALOGO", usuario:sessaoAtual?.usuario || nomeAtual, detalhes:`Solicitada ficha para ${item.id}`, data:new Date().toISOString() });
  localStorage.setItem("arasakaAuditoria", JSON.stringify(logs.slice(0,250)));
  document.querySelector("#mensagemCatalogo").textContent = `Solicitação local registrada para: ${item.nome}.`;
  document.querySelector("#mensagemCatalogo").dataset.type = "success";
  renderizarSolicitacoes();
}
function renderizarSolicitacoes() {
  const lista = (() => { try { const v=JSON.parse(localStorage.getItem("arasakaSolicitacoes") || "[]"); return Array.isArray(v)?v:[]; } catch { return []; } })();
  const minhas = lista.filter((i) => i.usuario === (sessaoAtual?.usuario || nomeAtual));
  document.querySelector("#listaSolicitacoes").innerHTML = minhas.length ? minhas.map((i) => `<div class="activity-item"><span class="activity-dot"></span><div><strong>${escapar(i.item)}</strong><span>${escapar(new Date(i.data).toLocaleString("pt-BR"))} · ${escapar(i.estado)}</span></div></div>`).join("") : '<p class="admin-help">Você ainda não registrou solicitações neste navegador.</p>';
}
document.querySelector("#buscaItem").addEventListener("input", renderizar);
document.querySelector("#filtroClasse").addEventListener("change", renderizar);
document.querySelector("#botaoSair").addEventListener("click", () => {
  const sessoes = (() => { try { return JSON.parse(localStorage.getItem("arasakaSessoes") || "[]"); } catch { return []; } })();
  localStorage.setItem("arasakaSessoes", JSON.stringify(sessoes.map((s) => s.id === sessaoAtual?.id ? { ...s, estado:"encerrada", fim:new Date().toISOString() } : s)));
  localStorage.removeItem("usuarioLogado"); localStorage.removeItem("arasakaSessaoAtual"); window.location.replace("index.html");
});
renderizar();