# Arasaka | Sistema de login

Projeto de estudo de desenvolvimento web com identidade visual cyberpunk inspirada na Arasaka. A página principal agora é o **login**; após a autenticação de demonstração, o usuário é encaminhado ao painel.

## Funcionalidades

- Login pela página principal (`index.html`).
- Cadastro de usuário com validação de campos, confirmação de senha e verificação de usuário duplicado.
- Painel separado (`painel.html`) com saudação personalizada.
- Botão para sair e retornar ao login.
- Layout responsivo com tema escuro, detalhes vermelhos e arte vetorial.
- CSS e JavaScript separados dos arquivos HTML para facilitar a manutenção.

## Tecnologias

- **HTML5**: estrutura e formulários.
- **CSS3**: identidade visual, responsividade, foco visível e estados de formulário.
- **JavaScript**: validação e navegação entre as páginas.
- **localStorage**: armazenamento local dos cadastros para fins de demonstração.

## Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/machadodeassisll76blip/Login-atividade.git
   ```
2. Entre na pasta:
   ```bash
   cd Login-atividade
   ```
3. Abra a pasta no VS Code e execute `index.html` com uma extensão como Live Server, ou abra o arquivo diretamente no navegador.

A estrutura esperada é:

```text
Login-atividade/
├── index.html
├── login.html
├── cadastro.html
├── painel.html
├── css/
│   └── style.css
├── js/
│   ├── login.js
│   ├── cadastro.js
│   └── painel.js
└── img/
    └── arasaka.svg
```

## Conta de demonstração

- **Usuário:** `admin`
- **Senha:** `1234`

Você também pode criar uma conta na página de cadastro.

## Observação importante sobre segurança

Este é um exercício front-end, não um sistema de autenticação pronto para produção. Os dados são guardados no `localStorage`, e as senhas de demonstração ficam armazenadas sem proteção criptográfica. A verificação feita no navegador pode ser contornada; não use dados reais ou senhas pessoais. Um sistema real precisa de backend, armazenamento seguro de senhas com hash e controle de sessão no servidor.

## Objetivo de aprendizagem

Praticar HTML, CSS e JavaScript, separação de responsabilidades, validação de formulários, armazenamento local e navegação entre páginas.
