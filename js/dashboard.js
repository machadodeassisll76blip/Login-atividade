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
  document.querySelector("#totalUsuarios").textContent = lerUsuarios().length;
}
document.querySelector("#botaoSair").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.replace("index.html");
});