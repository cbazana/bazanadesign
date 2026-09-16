# bazanadesign.com.br

Repositório do domínio. Por enquanto só o formulário de diagnóstico; a raiz (`/`) fica reservada para o site institucional que entra depois.

## Estrutura
- `diagnostico/` — formulário de diagnóstico (nicho jurídico), estático (HTML/CSS/JS), tema dark, identidade Bazana Digital. Fica publicado em `bazanadesign.com.br/diagnostico`. Envia leads para Supabase e mostra agendamento via Cal.com na tela final.
- `vercel.json` — `cleanUrls` ligado, pra `/diagnostico` funcionar sem precisar da barra no final
- `supabase/schema.sql` — schema da tabela `leads` + policy de RLS (já rodado no projeto Supabase)

Quando o site institucional existir, ele entra na raiz do repo (`index.html` na raiz, mais os assets dele) — sem mexer em `diagnostico/`.

## Diagnóstico — detalhes
- `diagnostico/index.html` — página única, form multi-etapa (uma pergunta por tela)
- `diagnostico/css/styles.css` — tokens do design system + componentes
- `diagnostico/js/form.js` — navegação entre perguntas, validação, coleta de respostas
- `diagnostico/js/supabase-client.js` — envio para Supabase (credenciais já configuradas)
- `diagnostico/js/cal-embed.js` — embed do Cal.com na tela final (link já configurado)

## Deploy (Vercel)
Projeto estático — sem build step, framework preset "Other". Import direto do repositório GitHub. Domínio customizado (`bazanadesign.com.br`) configurado em Project Settings → Domains, com DNS apontado pro Vercel no registrador.

## Pendente
- [x] Perguntas do diagnóstico (10, com campos condicionais em "Área de atuação" e "Possui site")
- [x] Credenciais do Supabase
- [x] Link do Cal.com
- [ ] Repositório GitHub + deploy Vercel
- [ ] Domínio bazanadesign.com.br apontado no Vercel
