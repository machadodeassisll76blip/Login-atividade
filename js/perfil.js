const $ = (selector) => document.querySelector(selector);
const form = $("#formPerfil");
const mensagem = $("#mensagemPerfil");
let sessao = null;
try { sessao = JSON.parse(localStorage.getItem("arasakaSessaoAtual") || "null"); } catch {}
const nomeSessao = localStorage.getItem("usuarioLogado");
const sessoes = (() => { try { const x = JSON.parse(localStorage.getItem("arasakaSessoes") || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } })();
const sessaoAtiva = sessoes.find((item) => item.id === sessao?.id && item.estado === "ativa");
if (!sessao || !sessao.usuario || !nomeSessao || !sessaoAtiva) {
  window.location.replace("index.html");
}
const usuarioAtual = String(sessao?.usuario || "");
const chavePerfil = "arasakaPerfil_" + usuarioAtual.toLowerCase();
const padrao = { nome: sessao?.nome || nomeSessao || usuarioAtual, titulo: "", bio: "", local: "", site: "", github: "", rede: "", status: "Disponível", pronomes: "", cor: "#ed101b", foto: "", banner: "" };
let perfil = { ...padrao };
try { perfil = { ...padrao, ...JSON.parse(localStorage.getItem(chavePerfil) || "{}") }; } catch {}
const campos = {
  nome: $("#nomePerfil"), titulo: $("#tituloPerfil"), bio: $("#bioPerfil"), local: $("#localPerfil"),
  site: $("#sitePerfil"), github: $("#githubPerfil"), rede: $("#redePerfil"), status: $("#statusPerfil"),
  pronomes: $("#pronomePerfil"), cor: $("#corPerfil")
};
function mostrarMensagem(texto, tipo = "") { mensagem.textContent = texto; mensagem.dataset.type = tipo; }
function textoSeguro(valor) { return String(valor || "").trim(); }
function linkValido(valor) {
  const texto = textoSeguro(valor);
  if (!texto) return "";
  try { const url = new URL(texto); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}
function lerFormulario() {
  return {
    nome: textoSeguro(campos.nome.value) || usuarioAtual,
    titulo: textoSeguro(campos.titulo.value), bio: textoSeguro(campos.bio.value),
    local: textoSeguro(campos.local.value), site: textoSeguro(campos.site.value),
    github: textoSeguro(campos.github.value), rede: textoSeguro(campos.rede.value),
    status: campos.status.value, pronomes: textoSeguro(campos.pronomes.value),
    cor: /^#[0-9a-f]{6}$/i.test(campos.cor.value) ? campos.cor.value : "#ed101b",
    foto: perfil.foto || "", banner: perfil.banner || ""
  };
}
function preencherFormulario() {
  campos.nome.value = perfil.nome || padrao.nome;
  campos.titulo.value = perfil.titulo || "";
  campos.bio.value = perfil.bio || "";
  campos.local.value = perfil.local || "";
  campos.site.value = perfil.site || "";
  campos.github.value = perfil.github || "";
  campos.rede.value = perfil.rede || "";
  campos.status.value = perfil.status || "Disponível";
  campos.pronomes.value = perfil.pronomes || "";
  campos.cor.value = perfil.cor || "#ed101b";
  $("#fotoPerfil").value = "";
  $("#bannerPerfil").value = "";
  atualizarPreview();
}
function atualizarPreview() {
  const p = lerFormulario();
  document.documentElement.style.setProperty("--profile-accent", p.cor);
  document.documentElement.style.setProperty("--red", p.cor);
  const seletorTema = document.querySelector("#themeColor");
  if (seletorTema) seletorTema.value = p.cor;
  $("#previewNome").textContent = p.nome;
  $("#previewHandle").textContent = "@" + usuarioAtual;
  $("#previewBio").textContent = p.bio || p.titulo || "Sua biografia aparece aqui.";
  $("#previewLocal").textContent = p.local || "Localização não informada";
  $("#previewSite").textContent = p.site ? "Portfólio configurado" : "Site não informado";
  $("#cardNome").textContent = p.nome;
  $("#cardTitulo").textContent = p.titulo || "Função não definida";
  $("#cardUsuario").textContent = "@" + usuarioAtual;
  $("#cardStatus").textContent = p.status;
  $("#cardPronomes").textContent = p.pronomes || "Não informado";
  const avatar = $("#previewAvatar");
  avatar.replaceChildren();
  if (p.foto) {
    const img = document.createElement("img"); img.src = p.foto; img.alt = "Foto de perfil"; avatar.append(img);
  } else { avatar.textContent = (p.nome.trim().charAt(0) || "U").toUpperCase(); }
  const topoAvatar = $("#avatarUsuario");
  topoAvatar.replaceChildren();
  if (p.foto) { const img = document.createElement("img"); img.src = p.foto; img.alt = ""; topoAvatar.append(img); }
  else topoAvatar.textContent = (p.nome.trim().charAt(0) || "U").toUpperCase();
  const banner = $("#previewBanner");
  banner.style.backgroundImage = p.banner ? "linear-gradient(90deg,rgba(5,5,7,.38),rgba(5,5,7,.12)),url('" + p.banner + "')" : "";
  banner.classList.toggle("has-banner", Boolean(p.banner));
  const link = $("#linkPortfolio");
  const site = linkValido(p.site);
  link.hidden = !site;
  if (site) link.href = site;
  const redes = $("#linksPerfil");
  redes.replaceChildren();
  [["GitHub", p.github], ["Outra rede", p.rede]].forEach(([rotulo, valor]) => {
    const destino = linkValido(valor);
    if (!destino) return;
    const a = document.createElement("a"); a.href = destino; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = rotulo + " ↗"; redes.append(a);
  });
  const itens = [
    ["Nome", Boolean(p.nome)], ["Foto de perfil", Boolean(p.foto)], ["Banner", Boolean(p.banner)],
    ["Biografia", Boolean(p.bio)], ["Título", Boolean(p.titulo)], ["Localização", Boolean(p.local)],
    ["Portfólio", Boolean(site)], ["GitHub", Boolean(linkValido(p.github))]
  ];
  const total = itens.filter((item) => item[1]).length;
  const porcentagem = Math.round(total / itens.length * 100);
  $("#completudeNumero").textContent = porcentagem + "% completo";
  $("#completudeBarra").style.width = porcentagem + "%";
  const lista = $("#checklistPerfil");
  lista.replaceChildren();
  itens.forEach(([nome, concluido]) => {
    const linha = document.createElement("div"); linha.className = "profile-check-item";
    const icone = document.createElement("span"); icone.textContent = concluido ? "✓" : "○"; icone.className = concluido ? "is-complete" : "";
    const label = document.createElement("span"); label.textContent = nome;
    linha.append(icone, label); lista.append(linha);
  });
  $("#contadorBio").textContent = p.bio.length;
}
Object.values(campos).forEach((campo) => campo.addEventListener("input", atualizarPreview));
function lerImagem(arquivo, tipo) {
  if (!arquivo) return;
  if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(arquivo.type)) {
    mostrarMensagem("Formato inválido. Use PNG, JPG, WEBP ou GIF.", "error"); return;
  }
  if (arquivo.size > 1024 * 1024) {
    mostrarMensagem("A imagem ultrapassa 1 MB. Escolha um arquivo menor.", "error"); return;
  }
  const leitor = new FileReader();
  leitor.onload = () => {
    if (tipo === "foto") perfil.foto = String(leitor.result);
    else perfil.banner = String(leitor.result);
    atualizarPreview();
    mostrarMensagem("Imagem carregada na prévia. Clique em Salvar perfil para guardar.", "success");
  };
  leitor.onerror = () => mostrarMensagem("Não foi possível ler essa imagem.", "error");
  leitor.readAsDataURL(arquivo);
}
$("#fotoPerfil").addEventListener("change", (e) => lerImagem(e.target.files[0], "foto"));
$("#bannerPerfil").addEventListener("change", (e) => lerImagem(e.target.files[0], "banner"));
$("#removerFoto").addEventListener("click", () => { perfil.foto = ""; $("#fotoPerfil").value = ""; atualizarPreview(); });
$("#removerBanner").addEventListener("click", () => { perfil.banner = ""; $("#bannerPerfil").value = ""; atualizarPreview(); });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const novo = lerFormulario();
  if (novo.site && !linkValido(novo.site)) { mostrarMensagem("O link do portfólio precisa começar com http:// ou https://.", "error"); campos.site.focus(); return; }
  for (const campo of ["github", "rede"]) {
    if (novo[campo] && !linkValido(novo[campo])) { mostrarMensagem("Os links de redes precisam começar com http:// ou https://.", "error"); campos[campo].focus(); return; }
  }
  try {
    localStorage.setItem(chavePerfil, JSON.stringify(novo));
    localStorage.setItem("arasakaThemeColor", novo.cor);
    const usuarios = (() => { try { const x = JSON.parse(localStorage.getItem("usuarios") || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } })();
    localStorage.setItem("usuarios", JSON.stringify(usuarios.map((u) => u.usuario === usuarioAtual ? { ...u, nome: novo.nome } : u)));
    sessao.nome = novo.nome;
    localStorage.setItem("arasakaSessaoAtual", JSON.stringify(sessao));
    localStorage.setItem("usuarioLogado", novo.nome);
    localStorage.setItem("arasakaSessoes", JSON.stringify(sessoes.map((s) => s.id === sessao.id ? { ...s, nome: novo.nome } : s)));
    const logs = (() => { try { const x = JSON.parse(localStorage.getItem("arasakaAuditoria") || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } })();
    logs.unshift({ id: Date.now(), tipo: "PERFIL_ATUALIZADO", usuario: usuarioAtual, detalhes: "Perfil pessoal atualizado localmente", data: new Date().toISOString() });
    localStorage.setItem("arasakaAuditoria", JSON.stringify(logs.slice(0, 250)));
    perfil = novo;
    atualizarPreview();
    mostrarMensagem("Perfil salvo neste navegador.", "success");
  } catch {
    mostrarMensagem("O navegador não conseguiu guardar os dados. Reduza o tamanho das imagens e tente novamente.", "error");
  }
});
$("#restaurarPerfil").addEventListener("click", () => {
  try { perfil = { ...padrao, ...JSON.parse(localStorage.getItem(chavePerfil) || "{}") }; } catch { perfil = { ...padrao }; }
  preencherFormulario(); mostrarMensagem("Alterações descartadas. Perfil restaurado para a última versão salva.");
});
$("#botaoSair").addEventListener("click", () => {
  const lista = (() => { try { const x = JSON.parse(localStorage.getItem("arasakaSessoes") || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } })();
  localStorage.setItem("arasakaSessoes", JSON.stringify(lista.map((s) => s.id === sessao?.id ? { ...s, estado: "encerrada", fim: new Date().toISOString() } : s)));
  localStorage.removeItem("usuarioLogado"); localStorage.removeItem("arasakaSessaoAtual");
  window.location.replace("index.html");
});
const linkGestao = $("#linkGestao");
if (linkGestao && sessao?.papel === "admin") linkGestao.hidden = false;
preencherFormulario();
