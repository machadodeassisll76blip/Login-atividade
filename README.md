# Arasaka | Sistema de acesso e dashboard

Projeto educacional de front-end com estética cyberpunk inspirada na Arasaka. O site começa na tela de login e, após a entrada, abre uma Home com navegação para o Dashboard.

## Funcionalidades

- Login como página principal (`index.html`).
- Cadastro de usuário com validação e confirmação de senha.
- Home com boas-vindas, atalhos, indicadores locais e atividade recente.
- Dashboard com indicadores de demonstração e informações sobre o ambiente.
- Navegação lateral adaptável a telas menores.
- Botão para encerrar a sessão de demonstração.
- CSS e JavaScript separados dos arquivos HTML.
- Arte vetorial da Arasaka como parte da identidade visual.

## Tecnologias

- **HTML5** para a estrutura das páginas.
- **CSS3** para tema, layout responsivo, cartões e estados de foco.
- **JavaScript** para validação, navegação e atualização de indicadores.
- **localStorage** para manter os cadastros e a sessão de demonstração no navegador.

## Executar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/machadodeassisll76blip/Login-atividade.git
   ```
2. Abra a pasta no VS Code.
3. Execute `index.html` com Live Server ou abra o arquivo diretamente no navegador.

## Estrutura

```text
Login-atividade/
├── index.html
├── login.html
├── home.html
├── dashboard.html
├── painel.html
├── cadastro.html
├── css/
│   └── style.css
├── js/
│   ├── login.js
│   ├── cadastro.js
│   ├── home.js
│   ├── dashboard.js
│   └── painel.js
└── img/
    ├── arasaka.svg
    └── back.jfif
```

## Conta de demonstração

- Usuário: `admin`
- Senha: `1234`

Também é possível criar uma conta pela página de cadastro.

## Segurança

Este projeto é somente uma demonstração front-end. As senhas e os cadastros ficam no `localStorage`, sem hash e sem validação de um servidor. A lógica de sessão pode ser contornada pelo navegador. Não utilize senhas reais ou dados pessoais. Um sistema real precisa de backend, hash seguro de senhas e gerenciamento de sessão no servidor.

## Objetivo

Praticar formulários, validação, navegação entre páginas, CSS responsivo, manipulação do DOM e armazenamento local.
