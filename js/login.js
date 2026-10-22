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
  } catch {
    return [];
  }
}

formLogin.addEventListener("submit", (event) => {
  event.preventDefault();
  const usuario = document.querySelector("#usuario").value.trim();
  const senha = document.querySelector("#senha").value;
  const usuarios = lerUsuarios();

  // Conta de demonstração para testar a atividade localmente.
  let encontrado = usuario.toLowerCase() === "admin" && senha === "1234"
    ? { nome: "Administrador", usuario: "admin" }
    : usuarios.find((item) =>
        String(item.usuario).toLowerCase() === usuario.toLowerCase() &&
        item.senha === senha
      );

  if (!encontrado) {
    mostrarMensagem("Usuário ou senha incorretos.", "error");
    return;
  }

  localStorage.setItem("usuarioLogado", encontrado.nome || encontrado.usuario);
  mostrarMensagem("Login realizado. Abrindo o painel...", "success");
  window.location.href = "home.html";
});