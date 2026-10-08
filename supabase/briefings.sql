-- Bazana Digital · Briefing de projeto
-- Tabela dos briefings enviados por clientes em bazanadesign.com.br/briefing
-- Rodar uma vez no SQL Editor do projeto Supabase (o mesmo do diagnóstico/CRM).
--
-- Mesma lógica da tabela `leads`: todas as respostas em `respostas` (jsonb),
-- e alguns campos soltos só para facilitar filtro e busca no Studio/CRM.

create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  nome text,
  email text,
  whatsapp text,
  escritorio text,
  tipo_projeto text,
  respostas jsonb not null default '{}'::jsonb,
  origem text default 'briefing-juridico',
  -- para ligar o briefing ao lead de origem no CRM, quando houver
  lead_id uuid references public.leads(id) on delete set null,
  criado_em timestamptz not null default now()
);

create index if not exists briefings_criado_em_idx on public.briefings (criado_em desc);
create index if not exists briefings_email_idx on public.briefings (lower(email));

alter table public.briefings enable row level security;

-- O formulário só insere. Leitura fica restrita ao dashboard ou ao CRM autenticado.
create policy "briefings_insert_anon"
  on public.briefings
  for insert
  to anon
  with check (true);
