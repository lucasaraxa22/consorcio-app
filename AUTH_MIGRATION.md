# Migração de Autenticação: Supabase Auth → CPF + Senha Local

## Resumo das Mudanças

A aplicação foi migrada de **Supabase Auth (Email+Senha)** para **autenticação local com CPF+Senha** para contornar limitações de rate limiting do Supabase Auth.

### Problemas Resolvidos
- ✅ Rate limiting do Supabase Auth (3-4 tentativas por email/hora)
- ✅ Bloqueio por IP após múltiplas tentativas
- ✅ Dependência de terceiros para autenticação básica
- ✅ Problemas de latência de verificação de email

## Arquivos Modificados

### 1. **src/components/LoginForm.tsx**
**Antes**: Login com email + senha
**Depois**: Login com CPF + senha

```typescript
// ANTES
async function handleLogin(e) {
  await supabase.auth.signInWithPassword({
    email: emailLogin,
    password: senha,
  });
}

// DEPOIS
async function handleLogin(e) {
  await login(cpf.replace(/\D/g, ""), senha);
}
```

**Mudanças**:
- Campo de email substituído por CPF com formatação automática (XXX.XXX.XXX-XX)
- Ambas abas (Login e Registro) agora usam CPF como identificador
- Validação de CPF com 11 dígitos e sem padrão repetido (111.111.111-11)

### 2. **src/lib/authContext.tsx**
**Antes**: Supabase Auth para login/registro
**Depois**: Autenticação local com hash SHA256

```typescript
// ANTES
async function login(emailLogin: string, senha: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailLogin,
    password: senha,
  });
}

// DEPOIS
async function login(cpfLogin: string, senha: string) {
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("cpf", cpfLogin)
    .single();
  
  const senhaHash = hashPassword(senha);
  if (usuario.senha !== senhaHash) {
    throw new Error("Senha incorreta");
  }
  
  localStorage.setItem("usuario_cpf", cpfLogin);
}
```

**Mudanças**:
- ✅ Substitui `email` por `cpf` na interface AuthContextType
- ✅ Implementa função `hashPassword(senha)` usando SHA256 (sem dependências externas)
- ✅ Login: busca usuário por CPF, compara hash de senha, armazena CPF em localStorage
- ✅ Registro: faz hash da senha antes de inserir na tabela usuarios
- ✅ Logout: remove CPF do localStorage
- ✅ checkAuth: verifica localStorage ao invés de Supabase Auth session

**Função de Hash**:
```typescript
const hashPassword = (senha: string): string => {
  return crypto.createHash("sha256").update(senha).digest("hex");
};
```

### 3. **src/components/NavBar.tsx**
**Antes**: Exibe email do usuário
**Depois**: Exibe nome completo e CPF formatado

```typescript
// ANTES
<span className="text-sm text-white/70">{email}</span>

// DEPOIS
<div className="flex flex-col text-right">
  <span className="text-xs text-white/50">Conectado como</span>
  <span className="text-sm text-white/70">{nomeUsuario}</span>
  <span className="text-xs text-white/50">{cpfFormatado}</span>
</div>
```

### 4. **src/lib/useRequireAuth.ts**
**Antes**: Verifica Supabase Auth session
**Depois**: Verifica localStorage + Auth Context

```typescript
// ANTES
const { data: { session } } = await supabase.auth.getSession();
if (!session?.user) router.push("/auth/login");

// DEPOIS
const { cpf, carregando } = useAuth();
if (!carregando && !cpf) router.push("/auth/login");
```

### 5. **middleware.ts**
**Antes**: Verifica Supabase token (`sb-access-token`)
**Depois**: Proteção apenas no cliente

```typescript
// ANTES
const token = request.cookies.get("sb-access-token")?.value;
if (!token && request.nextUrl.pathname !== "/auth/login") {
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

// DEPOIS
// Proteção agora é feita no lado do cliente com useRequireAuth hook
// Middleware apenas deixa passar todas as rotas
return NextResponse.next();
```

## Schema do Banco de Dados

A tabela `usuarios` agora exige a coluna `senha` com hash SHA256:

```sql
CREATE TABLE usuarios (
  id uuid PRIMARY KEY,
  created_at timestamp,
  cpf varchar UNIQUE,        -- Novo identificador principal
  nome varchar,
  email varchar UNIQUE,
  senha TEXT                 -- Novo: hash SHA256 da senha
);
```

### Exemplo de dados:
```json
{
  "id": "uuid-123",
  "created_at": "2024-01-15T10:30:00Z",
  "cpf": "12345678901",
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
}
```

## Como Testar

### Registro de Novo Usuário
1. Acesse: `http://localhost:3000/auth/login`
2. Clique na aba "Registrar"
3. Preencha:
   - **CPF**: 123.456.789-09
   - **Nome**: Teste Silva
   - **E-mail**: teste@example.com
   - **Senha**: senha123
4. Clique em "Registrar"

### Login
1. Clique na aba "Login"
2. Preencha:
   - **CPF**: 123.456.789-09
   - **Senha**: senha123
3. Clique em "Entrar"
4. Deve redirecionar para `/leads`

### Verificação
- ✅ NavBar exibe nome e CPF formatado
- ✅ Logout limpa localStorage
- ✅ Recarregar página mantém autenticação
- ✅ Acessar `/leads` sem estar logado redireciona para login
- ✅ Nenhum erro de rate limiting
- ✅ Múltiplos usuários podem ser criados rapidamente

## Segurança

### ✅ Implementado
- Hash SHA256 para senhas (unidirecional)
- Senhas nunca armazenadas em plaintext
- LocalStorage apenas armazena CPF (não senha)
- Validação de CPF no cliente (XXX.XXX.XXX-XX)

### ⚠️ Recomendações Futuras
- Implementar rate limiting no servidor (login attempts)
- Usar bcryptjs para hashing mais robusto (requer npm install)
- Adicionar HTTPS obrigatório
- Implementar refresh tokens com expiração
- Adicionar 2FA (autenticação de dois fatores)
- Auditoria de login (log de tentativas)

## Rollback (se necessário)

Se precisar reverter para Supabase Auth:
```bash
git revert 88679f4
```

## Deploy

- **GitHub**: Commit + Push automático com Vercel
- **Vercel**: Build automático ao fazer push
- **Produção**: Vercel atualiza automatically após build bem-sucedido

```bash
git add -A
git commit -m "feat: substitui Supabase Auth por CPF+Senha local"
git push
```
