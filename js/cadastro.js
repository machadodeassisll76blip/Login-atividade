const formCadastro = document.querySelector("#formCadastro");
const mensagemCadastro = document.querySelector("#mensagem");

function mostrarMensagem(texto, tipo = "") {
  mensagemCadastro.textContent = texto;
  mensagemCadastro.dataset.type = tipo;
}

function lerUsuarios() {
  try {
    const dados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

formCadastro.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = document.querySelector("#nome");
  const email = document.querySelector("#email");
  const usuario = document.querySelector("#usuario");
  const senha = document.querySelector("#senha");
  const confirmarSenha = document.querySelector("#confirmarSenha");
  const campos = [nome, email, usuario, senha, confirmarSenha];

  campos.forEach((campo) => {
    campo.removeAttribute("aria-invalid");
  });

  const falhar = (campo, texto) => {
    campo.setAttribute("aria-invalid", "true");
    campo.focus();
    mostrarMensagem(texto, "error");
  };

  if (nome.value.trim().length < 3) return falhar(nome, "Informe um nome com pelo menos 3 caracteres.");
  if (!email.validity.valid) return falhar(email, "Digite um endereço de e-mail válido.");
  if (!/^[^\s]+$/.test(usuario.value.trim())) return falhar(usuario, "O usuário não pode conter espaços.");
  if (senha.value.length < 6) return falhar(senha, "A senha precisa ter pelo menos 6 caracteres.");
  if (senha.value !== confirmarSenha.value) return falhar(confirmarSenha, "As senhas não coincidem.");

  const usuarios = lerUsuarios();
  const usuarioNormalizado = usuario.value.trim().toLowerCase();
  if (usuarios.some((item) => String(item.usuario).toLowerCase() === usuarioNormalizado)) {
    return falhar(usuario, "Esse nome de usuário já está cadastrado.");
  }

  usuarios.push({
    nome: nome.value.trim(),
    email: email.value.trim(),
    usuario: usuario.value.trim(),
    senha: senha.value
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  formCadastro.reset();
  mostrarMensagem("Cadastro salvo neste navegador. Redirecionando para o login...", "success");
  window.setTimeout(() => { window.location.href = "index.html"; }, 1100);
});