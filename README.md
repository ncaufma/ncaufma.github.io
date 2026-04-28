# NCA-UFMA Website

Site institucional do **Núcleo de Computação Aplicada** da Universidade Federal do Maranhão, construído com [Astro](https://astro.build) — 100% estático, sem banco de dados, sem CMS externo. Todo o conteúdo editável fica em arquivos Markdown na pasta `content/`.

---

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação e desenvolvimento local](#instalação-e-desenvolvimento-local)
3. [Estrutura do projeto](#estrutura-do-projeto)
4. [Editando conteúdo](#editando-conteúdo)
5. [Informações obrigatórias pendentes](#informações-obrigatórias-pendentes)
6. [Importar publicações do Google Scholar](#importar-publicações-do-google-scholar)
7. [Feed de redes sociais](#feed-de-redes-sociais)
8. [Deploy no GitHub Pages](#deploy-no-github-pages)
9. [Variáveis de ambiente](#variáveis-de-ambiente)
10. [Perguntas frequentes](#perguntas-frequentes)

---

## Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior
- npm 9+
- Git

---

## Instalação e desenvolvimento local

```bash
# Clone o repositório
git clone https://github.com/ncaufma/ncaufma.github.io.git
cd ncaufma.github.io

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento (http://localhost:4321)
npm run dev

# Build de produção
npm run build

# Pré-visualizar o build localmente
npm run preview
```

---

## Estrutura do projeto

```
nca-website/
├── src/content/                ← TODO o conteúdo editável fica aqui
│   ├── settings/site.yaml     ← Configurações globais do site (também editável em content/settings/)
│   ├── pages/                 ← Páginas estáticas (about, etc.)
│   ├── team/                  ← Um arquivo .md por pesquisador
│   ├── research-areas/        ← Uma área de pesquisa por arquivo
│   ├── projects/              ← Um projeto por arquivo
│   ├── publications/          ← Uma publicação por arquivo (gerado automaticamente)
│   ├── news/                  ← Notícias e posts
│   └── collaborations/        ← Parceiros e colaboradores
├── public/
│   └── assets/
│       ├── logo/              ← Logo NCA em SVG e PNG
│       ├── team/              ← Fotos dos pesquisadores
│       └── collaborations/    ← Logos dos parceiros
├── src/
│   ├── components/            ← Componentes Astro reutilizáveis
│   ├── layouts/               ← Layouts de página
│   ├── pages/                 ← Rotas do site (mapeadas automaticamente)
│   └── styles/global.css      ← Design system / CSS global
├── scripts/
│   ├── fetch-scholar.mjs      ← Importa publicações do Google Scholar
│   └── fetch-instagram.mjs    ← Importa posts do Instagram
├── .github/workflows/
│   └── deploy.yml             ← Deploy automático no GitHub Pages
├── astro.config.mjs
├── .env.example
└── README.md
```

---

## Editando conteúdo

**Regra fundamental:** nunca edite arquivos em `src/`. Todo texto que o administrador precisa atualizar fica em `content/`.

### Configurações globais

Edite `content/settings/site.yaml` para alterar:
- Nome e tagline do site
- URL do Google Scholar do grupo
- ID do Formspree (formulário de contato)
- Handles de Instagram e LinkedIn
- Endereço do laboratório
- URL do Google Maps embed

### Pesquisadores

Cada arquivo em `content/team/` representa um pesquisador. Edite os campos `bio`, `photo`, `orcid`, `googleScholar`, etc. A foto deve ser colocada em `public/assets/team/` com o mesmo nome do campo `photo`.

Campos com `[REQUIRED: ...]` são obrigatórios e devem ser preenchidos antes do primeiro deploy público.

### Projetos

Cada arquivo em `content/projects/` representa um projeto. Para adicionar um novo projeto:

```bash
# Crie um novo arquivo (substitua meu-projeto pelo slug desejado)
cp content/projects/ergotech-sesi.md content/projects/meu-projeto.md
# Edite o novo arquivo
```

### Publicações

Publicações podem ser:
1. **Importadas automaticamente** do Google Scholar via `npm run update:scholar`
2. **Adicionadas manualmente** criando arquivos em `content/publications/`

### Notícias

Adicione arquivos `.md` em `content/news/` com a data no nome do arquivo (ex: `2025-03-evento-x.md`). Exemplo de frontmatter:

```yaml
---
title: "Título da notícia"
date: "2025-03-15"
description: "Resumo em até 200 caracteres."
cover: ""           # opcional: URL ou caminho para imagem de capa
source: "blog"      # blog | instagram | linkedin | press
tags:
  - eventos
featured: false
---

Conteúdo completo em Markdown...
```

### Parceiros

Adicione logos em `public/assets/collaborations/` e crie/edite o arquivo correspondente em `content/collaborations/`.

---

## Informações obrigatórias pendentes

Os campos a seguir contêm placeholders `[REQUIRED: ...]` e precisam ser preenchidos antes do deploy público. Você pode encontrá-los com:

```bash
grep -r "\[REQUIRED" content/ --include="*.md" --include="*.yaml" -l
```

### `content/settings/site.yaml`
- `logoFile` — nome do arquivo do logo
- `googleScholarGroupUrl` — URL do perfil Google Scholar do grupo
- `formspreeEndpoint` — ID do Formspree para o formulário de contato
- `instagramHandle` — @ do Instagram sem o @
- `linkedinPageUrl` — URL da página no LinkedIn
- `address` — endereço completo do laboratório
- `googleMapsEmbed` — URL do iframe do Google Maps

### `content/pages/about.md`
- Texto completo da história e missão do grupo
- Descrição da infraestrutura

### `content/team/*.md` (todos os 12 arquivos)
- `bio` — biografia curta (2-3 parágrafos)
- `photo` — nome do arquivo de foto (colocar em `public/assets/team/`)
- `orcid` — identificador ORCID
- `googleScholar` — URL do perfil Google Scholar
- `researchgate` — URL do perfil ResearchGate
- `linkedin` — URL do perfil LinkedIn
- `instagram` — handle do Instagram (opcional)

### `content/projects/*.md` (todos os arquivos)
- `members` — slugs dos pesquisadores envolvidos (ex: `["anselmo-paiva", "aristofanes-silva"]`)
- `funding` — agência e número do contrato/edital
- `startDate` e `endDate` — datas de início e fim

### `content/collaborations/*.md` (todos os arquivos)
- `logo` — nome do arquivo de logo (colocar em `public/assets/collaborations/`)
- `url` — URL oficial do parceiro

### Arquivos de mídia
- `public/assets/team/` — fotos dos 12 pesquisadores (JPEG/WebP, mínimo 400×400px)
- `public/assets/collaborations/` — logos dos parceiros (SVG preferido, PNG aceito)
- `public/assets/logo/` — logo NCA em SVG e PNG de alta resolução
- `public/favicon.svg` e `public/favicon.png` — favicon do site

---

## Importar publicações do Google Scholar

```bash
# Configure o URL do Scholar (uma vez)
export SCHOLAR_URL="https://scholar.google.com/citations?user=XXXXX&sortby=pubdate"

# Importe as publicações
npm run update:scholar
```

Ou configure permanentemente em `content/settings/site.yaml`:
```yaml
googleScholarGroupUrl: "https://scholar.google.com/citations?user=XXXXX&sortby=pubdate"
```

O script cria um arquivo `.md` para cada publicação nova em `content/publications/`. Arquivos já existentes não são sobrescritos — você pode editar os campos manualmente após a importação.

O script também roda automaticamente no pipeline de deploy do GitHub Actions quando `SCHOLAR_URL` está configurado como segredo do repositório.

---

## Feed de redes sociais

### Instagram

1. Crie um app no [Facebook for Developers](https://developers.facebook.com)
2. Adicione o produto **Instagram Basic Display**
3. Gere um token de longa duração para a conta do NCA
4. Configure o segredo `INSTAGRAM_TOKEN` no GitHub (Settings > Secrets > Actions)

Tokens expiram em 60 dias. O script `fetch-instagram.mjs` auto-renova o token a cada execução.

**Alternativa sem token:** poste notícias manualmente em `content/news/` com `source: "instagram"`.

### LinkedIn

A API do LinkedIn para posts orgânicos requer aprovação. Recomendamos a abordagem manual: crie arquivos em `content/news/` com `source: "linkedin"` e `externalUrl` apontando para o post.

---

## Deploy no GitHub Pages

### Configuração inicial (uma vez)

1. No repositório GitHub: **Settings > Pages > Source**: selecione **GitHub Actions**
2. Crie os seguintes segredos em **Settings > Secrets > Actions**:
   - `SCHOLAR_URL` (opcional) — URL do Google Scholar
   - `INSTAGRAM_TOKEN` (opcional) — token da API Instagram

### Deploy automático

Qualquer push para a branch `main` dispara o workflow `.github/workflows/deploy.yml`, que:
1. Instala as dependências
2. Roda `update:scholar` (se `SCHOLAR_URL` estiver configurado)
3. Roda `fetch-instagram.mjs` (se `INSTAGRAM_TOKEN` estiver configurado)
4. Faz o build com Astro
5. Publica em GitHub Pages

### Deploy manual

```bash
npm run build
# O output estará em dist/ — faça upload manual se necessário
```

---

## Variáveis de ambiente

Veja `.env.example` para a lista completa. Para desenvolvimento local, copie para `.env`:

```bash
cp .env.example .env
# Edite .env com seus valores
```

| Variável | Onde configurar | Obrigatória |
|---|---|---|
| `SCHOLAR_URL` | `.env` / GitHub Secret | Não (mas recomendada) |
| `INSTAGRAM_TOKEN` | `.env` / GitHub Secret | Não |
| `LINKEDIN_TOKEN` | `.env` / GitHub Secret | Não |
| `SITE` | `.env` / GitHub Actions env | Não (padrão: astro.config.mjs) |

---

## Perguntas frequentes

**Como adicionar uma nova área de pesquisa?**
Crie um arquivo em `content/research-areas/novo-nome.md` seguindo o schema dos arquivos existentes.

**Como alterar a ordem dos pesquisadores na página de equipe?**
Edite o campo `order` no frontmatter de cada arquivo em `content/team/`.

**Como destacar um projeto na página inicial?**
Defina `featured: true` no frontmatter do projeto.

**Como atualizar as publicações sem fazer deploy completo?**
Execute `npm run update:scholar` localmente, faça commit dos novos arquivos em `content/publications/` e faça push.

**Como remover um pesquisador da listagem sem deletar o arquivo?**
Defina `active: false` no frontmatter do arquivo do pesquisador.

**O formulário de contato não está funcionando.**
Certifique-se de que `formspreeEndpoint` em `content/settings/site.yaml` contém um ID válido (não o placeholder). Crie uma conta gratuita em [formspree.io](https://formspree.io) se necessário.

---

## Licença

© NCA-UFMA. Todos os direitos reservados. Código do template disponível para uso interno.
