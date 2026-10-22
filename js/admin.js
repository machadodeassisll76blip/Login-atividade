function ler(chave, padrao = []) {
  try { const valor = JSON.parse(localStorage.getItem(chave) || JSON.stringify(padrao)); return Array.isArray(padrao) ? (Array.isArray(valor) ? valor : padrao) : valor; }
  catch { return padrao; }
}
function gravar(chave, valor) { localStorage.setItem(chave, JSON.stringify(valor)); }
function escapar(texto) { return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }
function dataLocal(valor) { const data = new Date(valor); return Number.isNaN(data.getTime()) ? "—" : data.toLocaleString("pt-BR"); }
function auditar(tipo, detalhes = "") {
  const logs = ler("arasakaAuditoria");
  logs.unshift({ id: Date.now() + Math.random(), tipo, usuario: sessao.usuario, detalhes, data: new Date().toISOString() });
  gravar("arasakaAuditoria", logs.slice(0, 250));
}
let sessao = null;
try { sessao = JSON.parse(localStorage.getItem("arasakaSessaoAtual") || "null"); } catch {}
const sessaoRegistrada = (() => { try { return JSON.parse(localStorage.getItem("arasakaSessoes") || "[]").find((s) => s.id === sessao?.id); } catch { return null; } })();
if (!sessao || sessao.papel !== "admin" || !localStorage.getItem("usuarioLogado") || !sessaoRegistrada || sessaoRegistrada.estado !== "ativa") {
  window.location.replace("index.html");
} else {
  iniciarPainel();
}
function iniciarPainel() {
  document.querySelector("#nomeUsuario").textContent = sessao.nome || sessao.usuario;
  document.querySelector("#avatarUsuario").textContent = (sessao.nome || sessao.usuario || "U").trim().charAt(0).toUpperCase();
  document.querySelector("#operadorAtual").textContent = sessao.nome || sessao.usuario;
  document.querySelector("#dataAtual").textContent = new Date().toLocaleDateString("pt-BR");
  document.querySelector("#idSessao").textContent = String(sessao.id).slice(-8);
  const inventarioInicial = [
    { id:"ARS-001", nome:"Kestrel Smart Platform", classe:"Plataforma inteligente", departamento:"Pesquisa & Desenvolvimento", estado:"Em avaliação", criadoEm:new Date().toISOString() },
    { id:"ARS-002", nome:"Aegis Personal Shield", classe:"Equipamento de proteção", departamento:"Segurança Corporativa", estado:"Aprovado para catálogo", criadoEm:new Date().toISOString() },
    { id:"ARS-003", nome:"Mantis Robotics Unit", classe:"Robótica de defesa", departamento:"Robótica", estado:"Em desenvolvimento", criadoEm:new Date().toISOString() },
    { id:"ARS-004", nome:"Sentinel Compliance Suite", classe:"Sistema não letal", departamento:"Conformidade", estado:"Em avaliação", criadoEm:new Date().toISOString() }
  ];
  if (!localStorage.getItem("arasakaInventario")) gravar("arasakaInventario", inventarioInicial);
  renderizarTudo();
  document.querySelector("#filtroPerfis").addEventListener("input", renderizarPerfis);
  document.querySelector("#filtroInventario").addEventListener("input", renderizarInventario);
  document.querySelector("#filtroAuditoria").addEventListener("input", renderizarAuditoria);
  document.querySelector("#formArma").addEventListener("submit", adicionarItem);
  document.querySelector("#encerrarOutras").addEventListener("click", encerrarOutrasSessoes);
  document.querySelector("#limparAuditoria").addEventListener("click", limparAuditoria);
  document.querySelector("#exportarAuditoria").addEventListener("click", exportarAuditoria);
  document.querySelector("#atualizarRelatorios").addEventListener("click", atualizarRelatorios);
  document.querySelector("#exportarRelatorio").addEventListener("click", exportarRelatorio);
  document.querySelector("#formTerminalAdmin").addEventListener("submit", executarTerminal);
  document.querySelector("#criarBackup").addEventListener("click", criarBackup);
  document.querySelector("#exportarUsuarios").addEventListener("click", exportarUsuariosCSV);
  document.querySelector("#botaoSair").addEventListener("click", sair);
}
function renderizarTudo() {
  document.querySelector("#totalPerfis").textContent = ler("usuarios").length;
  document.querySelector("#totalSessoes").textContent = ler("arasakaSessoes").length;
  document.querySelector("#totalEventos").textContent = ler("arasakaAuditoria").length;
  renderizarSessoes(); renderizarPerfis(); renderizarInventario(); renderizarSolicitacoes(); renderizarAuditoria(); atualizarRelatorios();
}
function celula(texto) { return `<td>${escapar(texto)}</td>`; }
function renderizarSessoes() {
  const corpo = document.querySelector("#tabelaSessoes");
  const sessoes = ler("arasakaSessoes");
  corpo.innerHTML = sessoes.length ? sessoes.map((s) => `<tr>
    ${celula(s.nome || s.usuario)}${celula(dataLocal(s.inicio))}
    ${celula(s.estado === "ativa" ? "Ativa (local)" : "Encerrada")}
    ${celula(String(s.id || "").slice(-8))}
    <td>${s.estado === "ativa" && s.id !== sessao.id ? `<button class="table-button" data-encerrar-sessao="${escapar(s.id)}">Encerrar</button>` : "—"}</td>
  </tr>`).join("") : '<tr><td colspan="5" class="empty-cell">Nenhuma sessão registrada ainda.</td></tr>';
  corpo.querySelectorAll("[data-encerrar-sessao]").forEach((botao) => botao.addEventListener("click", () => {
    const lista = ler("arasakaSessoes").map((s) => String(s.id) === botao.dataset.encerrarSessao ? { ...s, estado:"encerrada", fim:new Date().toISOString() } : s);
    gravar("arasakaSessoes", lista); auditar("SESSAO_ENCERRADA", "Sessão local encerrada pela diretoria."); renderizarTudo();
  }));
}
function renderizarPerfis() {
  const corpo = document.querySelector("#tabelaPerfis");
  const termo = document.querySelector("#filtroPerfis").value.trim().toLowerCase();
  const perfis = ler("usuarios").filter((u) => [u.nome,u.usuario,u.email].some((v) => String(v || "").toLowerCase().includes(termo)));
  corpo.innerHTML = perfis.length ? perfis.map((u) => `<tr>
    ${celula(u.nome)}${celula(u.usuario)}${celula(u.email)}
    ${celula("Colaborador")}
    ${celula(u.ativo === false ? "Suspenso" : "Ativo")}
    <td class="inline-actions">
      ${u.usuario === sessao.usuario ? '<span class="muted-cell">Sessão atual</span>' : `<button class="table-button" data-toggle-user="${escapar(u.usuario)}">${u.ativo === false ? "Reativar" : "Suspender"}</button> <button class="table-button danger-button" data-delete-user="${escapar(u.usuario)}">Remover</button>`}
    </td>
  </tr>`).join("") : '<tr><td colspan="6" class="empty-cell">Nenhum perfil corresponde à pesquisa.</td></tr>';
  corpo.querySelectorAll("[data-toggle-user]").forEach((b) => b.addEventListener("click", () => {
    const lista = ler("usuarios").map((u) => u.usuario === b.dataset.toggleUser ? { ...u, ativo:u.ativo === false } : u);
    gravar("usuarios", lista); auditar("ESTADO_PERFIL_ALTERADO", `Estado atualizado para ${b.dataset.toggleUser}`); renderizarTudo();
  }));
  corpo.querySelectorAll("[data-role-user]").forEach((select) => select.addEventListener("change", () => {
    const alvo=select.dataset.roleUser, novoPapel=select.value, usuarios=ler("usuarios"); const atual=usuarios.find((u)=>u.usuario===alvo);
    if(!atual || alvo===sessao.usuario){alert("Não é permitido alterar sua própria permissão.");renderizarPerfis();return;}
    if(atual.papel==="admin" && novoPapel!=="admin" && usuarios.filter((u)=>u.papel==="admin"&&u.ativo!==false).length<=1){alert("Mantenha pelo menos um administrador ativo.");renderizarPerfis();return;}
    gravar("usuarios",usuarios.map((u)=>u.usuario===alvo?{...u,papel:novoPapel}:u));auditar("PERMISSAO_ALTERADA","Permissão de "+alvo+" alterada para "+novoPapel);renderizarTudo();
  }));
  corpo.querySelectorAll("[data-delete-user]").forEach((b) => b.addEventListener("click", () => {
    const alvo = b.dataset.deleteUser;
    if (!confirm(`Remover o perfil local "${alvo}"? Esta ação não pode ser desfeita.`)) return;
    const listaUsuarios=ler("usuarios"), usuarioAlvo=listaUsuarios.find((u)=>u.usuario===alvo);
    if(usuarioAlvo?.papel==="admin" && listaUsuarios.filter((u)=>u.papel==="admin"&&u.ativo!==false).length<=1){alert("Não é possível remover o último administrador ativo.");return;}
    gravar("usuarios", listaUsuarios.filter((u) => u.usuario !== alvo));
    gravar("arasakaSessoes", ler("arasakaSessoes").map((s) => s.usuario === alvo && s.estado === "ativa" ? { ...s, estado:"encerrada", fim:new Date().toISOString() } : s));
    auditar("PERFIL_REMOVIDO", `Perfil removido: ${alvo}`); renderizarTudo();
  }));
}
function renderizarInventario() {
  const corpo = document.querySelector("#tabelaInventario");
  const termo = document.querySelector("#filtroInventario").value.trim().toLowerCase();
  const itens = ler("arasakaInventario").filter((i) => [i.id,i.nome,i.classe,i.departamento,i.estado].some((v) => String(v || "").toLowerCase().includes(termo)));
  corpo.innerHTML = itens.length ? itens.map((i) => `<tr>${celula(i.id)}${celula(i.nome)}${celula(i.classe)}${celula(i.departamento)}${celula(i.estado)}<td><button class="table-button danger-button" data-delete-item="${escapar(i.id)}">Remover</button></td></tr>`).join("") : '<tr><td colspan="6" class="empty-cell">Nenhum item encontrado.</td></tr>';
  corpo.querySelectorAll("[data-delete-item]").forEach((b) => b.addEventListener("click", () => {
    const itensAtuais = ler("arasakaInventario");
    const alvo = itensAtuais.find((i) => i.id === b.dataset.deleteItem);
    if (!alvo || !confirm(`Remover "${alvo.nome}" do catálogo local?`)) return;
    gravar("arasakaInventario", itensAtuais.filter((i) => i.id !== alvo.id));
    auditar("ITEM_INVENTARIO_REMOVIDO", `Item removido: ${alvo.id} / ${alvo.nome}`);
    renderizarTudo();
  }));
}
function adicionarItem(event) {
  event.preventDefault();
  const nome = document.querySelector("#nomeItem").value.trim();
  if (!nome) return;
  const itens = ler("arasakaInventario");
  const numero = Math.max(0, ...itens.map((i) => Number(String(i.id).replace("ARS-","")) || 0)) + 1;
  const item = { id:`ARS-${String(numero).padStart(3,"0")}`, nome, classe:document.querySelector("#classeItem").value, estado:document.querySelector("#estadoItem").value, departamento:document.querySelector("#departamentoItem").value, criadoEm:new Date().toISOString() };
  itens.unshift(item); gravar("arasakaInventario", itens);
  auditar("ITEM_INVENTARIO_CRIADO", `Novo registro: ${item.id} / ${item.nome}`);
  document.querySelector("#formArma").reset();
  const msg = document.querySelector("#mensagemInventario"); msg.textContent = "Item adicionado ao catálogo deste navegador."; msg.dataset.type = "success";
  renderizarTudo();
}
function renderizarSolicitacoes() {
  const corpo = document.querySelector("#tabelaSolicitacoes");
  const pedidos = ler("arasakaSolicitacoes");
  corpo.innerHTML = pedidos.length ? pedidos.map((p) => `<tr>${celula(dataLocal(p.data))}${celula(p.usuario)}${celula(p.item)}${celula(p.estado || "Registrada localmente")}<td>${p.estado === "Concluída" ? "—" : `<button class="table-button" data-resolver-solicitacao="${escapar(p.id)}">Marcar concluída</button>`}</td></tr>`).join("") : '<tr><td colspan="5" class="empty-cell">Nenhuma solicitação recebida neste navegador.</td></tr>';
  corpo.querySelectorAll("[data-resolver-solicitacao]").forEach((b) => b.addEventListener("click", () => {
    const atualizados = ler("arasakaSolicitacoes").map((p) => String(p.id) === b.dataset.resolverSolicitacao ? { ...p, estado:"Concluída", concluidaEm:new Date().toISOString() } : p);
    gravar("arasakaSolicitacoes", atualizados);
    auditar("SOLICITACAO_CONCLUIDA", "Solicitação comercial atualizada.");
    renderizarTudo();
  }));
}
function renderizarAuditoria() {
  const corpo = document.querySelector("#tabelaAuditoria");
  const termo = document.querySelector("#filtroAuditoria").value.trim().toLowerCase();
  const logs = ler("arasakaAuditoria").filter((l) => [l.tipo,l.usuario,l.detalhes,l.data].some((v) => String(v || "").toLowerCase().includes(termo)));
  corpo.innerHTML = logs.length ? logs.map((l) => `<tr>${celula(dataLocal(l.data))}${celula(l.tipo)}${celula(l.usuario)}${celula(l.detalhes)}</tr>`).join("") : '<tr><td colspan="4" class="empty-cell">Nenhum evento corresponde à pesquisa.</td></tr>';
  document.querySelector("#totalEventos").textContent = ler("arasakaAuditoria").length;
}
function encerrarOutrasSessoes() {
  gravar("arasakaSessoes", ler("arasakaSessoes").map((s) => s.id !== sessao.id && s.estado === "ativa" ? { ...s, estado:"encerrada", fim:new Date().toISOString() } : s));
  auditar("SESSOES_ENCERRADAS", "Solicitada finalização das outras sessões locais.");
  renderizarTudo();
}
function limparAuditoria() {
  if (!confirm("Apagar o histórico de auditoria deste navegador?")) return;
  gravar("arasakaAuditoria", []);
  auditar("AUDITORIA_LIMPA", "Histórico anterior apagado pela diretoria.");
  renderizarTudo();
}
function exportarAuditoria() {
  const blob = new Blob([JSON.stringify(ler("arasakaAuditoria"), null, 2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = "arasaka-auditoria-local.json"; link.click();
  URL.revokeObjectURL(url);
  auditar("AUDITORIA_EXPORTADA", "Exportação JSON solicitada.");
  renderizarTudo();
}
function sair() {
  const lista = ler("arasakaSessoes").map((s) => s.id === sessao.id ? { ...s, estado:"encerrada", fim:new Date().toISOString() } : s);
  gravar("arasakaSessoes", lista);
  auditar("LOGOUT", "Sessão local encerrada.");
  localStorage.removeItem("usuarioLogado"); localStorage.removeItem("arasakaSessaoAtual");
  window.location.replace("index.html");
}
function baixarArquivo(nome, conteudo, tipo="application/json"){const blob=new Blob([conteudo],{type:tipo});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=nome;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function atualizarRelatorios(){const us=ler("usuarios"),p=ler("arasakaSolicitacoes"),i=ler("arasakaInventario");document.querySelector("#relContasAtivas").textContent=us.filter(u=>u.ativo!==false).length;document.querySelector("#relSolicitacoes").textContent=p.filter(x=>x.estado!=="Concluída").length;document.querySelector("#relInventario").textContent=i.length;}
function exportarRelatorio(){const rows=[["Indicador","Valor"],["Perfis cadastrados",ler("usuarios").length],["Contas ativas",ler("usuarios").filter(u=>u.ativo!==false).length],["Sessões registradas",ler("arasakaSessoes").length],["Eventos de auditoria",ler("arasakaAuditoria").length],["Solicitações pendentes",ler("arasakaSolicitacoes").filter(p=>p.estado!=="Concluída").length],["Itens no inventário",ler("arasakaInventario").length]];baixarArquivo("arasaka-relatorio.csv","\uFEFF"+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\n"),"text/csv;charset=utf-8");auditar("RELATORIO_EXPORTADO","Relatório executivo CSV exportado.");renderizarTudo();}
function criarBackup(){const usuarios=ler("usuarios").map(({senha,...u})=>u);const dados={produto:"Arasaka Corporation // protótipo local",geradoEm:new Date().toISOString(),aviso:"Senhas excluídas do backup.",dados:{usuarios,sessoes:ler("arasakaSessoes"),auditoria:ler("arasakaAuditoria"),inventario:ler("arasakaInventario"),solicitacoes:ler("arasakaSolicitacoes")}};baixarArquivo("arasaka-backup-seguro.json",JSON.stringify(dados,null,2));auditar("BACKUP_EXPORTADO","Backup JSON sem senhas exportado.");const m=document.querySelector("#mensagemBackup");m.textContent="Backup criado. Senhas não foram incluídas.";m.dataset.type="success";renderizarTudo();}
function exportarUsuariosCSV(){const us=ler("usuarios"),rows=[["Nome","Usuário","E-mail","Permissão","Estado","Criado em"],...us.map(u=>[u.nome,u.usuario,u.email,u.papel,u.ativo===false?"Suspenso":"Ativo",u.criadoEm])];baixarArquivo("arasaka-diretorio.csv","\uFEFF"+rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\n"),"text/csv;charset=utf-8");auditar("DIRETORIO_EXPORTADO","Diretório CSV exportado.");renderizarTudo();}
function executarTerminal(e){e.preventDefault();const input=document.querySelector("#comandoAdmin"),out=document.querySelector("#saidaTerminalAdmin"),cmd=input.value.trim(),parts=cmd.split(/\s+/),act=(parts.shift()||"").toLowerCase();input.value="";let r="";switch(act){case"help":r="help | stats | users | sessions | audit | backup | clear";break;case"stats":r="Perfis: "+ler("usuarios").length+"\nContas ativas: "+ler("usuarios").filter(u=>u.ativo!==false).length+"\nSessões: "+ler("arasakaSessoes").length+"\nEventos: "+ler("arasakaAuditoria").length+"\nInventário: "+ler("arasakaInventario").length+"\nSolicitações pendentes: "+ler("arasakaSolicitacoes").filter(p=>p.estado!=="Concluída").length;break;case"users":r=ler("usuarios").map(u=>u.usuario+" | "+(u.papel||"colaborador")+" | "+(u.ativo===false?"suspenso":"ativo")).join("\n")||"Nenhum usuário.";break;case"sessions":r=ler("arasakaSessoes").slice(0,15).map(s=>s.usuario+" | "+s.estado+" | "+dataLocal(s.inicio)).join("\n")||"Nenhuma sessão.";break;case"audit":r=ler("arasakaAuditoria").slice(0,15).map(l=>dataLocal(l.data)+" | "+l.tipo+" | "+l.usuario).join("\n")||"Nenhum evento.";break;case"backup":criarBackup();r="Backup JSON solicitado.";break;case"clear":out.textContent="Terminal limpo.";return;case"":r="Digite help para consultar os comandos.";break;default:r="Comando desconhecido. Digite help.";}out.textContent+="\n\nadmin> "+cmd+"\n"+r;out.scrollTop=out.scrollHeight;auditar("COMANDO_ADMIN","Comando local executado: "+act);}