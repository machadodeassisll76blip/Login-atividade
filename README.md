# Arasaka Corporation | Internal Net

Projeto educacional de front-end inspirado numa intranet corporativa cyberpunk. Inclui autenticação demonstrativa, áreas internas, catálogo de produtos ficcionais, gestão local de perfis e auditoria de eventos.

## Recursos

- **Acesso corporativo:** cadastro, validação de formulário e entrada por usuário e senha.
- **Home:** divisões corporativas, comunicados, relógio, busca de módulos e terminal interativo.
- **Terminal:** comandos `help`, `status`, `users`, `whoami`, `divisions`, `arms`, `sessions`, `audit`, `date`, `open` e `clear`.
- **Dashboard:** diretório pesquisável, indicadores e eventos locais.
- **Arasaka Arms:** catálogo pesquisável, filtro por categoria e solicitações de informação.
- **Gestão interna:** registros locais de sessões, pesquisa de perfis, suspensão e remoção de contas, inventário da divisão Arasaka Arms e auditoria exportável em JSON.
- **Inventário:** adicionar e remover itens do catálogo ficcional.
- **Interface responsiva:** tema escuro, acentos vermelhos, tabelas com rolagem horizontal e layouts para celular.

## Tecnologias

- HTML5 e CSS3
- JavaScript puro
- `localStorage` para persistência local no navegador

## Executar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/machadodeassisll76blip/Login-atividade.git
   ```
2. Abra a pasta no VS Code.
3. Execute `index.html` com Live Server.

## Primeiro acesso

Crie uma conta pela opção **Criar cadastro**. O primeiro perfil de gestão é definido automaticamente neste navegador; os perfis seguintes são cadastrados como colaboradores. Não há credenciais universais publicadas no projeto.

## Organização do projeto

O repositório separa a estrutura das páginas HTML, os estilos em `css/style.css` e as interações em arquivos JavaScript dentro de `js/`. A área de gestão é restrita à sessão com permissão adequada e não publica credenciais de acesso.

## Limitações e segurança

Este projeto é um protótipo de front-end. Usuários, senhas, sessões, inventário e auditoria são armazenados no `localStorage` do navegador e podem ser visualizados ou alterados por quem controla esse navegador. A senha não é protegida por hash, e o controle de permissões não substitui autorização num servidor.

Os registros de sessão são históricos locais de demonstração, não sessões de servidor sincronizadas entre dispositivos. O catálogo Arasaka Arms, os comunicados e os indicadores corporativos são conteúdo ficcional. Não existe integração com sistemas, produtos ou infraestrutura reais da Arasaka.

Para uso real, a próxima etapa seria implementar uma API/backend, banco de dados, hash de senhas, autorização no servidor, sessões seguras e logs centralizados.

## Objetivo de aprendizagem

Praticar formulários, validação, eventos, manipulação do DOM, filtros, persistência local, autorização de interface, gestão de registros e navegação entre páginas.
