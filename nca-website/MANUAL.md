# Manual de Atualização do Site NCA-UFMA

Este manual ensina a manter o conteúdo do site do NCA-UFMA atualizado sem precisar programar. Foi pensado para a pessoa responsável pela comunicação, administração acadêmica ou coordenação de pesquisa do grupo.

O site é estático: isso significa que o conteúdo fica guardado em pequenos arquivos de texto (um por membro da equipe, um por projeto, um por publicação etc.). Atualizar o site é basicamente editar ou criar esses arquivos e publicar.

---

## Sumário

1. Conceitos fundamentais
2. Programas que você precisa instalar uma única vez
3. O fluxo padrão de atualização
4. Como editar um arquivo (padrão YAML)
5. Equipe (Team)
6. Áreas de pesquisa (Research Areas)
7. Projetos (Projects)
8. Publicações (Publications)
9. Parceiros e colaborações (Partners)
10. Página Sobre (About)
11. Configurações gerais do site
12. Imagens (fotos, logotipos)
13. Pré visualização local e publicação
14. Problemas comuns e soluções
15. Referência rápida

---

## 1. Conceitos fundamentais

### 1.1. Como o site é organizado

Todo o conteúdo mora em pastas dentro de `src/content/`. Cada tipo de conteúdo tem sua pasta:

```
src/content/
  team/                 um arquivo .md por membro da equipe
  research-areas/       um arquivo .md por área de pesquisa
  projects/             um arquivo .md por projeto
  publications/         um arquivo .md por publicação
  collaborations/       um arquivo .md por parceiro
  pages/                páginas institucionais (ex: about.md)
  settings/site.yaml    configurações gerais do site
```

Os arquivos terminam em `.md` (Markdown) ou `.yaml`. São arquivos de texto puro, legíveis em qualquer editor.

### 1.2. O que é o frontmatter

Cada arquivo `.md` começa com um bloco entre duas linhas de três traços (`---`). Esse bloco chama se frontmatter e guarda os dados estruturados (nome, cargo, ano etc.) em formato YAML. Depois do frontmatter, vem o texto livre em Markdown.

Exemplo mínimo:

```
---
name: "Maria Silva"
role: "PhD Student"
email: "maria@nca.ufma.br"
---

Aqui vem a biografia livre em texto Markdown.
Pode ter vários parágrafos.
```

Regras do YAML:

- Os nomes dos campos (`name`, `role`, `email`) são fixos, não mude.
- Texto entre aspas duplas é mais seguro, especialmente se tiver acentos, dois pontos ou aspas dentro.
- A indentação é feita com dois espaços, nunca com tab.
- Listas começam com `-` e um espaço.

### 1.3. O que é um slug

Slug é o nome curto que aparece na URL e no nome do arquivo. Por exemplo, o projeto cujo arquivo é `chesf-agito.md` tem slug `chesf-agito` e aparece no site como `/projects/chesf-agito`. Use sempre letras minúsculas, sem acento, separando palavras com hífen.

---

## 2. Programas que você precisa instalar uma única vez

Você vai precisar de três coisas na sua máquina:

**2.1. Um editor de texto.** Recomendamos o **Visual Studio Code** (gratuito), que abre a pasta do projeto inteira e já mostra os arquivos em cores, detectando erros básicos de formatação.

- Download: https://code.visualstudio.com

**2.2. Node.js (versão 18 ou superior).** É o motor que gera o site a partir dos arquivos de texto.

- Download: https://nodejs.org (baixe a versão LTS).
- Para confirmar que instalou, abra o Terminal (Mac) ou Prompt de Comando (Windows) e digite `node --version`. Deve aparecer algo como `v20.11.0`.

**2.3. Git.** Serve para enviar suas alterações para o repositório e publicar.

- Download: https://git-scm.com/downloads

Depois de instalar essas três coisas, abra o Terminal, vá até a pasta do projeto e rode uma vez só:

```
npm install
```

Isso baixa todas as bibliotecas que o site usa. Essa etapa só precisa ser repetida se alguém alterar o arquivo `package.json`.

---

## 3. O fluxo padrão de atualização

Sempre que for atualizar o site, siga estes passos:

1. Abra a pasta do projeto no VS Code.
2. Abra o Terminal dentro do VS Code (menu "Terminal" -> "New Terminal").
3. Antes de começar, baixe as últimas mudanças feitas por outras pessoas: `git pull`
4. Rode o servidor local para ver o site enquanto edita: `npm run dev`. Uma página abre em `http://localhost:4321`.
5. Edite os arquivos. A cada salvamento, a página recarrega automaticamente.
6. Quando terminar, grave no histórico e publique:

```
git add .
git commit -m "descrição curta do que mudou"
git push
```

Após o `push`, o site oficial é regenerado automaticamente em poucos minutos.

---

## 4. Como editar um arquivo

Três regras de ouro:

**Regra 1.** Preserve o formato. Não mexa nos nomes de campo (as palavras antes dos dois pontos). Mexa só no valor depois dos dois pontos.

**Regra 2.** Cuidado com aspas. Se o texto tiver aspas duplas por dentro, você tem duas opções: colocar tudo entre aspas simples `'...'` ou escapar com barra: `"texto com \"aspas\" dentro"`.

**Regra 3.** Quando houver um valor com `[REQUIRED: ...]`, isso indica um campo que falta preencher. Substitua tudo (inclusive os colchetes) pelo valor real.

Exemplo de antes e depois:

```
photo: "[REQUIRED: insert photo filename, e.g. anselmo-paiva.jpg]"
```

fica:

```
photo: "anselmo-paiva.jpg"
```

---

## 5. Equipe (Team)

Pasta: `src/content/team/`

### 5.1. Adicionar um novo membro

1. Crie um novo arquivo na pasta `src/content/team/` com um slug curto. Exemplo: `joao-silva.md`.
2. Copie o modelo abaixo e preencha.

```
---
name: "João da Silva"
title: "Professor Adjunto"
role: "Principal Investigator"
photo: "joao-silva.jpg"
bio: "Resumo curto sobre o pesquisador, em 2 ou 3 frases."
email: "joao@nca.ufma.br"
orcid: "0000-0000-0000-0000"
googleScholar: "https://scholar.google.com/citations?user=XXXX"
researchgate: ""
linkedin: "https://linkedin.com/in/joao-silva"
instagram: ""
twitter: ""
researchLines:
  - Computer Vision
  - Medical Imaging
highlights:
  - Bolsista de produtividade CNPq nível 2
order: 5
active: true
---

Aqui entra o texto livre de biografia, em Markdown.
Pode ter parágrafos, listas, negrito (**palavra**) e links.
```

### 5.2. Campos explicados

| Campo | O que é |
|---|---|
| `name` | Nome completo |
| `title` | Cargo institucional (ex: "Professor Titular") |
| `role` | Categoria no site. Use exatamente um destes: `Principal Investigator`, `Postdoc`, `Visiting Scholar`, `PhD Student`, `Masters Student`, `Undergraduate`, `Staff` |
| `photo` | Nome do arquivo da foto. A foto vai em `public/assets/team/`. Se não houver foto, deixe entre aspas vazias: `""` |
| `bio` | Resumo curto (1 parágrafo). Se tiver aspas dentro do texto, use apenas aspas simples em volta. |
| `email` | Email institucional |
| `orcid` | Só o identificador, sem a URL. Ex: `0000-0003-4921-0626` |
| `googleScholar`, `researchgate`, `linkedin` | URL completa do perfil |
| `instagram`, `twitter` | Aceita o usuário (`nca_ufma`) ou URL completa |
| `researchLines` | Lista de linhas de pesquisa (veja lista abaixo) |
| `highlights` | Lista de prêmios ou marcos, em frases curtas |
| `order` | Número que controla a posição na listagem. Valores baixos aparecem antes. |
| `active` | `true` para membros atuais, `false` para alumni |

### 5.3. Remover um membro ou marcar como alumni

Para mover para Alumni, basta mudar `active: true` para `active: false`. O cartão vai aparecer na seção "Alumni" da página `/team`.

Para remover completamente, apague o arquivo `.md` correspondente.

### 5.4. Foto do membro

Salve a foto em `public/assets/team/nome-do-arquivo.jpg`. Formatos recomendados: `.jpg` ou `.webp`, no mínimo 400x400 pixels, preferencialmente quadrada. Depois coloque só o nome do arquivo no campo `photo:` do `.md`.

### 5.5. Publicações do membro (automático via Google Scholar)

A página de perfil de cada integrante mostra, logo abaixo da seção **Highlights**, a lista completa de publicações do membro. Essa lista é buscada automaticamente da página do Google Scholar da pessoa a cada publicação do site, usando o mesmo mecanismo da página geral de Publicações.

Para ativar: no arquivo `.md` do membro, preencha o campo `googleScholar` com a URL completa do perfil dele no Scholar (formato `https://scholar.google.com/citations?user=XXXXXXX`). Qualquer URL diferente desse formato é ignorada.

Para desativar em um membro específico: apague o valor do campo `googleScholar` (ou troque por `"[REQUIRED]"`). A seção Publications some do perfil dele.

Quando a URL está preenchida, o site faz o seguinte a cada build:

1. Lê todas as pessoas em `src/content/team/`.
2. Para cada uma com `googleScholar` válido, abre o Scholar e baixa a lista de publicações (todas as páginas, até 2.000 registros).
3. Salva um arquivo JSON em `src/data/member-publications/<slug>.json`.
4. A página do perfil lê esse JSON e exibe cada publicação com título, autores, veículo, ano e link para o Scholar.

Caso o Scholar responda com CAPTCHA ou recusa de conexão em um build, a publicação do site continua normalmente e o JSON anterior daquele membro é preservado (ou seja, a lista não fica em branco; ela fica com o último resultado bem sucedido). O log da aba **Actions** mostra o motivo.

Para rodar essa atualização manualmente no seu computador:

```
npm run update:scholar:members
```

---

## 6. Áreas de pesquisa (Research Areas)

Pasta: `src/content/research-areas/`

Já existem seis áreas cadastradas. Os slugs oficiais são:

- `ai-data-science`
- `computer-vision-medical-imaging`
- `logistics-optimization`
- `natural-language-processing`
- `software-engineering-ux`
- `virtual-augmented-reality`

Esses slugs são usados em outros lugares (projetos, publicações). Não mude um slug sem ajustar também todas as referências.

### 6.1. Editar uma área existente

Abra o arquivo correspondente e edite. Frontmatter típico:

```
---
title: "Computer Vision & Medical Imaging"
icon: "eye"
summary: "Descrição curta de uma ou duas frases."
projects: []
color: "#C8922A"
order: 3
---

Texto longo da área em Markdown.
Pode usar subseções com ##, listas, negrito, etc.
```

### 6.2. Criar uma nova área

1. Crie um arquivo com slug novo. Ex: `robotics.md`.
2. Use o modelo acima.
3. Escolha uma cor em código hex. O `color` é usado como destaque visual.
4. Ajuste `order` para controlar a ordem de exibição na página `/research-areas`.

---

## 7. Projetos (Projects)

Pasta: `src/content/projects/`

### 7.1. Adicionar um projeto

Crie um novo arquivo, por exemplo `petrobras-visao-submarina.md`, com o seguinte modelo:

```
---
title: "Visão Computacional Submarina"
partner: "Petrobras"
funding: "Petrobras CENPES"
grantNumber: "2024/123456"
status: "active"
startDate: "2024-03"
endDate: "2026-12"
description: "Resumo curto do projeto, 1 ou 2 frases."
researchArea: "computer-vision-medical-imaging"
members:
  - anselmo-paiva
  - joao-silva
highlights:
  - "Detecção automática em vídeo subaquático"
  - "Base de dados com 50 mil imagens anotadas"
cover: "visao-submarina.jpg"
video: "https://www.youtube.com/watch?v=XXXXXXXX"
tags:
  - computer-vision
  - energy
featured: true
---

Texto longo do projeto em Markdown.
```

### 7.2. Campos explicados

| Campo | O que é |
|---|---|
| `title` | Nome do projeto |
| `partner` | Parceiro principal (ex: empresa, agência) |
| `funding` | Fonte de recurso |
| `grantNumber` | Número do contrato ou projeto (se houver) |
| `status` | Use `active`, `concluded` ou `paused` |
| `startDate`, `endDate` | Formato livre, ex: `2024-03` ou `março/2024` |
| `description` | Resumo curto que aparece no cartão |
| `researchArea` | Slug de uma das áreas de pesquisa (veja seção 6) |
| `members` | Lista de slugs de membros (nome do arquivo sem o `.md`) |
| `highlights` | Frases curtas de destaque |
| `cover` | Nome do arquivo de imagem (em `public/assets/projects/`). Opcional. |
| `video` | URL do YouTube. Opcional. |
| `tags` | Palavras chave, sem acento |
| `featured` | `true` para destacar na home |

Para remover, apague o arquivo.

---

## 8. Publicações (Publications)

Pasta: `src/content/publications/`

As publicações podem entrar de duas formas: importadas automaticamente do Google Scholar ou adicionadas manualmente.

### 8.1. Importação automática do Google Scholar

Existe um script que lê o perfil do grupo no Google Scholar e cria um arquivo `.md` para cada publicação. A URL do perfil fica em `content/settings/site.yaml` no campo `googleScholarGroupUrl`.

**Comandos disponíveis:**

```
npm run update:scholar         apenas adiciona o que for novo
npm run sync:scholar:dry       mostra o que seria ADICIONADO ou REMOVIDO (sem alterar nada)
npm run sync:scholar           adiciona E remove do site o que foi apagado do Scholar
npm run reclassify:pubs        revê o tipo (journal/conference/etc.) de todas as publicações
```

**Qual escolher:**

- Use `npm run update:scholar` no dia a dia para trazer novos artigos.
- Use `npm run sync:scholar` quando quiser limpar também as publicações que saíram do perfil do Scholar (por exemplo, uma que o próprio autor removeu por duplicidade).
- Sempre rode `npm run sync:scholar:dry` antes do `sync` real para conferir a lista de remoções.

**Atenção sobre CAPTCHA:** o Google Scholar às vezes pede verificação humana. Se o script parar no meio, espere alguns minutos e rode novamente; ele só baixa o que ainda falta.

### 8.2. Proteger uma publicação contra o sync

Se você editou manualmente uma publicação (adicionou DOI, abstract, área de pesquisa) e não quer que ela seja apagada caso seja removida do Scholar, mude o campo `scholarId:` para qualquer valor diferente do nome do arquivo. Por exemplo:

```
scholarId: "manual"
```

Com isso, o `sync` nunca vai removê la.

### 8.3. Ajustar manualmente uma publicação

Abra o arquivo `.md` da publicação e edite o frontmatter. Campos principais:

```
---
title: "Título completo do artigo"
authors:
  - "A. Paiva"
  - "J. Silva"
venue: "Nome do journal ou da conferência"
year: 2025
doi: "10.1109/ACCESS.2025.0001"
url: "https://link.para.o.artigo"
type: "conference"
researchArea: "computer-vision-medical-imaging"
abstract: "Resumo do artigo"
tags:
  - deep-learning
  - medical-imaging
featured: false
scholarId: "manual"
---
```

Valores válidos para `type`: `journal`, `conference`, `book-chapter`, `thesis`, `preprint`, `other`.

Para destacar uma publicação importante, marque `featured: true`.

### 8.4. Acrescentar uma publicação nova à mão

1. Crie um arquivo novo em `src/content/publications/` com um slug descritivo, por exemplo `2025-nossa-melhor-publicacao.md`.
2. Copie o modelo do item 8.3 e preencha.
3. Use `scholarId: "manual"` para protegê la do sync.

### 8.5. Classificação automática está errada

O tipo (`type`) é escolhido automaticamente pelo script a partir do nome do venue, usando uma lista de palavras chave. Se uma conferência ou journal específico estiver caindo no tipo errado, você tem duas opções:

**Opção A (rápida, individual):** abra o `.md` e mude o `type:` à mão.

**Opção B (definitiva, em lote):** peça ao desenvolvedor para adicionar o nome da conferência ou journal ao arquivo `scripts/classify-venue.mjs`, e depois rode `npm run reclassify:pubs` para reaplicar em toda a base.

---

## 9. Parceiros e colaborações (Partners)

Pasta: `src/content/collaborations/`

Modelo:

```
---
name: "Petrobras"
type: "company"
country: "Brazil"
logo: "petrobras.svg"
url: "https://petrobras.com.br"
description: "Parceria em projetos de detecção de falhas e visão computacional submarina."
featured: true
order: 1
---
```

Valores válidos para `type`: `university`, `company`, `government`, `research-institute`, `ngo`.

Logos ficam em `public/assets/collaborations/`. SVG é o formato preferido.

---

## 10. Página Sobre (About)

Arquivo único: `src/content/pages/about.md`.

É a página mais longa do site. Tem frontmatter com título e descrição, e o conteúdo livre em Markdown abaixo. Você pode:

- Adicionar seções com `## Título da Seção`
- Usar listas com `-` no começo da linha
- Negrito com `**palavra**`
- Links com `[texto](https://url)`
- Imagens com `![descrição](/assets/pasta/imagem.jpg)`

O bloco do Google Maps é controlado pelo campo `googleMapsEmbed` em `content/settings/site.yaml` (veja seção 11).

---

## 11. Configurações gerais do site

Arquivo: `content/settings/site.yaml`

Esse arquivo controla informações que aparecem em várias partes do site. Edite com cuidado.

```
siteName: "NCA-UFMA"
siteTagline: "Applied Computing Group — Federal University of Maranhão"
siteDescription: "..."
logoFile: "nca-logo.svg"
googleScholarGroupUrl: "https://scholar.google.com/citations?user=..."
formspreeEndpoint: "xdaydarl"
instagramHandle: "nca_ufma"
linkedinPageUrl: "https://linkedin.com/company/nca-ufma"
youtubeChannelUrl: ""
emailPrimary: "paiva@nca.ufma.br"
emailSecondary: "ari@nca.ufma.br"
address: "NCA Lab, CCET Building - Av. dos Portugueses, 1966 - Vila Bacanga, São Luís - MA, 65080-805"
googleMapsEmbed: "https://www.google.com/maps/embed?..."
colors:
  primary: "#2346E5"
  secondary: "#6B4C9A"
  accent: "#C8922A"
  neutral: "#6C7A89"
stats:
  phd: 15
  masters: 23
  undergrad: 48
```

**Como obter a URL do Google Maps:**
1. Abra o Google Maps no endereço do NCA.
2. Clique em "Compartilhar".
3. Na aba "Incorporar um mapa", copie apenas o valor do atributo `src` do iframe.
4. Cole em `googleMapsEmbed`.

**Estatísticas (stats):** são os números que aparecem em destaque na home. Atualize `phd`, `masters`, `undergrad` conforme o quadro atual de alunos.

---

## 12. Imagens

Todas as imagens ficam na pasta `public/`. Dentro dela, organize por tipo:

```
public/
  assets/
    team/              fotos de membros
    projects/          imagens de capa de projetos
    collaborations/    logos de parceiros
    news/              imagens de notícias (não usado no momento)
    og-default.png     imagem padrão para compartilhamento em redes
  favicon.svg          ícone do site
```

**Regras práticas:**

- Nomes de arquivo só com letras minúsculas, números e hífen. Sem espaço, acento ou caractere especial.
- Fotos de equipe: quadradas, 400x400 px ou maior.
- Logos de parceiros: SVG quando possível. Se for PNG, fundo transparente.
- Capas de projeto: 1200x630 px é o ideal para ficar bonito no cartão e nas redes sociais.
- Evite imagens muito pesadas. Mais de 500 KB já é pesado para fotos web.

Para referenciar uma imagem em um arquivo `.md`, use o caminho começando com `/`. Exemplo:

```
cover: "meu-projeto.jpg"
```

Este valor é combinado automaticamente com `public/assets/projects/`, então o arquivo real deve estar em `public/assets/projects/meu-projeto.jpg`.

---

## 13. Pré visualização local e publicação

### 13.1. Ver o site na sua máquina

```
npm run dev
```

O site abre em `http://localhost:4321`. A cada arquivo salvo, a página recarrega sozinha. Se houver erro no frontmatter, aparece uma tela vermelha com a descrição do problema.

### 13.2. Construir a versão final

```
npm run build
```

Esse comando gera a pasta `dist/` com o site pronto. Útil para conferir que tudo compila sem erro antes de publicar.

### 13.3. Publicar no ar

Depois de testar localmente:

```
git add .
git commit -m "Mensagem curta explicando a mudança"
git push
```

O deploy automático roda em alguns minutos (GitHub Pages ou serviço equivalente). A mensagem de commit deve descrever o que foi alterado de forma clara, por exemplo:

```
git commit -m "Adiciona novo membro João Silva"
git commit -m "Atualiza dados do projeto AGITO"
git commit -m "Importa 12 novas publicações do Scholar"
```

---

## 14. Problemas comuns e soluções

**O servidor local mostra tela vermelha de erro.**
O erro geralmente é no frontmatter. Leia a mensagem: ela indica o arquivo e o número da linha. Causas frequentes: esqueceu uma aspa, usou tab em vez de espaço na indentação, escreveu um `role:` que não existe.

**Foto de membro não aparece.**
Verifique três coisas: (a) o arquivo foi salvo em `public/assets/team/`, (b) o nome no campo `photo:` bate exatamente com o nome real, incluindo a extensão, (c) o nome não tem acento, espaço ou maiúscula.

**`npm run update:scholar` avisa "No SCHOLAR_URL set".**
A URL do Scholar não está preenchida em `content/settings/site.yaml`. Preencha o campo `googleScholarGroupUrl`.

**`npm run update:scholar` para com erro de captcha.**
Espere 10 a 30 minutos e rode de novo. O script retoma de onde parou, não repete o que já baixou.

**Uma publicação importada saiu com o tipo errado.**
Abra o arquivo e corrija o campo `type:` à mão. Se várias publicações da mesma conferência estão erradas, peça para atualizar a regra em `scripts/classify-venue.mjs`.

**Uma publicação aparece duplicada.**
Isso acontece quando o mesmo artigo existe com dois slugs diferentes (por exemplo, o título foi corrigido no Scholar). Apague manualmente um dos arquivos `.md` na pasta `src/content/publications/`.

**O site não atualiza online mesmo após o git push.**
Abra a aba "Actions" no repositório do GitHub para ver o status do deploy. Se falhou, leia o log: quase sempre é erro de frontmatter que não foi detectado localmente.

---

## 15. Referência rápida

### 15.1. Comandos essenciais

| Comando | O que faz |
|---|---|
| `git pull` | Baixa as últimas alterações do repositório |
| `npm run dev` | Liga o servidor local de visualização |
| `npm run build` | Gera a versão final do site |
| `npm run update:scholar` | Importa novas publicações do Scholar |
| `npm run sync:scholar:dry` | Mostra o que o sync faria |
| `npm run sync:scholar` | Sincroniza com o Scholar (adiciona e remove) |
| `npm run reclassify:pubs` | Reaplica a classificação automática de tipo |
| `git add .` | Marca todos os arquivos modificados para commit |
| `git commit -m "..."` | Grava um ponto no histórico |
| `git push` | Envia para o repositório (publica) |

### 15.2. Valores válidos nos campos

| Campo | Valores aceitos |
|---|---|
| `role` (team) | Principal Investigator, Postdoc, Visiting Scholar, PhD Student, Masters Student, Undergraduate, Staff |
| `status` (projects) | active, concluded, paused |
| `type` (publications) | journal, conference, book-chapter, thesis, preprint, other |
| `type` (collaborations) | university, company, government, research-institute, ngo |
| `source` (news) | removido do site atual |

### 15.3. Slugs das áreas de pesquisa

- `ai-data-science`
- `computer-vision-medical-imaging`
- `logistics-optimization`
- `natural-language-processing`
- `software-engineering-ux`
- `virtual-augmented-reality`

### 15.4. Estrutura de pastas para lembrar

```
nca-website/
  content/settings/site.yaml      configurações gerais
  src/content/
    team/                          membros
    research-areas/                áreas
    projects/                      projetos
    publications/                  publicações
    collaborations/                parceiros
    pages/about.md                 página sobre
  public/assets/                   imagens
  scripts/                         scripts de automação
  MANUAL.md                        este manual
```

---

## 16. Dúvidas e suporte

Quando tiver dúvida, siga esta ordem:

1. Volte a este manual, em especial à seção 14 (problemas comuns).
2. Verifique se alguém mais já fez algo parecido, olhando o histórico: `git log --oneline`.
3. Entre em contato com o responsável técnico do site.

Boas atualizações.
