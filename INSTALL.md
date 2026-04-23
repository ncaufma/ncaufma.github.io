# Manual de Instalação do Site NCA-UFMA no GitHub

Este manual traz o roteiro passo a passo para publicar o site do NCA-UFMA no GitHub, usando o serviço gratuito GitHub Pages. Ele foi escrito para ser seguido por alguém que nunca programou. Ao final, o site estará no ar no endereço **https://ncaufma.github.io** e qualquer alteração de conteúdo publicada no repositório atualiza o site automaticamente em poucos minutos.

O projeto está organizado assim dentro da pasta que você recebeu:

```
ncaufma.github.io/          (pasta raiz, é o repositório)
├── .github/workflows/      (instruções de publicação automática)
│   └── deploy.yml
├── .gitignore
└── nca-website/            (o site propriamente dito)
    ├── src/                (páginas e conteúdo)
    ├── public/             (imagens e arquivos estáticos)
    ├── scripts/
    ├── package.json
    ├── astro.config.mjs
    ├── MANUAL.md
    └── MANUAL.docx
```

A instalação é feita uma única vez. Depois disso, toda atualização de conteúdo é feita pelo navegador, direto no GitHub, sem precisar mexer em nada do que está descrito aqui.

## 1. O que você precisa antes de começar

Três coisas precisam estar prontas no seu computador e na internet antes de qualquer passo técnico.

### 1.1 Uma conta no GitHub

Acesse **https://github.com/signup** e crie uma conta gratuita. Durante o cadastro você escolhe um nome de usuário; guarde esse nome porque será usado no endereço do repositório. Para o site oficial do NCA-UFMA, a conta correta é a **ncaufma** (já existente). Se você for apenas o(a) editor(a) de conteúdo, peça ao responsável para adicionar seu usuário como colaborador do repositório (Settings, depois Collaborators).

### 1.2 Git instalado

Git é o programa que envia arquivos do seu computador para o GitHub. Baixe em **https://git-scm.com/downloads** e instale com as opções padrão. Para conferir que a instalação funcionou, abra o Terminal (no macOS) ou o Prompt de Comando (no Windows) e digite:

```
git --version
```

Deve aparecer algo como `git version 2.45.0`.

### 1.3 Node.js (versão 20 ou superior)

Node.js é o ambiente que constrói o site. Você só precisa dele se quiser visualizar o site localmente antes de publicar. Baixe a versão **LTS** em **https://nodejs.org** e instale com as opções padrão. Para conferir:

```
node --version
```

Deve aparecer `v20.x.x` ou maior.

Caso você pretenda apenas editar conteúdo pelo navegador no próprio GitHub, pode pular a instalação do Node. Nesse caso, o GitHub se encarrega de construir o site para você a cada alteração.

## 2. Colocar o projeto no GitHub

Esta é a etapa que precisa ser feita uma única vez, pela pessoa que vai administrar o repositório.

### 2.1 Criar o repositório

1. Entre em **https://github.com/new** com a conta **ncaufma**.
2. No campo **Repository name** escreva exatamente: `ncaufma.github.io`. O nome precisa ser igual ao usuário seguido de `.github.io`, porque essa é a regra do GitHub Pages para sites institucionais.
3. Deixe o repositório como **Public**.
4. **Não** marque as opções de adicionar README, .gitignore ou licença. O repositório deve começar vazio.
5. Clique em **Create repository**.

### 2.2 Abrir o terminal na pasta do projeto

Localize no seu computador a pasta `ncaufma.github.io` (a que contém as subpastas `.github` e `nca-website`). Abra um terminal nessa pasta:

No Windows, clique com o botão direito dentro da pasta e escolha **Git Bash Here** (ou **Abrir no Terminal**).

No macOS, abra o **Terminal**, digite `cd ` (com um espaço depois) e arraste a pasta para dentro da janela do Terminal. Pressione Enter.

### 2.3 Preparar o projeto para o primeiro envio

Cole uma linha de cada vez, pressionando Enter após cada uma. Na primeira vez que você usar o Git, ele pedirá seu nome e email. Se isso acontecer, execute antes:

```
git config --global user.name  "Seu Nome"
git config --global user.email "seu@email.com"
```

Em seguida, dentro da pasta do projeto, execute:

```
git init -b main
git add .
git commit -m "Primeira versão do site"
git remote add origin https://github.com/ncaufma/ncaufma.github.io.git
git push -u origin main
```

O último comando vai pedir que você faça login no GitHub. Use o método recomendado pelo próprio terminal (token pessoal ou aplicativo GitHub Desktop). Se preferir algo visual, uma alternativa simples é baixar o **GitHub Desktop** em https://desktop.github.com, adicionar a pasta como repositório local e clicar em **Publish repository**.

### 2.4 Ativar o GitHub Pages

1. No navegador, entre no repositório recém criado: **https://github.com/ncaufma/ncaufma.github.io**.
2. Clique em **Settings** (no menu do topo do repositório).
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Build and deployment**, no campo **Source**, escolha **GitHub Actions**.
5. Pronto. Não precisa preencher mais nada nesta tela.

### 2.5 Esperar a primeira publicação

Volte para a aba principal do repositório e clique em **Actions**, no topo. Você verá um fluxo chamado **Deploy to GitHub Pages** em execução. A primeira publicação leva entre 2 e 5 minutos. Quando o círculo ao lado ficar verde, o site está no ar.

Teste em **https://ncaufma.github.io**.

Caso o círculo fique vermelho, clique sobre o fluxo para ler a mensagem de erro. Os problemas mais comuns nesta etapa são listados na seção 5 deste manual.

## 3. Rodar o site localmente (opcional)

Este passo serve apenas para quem quer ver o site no próprio computador antes de publicar alterações. Para uso exclusivo de edição pelo navegador no GitHub, pule para a seção 4.

### 3.1 Clonar o repositório

Se você ainda não tem a pasta no seu computador, abra o terminal onde desejar e execute:

```
git clone https://github.com/ncaufma/ncaufma.github.io.git
cd ncaufma.github.io/nca-website
```

### 3.2 Instalar as dependências

Ainda dentro da pasta `nca-website`, execute uma única vez:

```
npm install
```

Esse comando pode levar de 1 a 3 minutos. Ele baixa as bibliotecas necessárias para o Astro (a tecnologia que monta o site). Ao terminar, aparece uma pasta nova chamada `node_modules`. Ela é grande e não precisa ser enviada para o GitHub (o arquivo `.gitignore` já cuida disso).

### 3.3 Abrir o site no navegador

```
npm run dev
```

O terminal mostra um endereço local, normalmente **http://localhost:4321**. Abra esse endereço no navegador. Qualquer arquivo que você alterar na pasta é atualizado em segundos na tela. Para parar o servidor, volte ao terminal e pressione **Ctrl + C**.

### 3.4 Gerar uma versão final (opcional)

```
npm run build
```

Esse comando gera a pasta `dist/`, que é exatamente o que o GitHub publica. Útil apenas para conferência; você não precisa enviar a pasta `dist/` para o GitHub, o próprio GitHub a gera automaticamente.

## 4. Como atualizar o conteúdo no dia a dia

A partir da instalação inicial, toda atualização pode ser feita direto no navegador, sem instalar nada. O passo a passo detalhado de cada tipo de conteúdo (novo membro da equipe, novo projeto, nova publicação, etc.) está no arquivo **MANUAL.md** e **MANUAL.docx**, dentro da pasta `nca-website`. O ciclo resumido é sempre:

1. Entre em **https://github.com/ncaufma/ncaufma.github.io**.
2. Navegue até a pasta do conteúdo que quer alterar (por exemplo, `nca-website/src/content/team` para a equipe).
3. Clique no arquivo desejado e no ícone de lápis (Edit) no canto superior direito.
4. Faça as alterações no editor web.
5. Role a página até o final, escreva uma breve descrição em **Commit changes** e clique em **Commit changes**.
6. Em 2 a 5 minutos, o site no ar reflete a alteração. O andamento pode ser conferido na aba **Actions** do repositório.

Para criar um arquivo novo, entre na pasta correspondente, clique em **Add file**, **Create new file** e escolha um nome (por exemplo, `novo-projeto.md`). Copie o conteúdo de um arquivo semelhante já existente como modelo.

Para enviar imagens (fotos da equipe, logos, etc.), entre na pasta `nca-website/public/assets`, clique em **Add file**, **Upload files** e arraste os arquivos. Imagens devem estar preferencialmente em formato **webp** ou **jpg**, com no máximo 1 MB cada.

## 5. Problemas comuns

**O workflow falhou na primeira publicação.** Abra a aba **Actions**, clique no fluxo com erro e leia a última mensagem em vermelho. Os motivos mais comuns são: o nome do repositório não ser `ncaufma.github.io`; a configuração **Source** em Settings/Pages não ter sido colocada em **GitHub Actions**; ter esquecido de enviar algum arquivo. Confira esses três pontos e clique em **Re-run all jobs** no topo da tela do Actions.

**A página mostra 404.** Aguarde até 10 minutos após a primeira publicação. Em seguida, limpe o cache do navegador ou abra em uma aba anônima. Se persistir, confirme em Settings/Pages que o endereço mostrado no topo é `https://ncaufma.github.io`.

**O email do Git não foi aceito.** O GitHub pede um email verificado. Vá em https://github.com/settings/emails, verifique seu email principal e repita o comando de commit.

**O terminal pede senha e não aceita a senha da conta.** O GitHub não aceita mais a senha da conta nos comandos Git. Crie um token pessoal em https://github.com/settings/tokens (Personal Access Token, com permissão `repo`) e use o token como senha, ou instale o **GitHub Desktop** para fazer o envio sem senha.

**Aparece um erro sobre o arquivo `package-lock.json`.** O arquivo precisa existir dentro da pasta `nca-website`. Se ele sumir, rode `npm install` uma vez dentro da pasta `nca-website` e faça um novo commit incluindo o arquivo gerado.

## 6. Itens opcionais (só quando for usar)

### 6.1 Atualização automática de publicações do Google Scholar

O site tem um script que pode buscar publicações no Google Scholar e sincronizá-las com a página de Publicações. Para ativar:

1. No repositório, vá em **Settings**, **Secrets and variables**, **Actions**, **New repository secret**.
2. Em **Name**, escreva `SCHOLAR_URL`.
3. Em **Secret**, cole o endereço completo da página do grupo no Google Scholar.
4. Salve.

A partir daí, toda vez que o workflow rodar, ele também atualiza as publicações automaticamente. Mais detalhes no MANUAL.md, seção sobre publicações.

### 6.2 Domínio próprio (www.nca.ufma.br, por exemplo)

Caso queira publicar o site em um endereço institucional em vez de `ncaufma.github.io`:

1. Crie um arquivo chamado `CNAME` (sem extensão) dentro de `nca-website/public/`, contendo apenas o endereço desejado, por exemplo: `nca.ufma.br`.
2. No provedor de DNS do domínio, crie um registro do tipo **CNAME** apontando o subdomínio desejado para `ncaufma.github.io`.
3. No GitHub, vá em **Settings**, **Pages**, e no campo **Custom domain** coloque o mesmo endereço. Marque também **Enforce HTTPS** após alguns minutos.

### 6.3 Dar acesso a outra pessoa

No repositório, **Settings**, **Collaborators**, **Add people**. Informe o usuário GitHub da pessoa e escolha o papel de **Write** ou **Maintain**.

## 7. Resumo em uma página

Para quem já fez tudo uma vez e só precisa de um lembrete rápido:

1. Criar repositório `ncaufma/ncaufma.github.io` no GitHub, público, vazio.
2. No terminal, dentro da pasta do projeto: `git init -b main`, `git add .`, `git commit -m "..."`, `git remote add origin https://github.com/ncaufma/ncaufma.github.io.git`, `git push -u origin main`.
3. No GitHub: **Settings**, **Pages**, **Source**: **GitHub Actions**.
4. Esperar o círculo verde na aba **Actions**.
5. Abrir **https://ncaufma.github.io**.

Para dúvidas sobre **edição de conteúdo** (adicionar pessoa da equipe, novo projeto, nova publicação, atualizar textos), consulte o arquivo **MANUAL.md** dentro da pasta `nca-website`.
