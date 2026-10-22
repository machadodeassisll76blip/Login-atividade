function lerUsuarios() {
  try {
    const dados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

const nome = localStorage.getItem("usuarioLogado");
if (!nome) {
  window.location.replace("index.html");
} else {
  document.querySelector("#nomeUsuario").textContent = nome;
  document.querySelector("#avatarUsuario").textContent = nome.trim().charAt(0).toUpperCase() || "U";
  document.querySelector("#tituloBoasVindas").textContent = `Bem-vindo, ${nome}. O futuro não espera.`;
  document.querySelector("#totalUsuarios").textContent = lerUsuarios().length;
}

function atualizarRelogio() {
  const agora = new Date();
  document.querySelector("#relogio").textContent = agora.toLocaleTimeString("pt-BR", { hour12: false });
  document.querySelector("#dataAtual").textContent = agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}
atualizarRelogio();
window.setInterval(atualizarRelogio, 1000);

document.querySelector("#botaoSair").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
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
    help: "Comandos disponíveis:\n  help       lista os comandos\n  status     mostra o estado da interface\n  users      conta os perfis locais\n  whoami     mostra o usuário da sessão\n  divisions  lista as divisões corporativas\n  date       mostra data e horário local\n  clear      limpa o terminal",
    status: "INTERFACE: ONLINE\nBACKEND: NÃO CONFIGURADO\nARMAZENAMENTO: localStorage\nMODO: DEMONSTRAÇÃO FRONT-END",
    users: `Perfis cadastrados neste navegador: ${lerUsuarios().length}`,
    whoami: `Sessão local ativa para: ${nome || "visitante"}`,
    divisions: "SEC // Segurança Corporativa\nR&D // Pesquisa e Desenvolvimento\nOPS // Operações\nNET // Infraestrutura de Rede\nHR // Recursos Humanos\nINT // Inteligência Corporativa",
    date: new Date().toLocaleString("pt-BR"),
    arms: `Itens do catálogo: ${(() => { try { return JSON.parse(localStorage.getItem("arasakaInventario") || "[]").length; } catch { return 0; } })()}. Acesse armas.html para explorar.`,
    sessions: `Sessões locais registradas: ${(() => { try { return JSON.parse(localStorage.getItem("arasakaSessoes") || "[]").length; } catch { return 0; } })()}`
  };
  imprimirConsole(respostas[comando] || `Comando não reconhecido: ${comando}. Digite "help" para consultar a lista.`);
});