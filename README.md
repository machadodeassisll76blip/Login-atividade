# Arasaka Corporation | Internal Net

Projeto de estudo de front-end inspirado na estética corporativa cyberpunk da Arasaka, com tela de login, Home temática, dashboard interativo e cadastro local.

## O que o site oferece

- **Login como página inicial**, com conta de demonstração.
- **Home corporativa temática:** divisões, comunicados internos, atalhos, relógio em tempo real e busca de módulos.
- **Terminal simulado:** comandos `help`, `status`, `users`, `whoami`, `divisions`, `date` e `clear`. O terminal não executa comandos reais no computador.
- **Dashboard:** indicadores locais, relógio, monitoramento visual demonstrativo, registro de eventos e diretório pesquisável de usuários.
- **Cadastro:** validação de campos e confirmação de senha.
- **Interface responsiva:** navegação lateral, cartões, detalhes vermelhos, fundo escuro e animações discretas.
- **Sessão de demonstração:** navegação para Home após o login e botão de saída.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (sem frameworks)
- `localStorage` para guardar cadastros e sessão no navegador

## Executar

1. Clone o projeto:
   ```bash
   git clone https://github.com/machadodeassisll76blip/Login-atividade.git
   ```
2. Abra a pasta no VS Code.
3. Execute `index.html` com Live Server ou abra-o diretamente no navegador.

## Conta de demonstração

- Usuário: `admin`
- Senha: `1234`

Também é possível cadastrar um usuário na página **Novo usuário**.

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

## Importante sobre segurança

Este é um protótipo de front-end, não um sistema de autenticação para produção. Os cadastros são guardados no `localStorage` e as senhas não são protegidas por hash. A sessão pode ser manipulada pelo próprio navegador. Não use credenciais ou informações reais. Um sistema real precisa de backend, hash seguro de senhas e gerenciamento de sessão no servidor.

Os medidores de infraestrutura, comunicados e eventos corporativos são elementos ficcionais da interface; não representam telemetria ou notícias reais da Arasaka.

## Objetivo de aprendizagem

Praticar HTML semântico, CSS responsivo, manipulação do DOM, eventos, filtragem de conteúdo, formulários, armazenamento local e navegação entre páginas.
