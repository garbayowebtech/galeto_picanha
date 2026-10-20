# Diretrizes para Agentes de IA — Galeto & Picanha

Este repositório contém o código-fonte do website oficial e painel CMS do **Galeto & Picanha**, tradicional bar e restaurante especializado em galeto dourado na brasa, cortes nobres de picanha e petiscos no bairro do Grajaú, Rio de Janeiro - RJ.

---

## 🏛️ Arquitetura & Stack Tecnológica

- **Frontend Principal:** HTML5 semântico acessível, Vanilla JavaScript (ES6+ modular) e Vanilla CSS.
- **Backend / Persistência:** Supabase (PostgreSQL 15+) com Row Level Security (RLS) ativo e Supabase Storage (bucket `eventos`).
- **Resiliência e Cache:** Arquitetura dual em `js/cms.js` que sincroniza com o Supabase quando online e mantém cache local (`localStorage` + `data/cms-data.json`) sem nunca quebrar o site para os clientes.
- **Painel Administrativo:** `admin.html` (SPA estática com autenticação e gestão de Ticker Top Bar, Cardápio, Eventos, Configurações do Supabase e Backup JSON).
- **Estilização:** **Vanilla CSS**. Não utilize TailwindCSS. Respeite os tokens de cor, tipografia e espaçamento em `css/themes.css`, `css/global.css`, `css/navbar.css` e `css/hero.css`.
- **Mídias Otimizadas:** Todas as imagens devem ser obrigatoriamente no formato `.webp` moderno e com dimensões declaradas para evitar layout shift.

---

## 📋 Regras Cruciais para Agentes

1. **Consulte as Regras Específicas antes de qualquer ação**:
   - Fluxo de branches e commits: [`.agents/rules/git-workflow.md`](.agents/rules/git-workflow.md)
   - Ciclo de vida e regras de desenvolvimento: [`.agents/rules/workflow.md`](.agents/rules/workflow.md)
   - Mapeamento de interdependências de arquivos: [`.agents/rules/checklist_arquivos.md`](.agents/rules/checklist_arquivos.md)

2. **Banco de Dados & Supabase**:
   - Todas as tabelas (`destaques`, `cardapio`, `eventos`) e RLS policies estão em `supabase/schema.sql`.
   - Modificações estruturais devem ser idempotentes (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).
   - Nunca exponha chaves secretas (`service_role`). Use apenas a chave pública `anon`.

3. **Validação Obrigatória**:
   - Não deixe console logs residuais desnecessários.
   - Sempre valide sintaxe e referências de imagens/links antes de finalizar seu turno.

4. **Cache-Busting**:
   - Ao alterar CSS ou JS em `index.html` ou `admin.html`, atualize o parâmetro de versão na query string (ex: `js/cms.js?v=4`).
