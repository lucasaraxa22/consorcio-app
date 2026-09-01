# Painel do Consórcio — v1

App web para representante de consórcio. Primeiro módulo pronto: **Leads e Clientes**.

---

## O que já funciona

- Cadastrar um lead (nome, telefone, e-mail, interesse, valor de crédito desejado)
- Listar todos os leads
- Mudar o status do lead (Novo → Em contato → ... → Fechado/Perdido)
- Excluir lead

---

## Passo a passo para colocar no ar (gratuito)

### 1. Criar o banco de dados no Supabase

1. Acesse https://supabase.com e crie uma conta grátis.
2. Clique em **New project**. Dê um nome (ex: `consorcio-app`) e uma senha para o banco (guarde essa senha em local seguro).
3. Espere o projeto ser criado (leva 1-2 minutos).
4. No menu lateral, clique em **SQL Editor** → **New query**.
5. Abra o arquivo `supabase/schema.sql` deste projeto, copie todo o conteúdo, cole no editor e clique em **Run**.
   - Isso cria a tabela `leads` no seu banco.
6. Vá em **Project Settings** (ícone de engrenagem) → **API**.
   - Copie o **Project URL** e a chave **anon public**. Você vai usar os dois no próximo passo.

### 2. Rodar o app no seu computador

1. Instale o [Node.js](https://nodejs.org) (versão 20 ou mais recente) se ainda não tiver.
2. Abra um terminal dentro deste projeto e rode:
   ```
   npm install
   ```
3. Copie o arquivo `.env.local.example` e renomeie a cópia para `.env.local`.
4. Abra o `.env.local` e cole a URL e a chave que você copiou do Supabase.
5. Rode:
   ```
   npm run dev
   ```
6. Abra o navegador em `http://localhost:3000` — o app deve carregar e já conseguir salvar leads de verdade no seu banco.

### 3. Publicar na internet (Vercel — gratuito)

1. Crie uma conta em https://github.com (se ainda não tiver) e crie um repositório novo.
2. Suba este código para o repositório (posso te ajudar com os comandos do Git quando chegar nessa parte).
3. Acesse https://vercel.com, crie conta com o mesmo GitHub, e clique em **New Project**.
4. Selecione o repositório que você criou.
5. Antes de clicar em "Deploy", vá em **Environment Variables** e adicione as mesmas duas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique em **Deploy**. Em 1-2 minutos você recebe um link público (ex: `consorcio-app.vercel.app`) que já funciona no PC e no celular.
7. (Opcional) No celular, abra esse link no Chrome e use "Adicionar à tela inicial" — o app passa a se comportar como um aplicativo instalado.

---

## Estrutura do projeto (pra você ir se localizando)

```
src/
  app/
    layout.tsx        -> estrutura geral (menu + rodapé) que envolve todas as páginas
    page.tsx           -> página inicial (por ora só redireciona para /leads)
    leads/page.tsx      -> página do módulo de Leads
  components/
    NavBar.tsx          -> menu de navegação (topo no PC, embaixo no celular)
    LeadForm.tsx        -> formulário de cadastro de lead
    LeadList.tsx        -> lista de leads com status
  lib/
    supabaseClient.ts   -> conexão com o banco de dados
    types.ts            -> definição dos campos de um Lead
supabase/
  schema.sql            -> script para criar a tabela no banco
```

---

## Próximos módulos (na ordem sugerida)

1. **Simulador de consórcio** — calcular parcela por valor/prazo/taxa
2. **Funil de vendas (Kanban)** — visualizar leads por etapa, arrastando cards
3. **Propostas em PDF** — gerar documento a partir dos dados do lead
4. **Comissões** — registrar vendas fechadas e comissão esperada
5. **Login** — proteger o app com usuário/senha (hoje qualquer um com o link acessa)

Sempre que quiser evoluir, me chame e seguimos o mesmo padrão: uma pasta em `app/`, componentes em `components/`, e se precisar de tabela nova, um novo bloco no `schema.sql`.
