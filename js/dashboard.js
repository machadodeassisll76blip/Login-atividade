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
  document.querySelector("#nomeUsuario").textContent = nome;
  document.querySelector("#avatarUsuario").textContent = nome.trim().charAt(0).toUpperCase() || "U";
  const linkGestao = document.querySelector("#linkGestao");
  if (linkGestao && sessaoAtual && sessaoAtual.papel === "admin") linkGestao.hidden = false;
}

function atualizarRelogio() {
  const agora = new Date();
  document.querySelector("#relogio").textContent = agora.toLocaleTimeString("pt-BR", { hour12: false });
  document.querySelector("#dataAtual").textContent = agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  document.querySelector("#horaEvento1").textContent = agora.toLocaleTimeString("pt-BR", { hour12: false });
}
atualizarRelogio();
window.setInterval(atualizarRelogio, 1000);

const tabela = document.querySelector("#tabelaUsuarios");
const filtro = document.querySelector("#filtroUsuarios");
const total = document.querySelector("#totalUsuarios");
const resultado = document.querySelector("#resultadoUsuarios");

function criarCelula(texto) {
  const celula = document.createElement("td");
  celula.textContent = texto;
  celula.style.padding = "14px 18px";
  celula.style.borderTop = "1px solid rgba(255,255,255,.07)";
  celula.style.color = "#d9d1dc";
  return celula;
}

function renderizarUsuarios() {
  const usuarios = lerUsuarios();
  const termo = filtro.value.trim().toLocaleLowerCase("pt-BR");
  const encontrados = usuarios.filter((usuario) => {
    const texto = [usuario.nome, usuario.usuario, usuario.email].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
    return texto.includes(termo);
  });

  total.textContent = usuarios.length;
  document.querySelector("#estadoPersistencia").textContent = `${usuarios.length} perfil(is) encontrado(s) no armazenamento local.`;
  document.querySelector("#integridadeDiretorio").textContent = usuarios.length >= 0 ? "100%" : "N/A";
  document.querySelector("#barraDiretorio").style.width = "100%";
  tabela.replaceChildren();

  if (encontrados.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 4;
    celula.textContent = usuarios.length ? "Nenhum usuário corresponde à pesquisa." : "Nenhum cadastro encontrado. Use Novo usuário para adicionar um perfil.";
    celula.style.cssText = "padding:22px 18px;color:#a69ca8";
    linha.append(celula);
    tabela.append(linha);
  } else {
    encontrados.forEach((usuario) => {
      const linha = document.createElement("tr");
      linha.append(
        criarCelula(usuario.nome || "Sem nome"),
        criarCelula(usuario.usuario || "—"),
        criarCelula(usuario.email || "—")
      );
      const status = criarCelula("CADASTRADO LOCALMENTE");
      status.style.color = "#8df0b5";
      status.style.fontSize = ".72rem";
      status.style.fontWeight = "700";
      linha.append(status);
      tabela.append(linha);
    });
  }
  resultado.textContent = `Exibindo ${encontrados.length} de ${usuarios.length} perfil(is). Os dados ficam apenas neste navegador.`;
}

filtro.addEventListener("input", renderizarUsuarios);
document.querySelector("#botaoAtualizar").addEventListener("click", () => {
  renderizarUsuarios();
  atualizarRelogio();
});
document.querySelector("#botaoSair").addEventListener("click", () => {
  const sessoes = (() => { try { return JSON.parse(localStorage.getItem("arasakaSessoes") || "[]"); } catch { return []; } })();
  localStorage.setItem("arasakaSessoes", JSON.stringify(sessoes.map((s) => s.id === sessaoAtual?.id ? { ...s, estado: "encerrada", fim: new Date().toISOString() } : s)));
  const logs = (() => { try { return JSON.parse(localStorage.getItem("arasakaAuditoria") || "[]"); } catch { return []; } })();
  logs.unshift({ id: Date.now(), tipo: "LOGOUT", usuario: sessaoAtual?.usuario || nome, detalhes: "Sessão local encerrada.", data: new Date().toISOString() });
  localStorage.setItem("arasakaAuditoria", JSON.stringify(logs.slice(0, 250)));
  localStorage.removeItem("usuarioLogado"); localStorage.removeItem("arasakaSessaoAtual");
  window.location.replace("index.html");
});
renderizarUsuarios();