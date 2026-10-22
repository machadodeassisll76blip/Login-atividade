function lerUsuarios() {
  try {
    const dados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

const nome = localStorage.getItem("usuarioLogado");
let sessaoAtual = null;
try { sessaoAtual = JSON.parse(localStorage.getItem("arasakaSessaoAtual") || "null"); } catch {}
const registroSessao = (() => { try { return JSON.parse(localStorage.getItem("arasakaSessoes") || "[]").find((s) => s.id === sessaoAtual?.id); } catch { return null; } })();
if (!nome || !sessaoAtual || !registroSessao || registroSessao.estado !== "ativa") {
  window.location.replace("index.html");
} else {
  let perfilTopo = {};
  try { perfilTopo = JSON.parse(localStorage.getItem("arasakaPerfil_" + String(sessaoAtual.usuario || "").toLowerCase()) || "{}"); } catch {}
  const nomeExibicao = perfilTopo.nome || nome;
  document.querySelector("#nomeUsuario").textContent = nomeExibicao;
  const avatarTopo = document.querySelector("#avatarUsuario");
  if (perfilTopo.foto) { const imagem = document.createElement("img"); imagem.src = perfilTopo.foto; imagem.alt = ""; avatarTopo.replaceChildren(imagem); }
  else avatarTopo.textContent = (nomeExibicao.trim().charAt(0) || "U").toUpperCase();
  document.querySelector("#tituloBoasVindas").textContent = `Bem-vindo, ${nomeExibicao}. O futuro não espera.`;
  document.querySelector("#totalUsuarios").textContent = lerUsuarios().length;
  const linkGestao = document.querySelector("#linkGestao");
  if (linkGestao && sessaoAtual && sessaoAtual.papel === "admin") linkGestao.hidden = false;
}

function lerListaLocal(chave) { try { const v = JSON.parse(localStorage.getItem(chave) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } }
function registrarEventoLocal(tipo, detalhes) { const logs = lerListaLocal("arasakaAuditoria"); logs.unshift({ id: Date.now() + Math.random(), tipo, usuario: sessaoAtual?.usuario || nome, detalhes, data: new Date().toISOString() }); localStorage.setItem("arasakaAuditoria", JSON.stringify(logs.slice(0, 250))); }
function atualizarRelogio() {
  const agora = new Date();
  document.querySelector("#relogio").textContent = agora.toLocaleTimeString("pt-BR", { hour12: false });
  document.querySelector("#dataAtual").textContent = agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}
atualizarRelogio();
window.setInterval(atualizarRelogio, 1000);

document.querySelector("#botaoSair").addEventListener("click", () => {
  const sessoes = lerListaLocal("arasakaSessoes");
  localStorage.setItem("arasakaSessoes", JSON.stringify(sessoes.map((s) => s.id === sessaoAtual?.id ? { ...s, estado: "encerrada", fim: new Date().toISOString() } : s)));
  registrarEventoLocal("LOGOUT", "Sessão local encerrada.");
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("arasakaSessaoAtual");
  window.location.replace("index.html");
});

const filtro = document.querySelector("#filtroModulos");
const modulos = [...document.querySelectorAll(".module-card")];
filtro.addEventListener("input", () => {
  const termo = filtro.value.trim().toLocaleLowerCase("pt-BR");
  modulos.forEach((modulo) => {
    const texto = `${modulo.dataset.search} ${modulo.textContent}`.toLocaleLowerCase("pt-BR");
    modulo.hidden = !texto.includes(termo);
  });
});

const consoleForm = document.querySelector("#consoleForm");
const consoleInput = document.querySelector("#consoleInput");
const consoleOutput = document.querySelector("#consoleOutput");

function imprimirConsole(linha) {
  consoleOutput.textContent += `\n${linha}`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

consoleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const comando = consoleInput.value.trim().toLowerCase();
  if (!comando) return;
  consoleInput.value = "";
  if (comando === "clear") {
    consoleOutput.textContent = "ARASAKA NET [build 2.7.04]\nTerminal limpo. Digite \"help\" para obter ajuda.";
    return;
  }
  imprimirConsole(`root@arasaka:~$ ${comando}`);
  const respostas = {
    help: "Comandos disponíveis:\n  help       lista os comandos\n  status     mostra o estado da interface\n  users      conta os perfis locais\n  whoami     mostra o usuário da sessão\n  divisions  lista as divisões corporativas\n  arms       catálogo Arasaka Arms\n  sessions   sessões locais\n  audit      eventos recentes\n  date       mostra data e horário local\n  open       navegar entre módulos\n  clear      limpa o terminal",
    status: "INTERFACE: ONLINE\nBACKEND: NÃO CONFIGURADO\nARMAZENAMENTO: localStorage\nMODO: DEMONSTRAÇÃO FRONT-END",
    users: `Perfis cadastrados neste navegador: ${lerUsuarios().length}`,
    whoami: `Sessão local ativa para: ${nome || "visitante"}`,
    divisions: "SEC // Segurança Corporativa\nR&D // Pesquisa e Desenvolvimento\nOPS // Operações\nNET // Infraestrutura de Rede\nHR // Recursos Humanos\nINT // Inteligência Corporativa\nARS // Arasaka Arms",
    date: new Date().toLocaleString("pt-BR"),
    arms: `Itens do catálogo: ${(() => { try { const itens = JSON.parse(localStorage.getItem("arasakaInventario") || "null"); return Array.isArray(itens) && itens.length ? itens.length : 4; } catch { return 0; } })()}. Acesse armas.html para explorar.`,
    sessions: `Sessões locais registradas: ${(() => { try { return JSON.parse(localStorage.getItem("arasakaSessoes") || "[]").length; } catch { return 0; } })()}`,
    audit: (() => { try { return JSON.parse(localStorage.getItem("arasakaAuditoria") || "[]").slice(0, 5).map((l) => `${l.tipo} | ${l.usuario}`).join("\n") || "Nenhum evento registrado."; } catch { return "Histórico indisponível."; } })()
  };
  if (comando.startsWith("open ")) {
    const destino = comando.slice(5).trim();
    const rotas = { home:"home.html", dashboard:"dashboard.html", arms:"armas.html", gestao:"admin.html" };
    if (!rotas[destino]) imprimirConsole("Destino inválido. Use home, dashboard, arms ou gestao.");
    else if (destino === "gestao" && sessaoAtual?.papel !== "admin") imprimirConsole("Permissão insuficiente para este módulo.");
    else window.location.href = rotas[destino];
    return;
  }
  imprimirConsole(respostas[comando] || `Comando não reconhecido: ${comando}. Digite "help" para consultar a lista.`);
});