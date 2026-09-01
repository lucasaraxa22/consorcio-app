-- Script de criação do banco de dados
-- Cole este código no Supabase: menu "SQL Editor" > "New query" > Run

-- Tabela de Leads/Clientes (Módulo 1 do MVP)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  nome text not null,
  telefone text,
  email text,
  interesse text,
  valor_credito_desejado numeric,
  status text not null default 'novo'
    check (status in ('novo','em_contato','simulacao_enviada','proposta_enviada','fechado','perdido')),
  observacoes text
);

-- Segurança: habilita "Row Level Security" (o Supabase exige isso)
alter table leads enable row level security;

-- Por enquanto, como só existe você usando o sistema, liberamos acesso total.
-- Quando adicionarmos login de vários vendedores, vamos trocar esta regra
-- para "cada vendedor só vê os próprios leads".
create policy "Acesso total por enquanto"
  on leads
  for all
  using (true)
  with check (true);
