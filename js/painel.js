const nomeLogado = localStorage.getItem("usuarioLogado");

if (!nomeLogado) {
  window.location.replace("index.html");
} else {
  document.querySelector("#boasVindas").textContent = `Bem-vindo, ${nomeLogado}!`;
}

document.querySelector("#botaoSair").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.replace("index.html");
});