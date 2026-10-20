# Workflow de Desenvolvimento e Atualizações — Galeto & Picanha

Este documento define o fluxo de trabalho oficial para qualquer manutenção, ajuste visual ou nova funcionalidade no projeto **Galeto & Picanha**.

---

## 1. Princípios do Projeto

1. **Arquitetura Resiliente**:
   - O site NUNCA deve quebrar caso o Supabase esteja temporariamente inacessível. O arquivo `js/cms.js` deve manter fallback para `localStorage` e dados padrão em `data/cms-data.json`.
2. **Formato Exclusivo de Mídia (WebP)**:
   - Todas as fotos de pratos, logos e imagens devem ser `.webp` otimizadas. Proibido commitar arquivos `.png` brutos com mais de 500 KB na pasta `assets/`.
3. **Idempotência no Banco de Dados**:
   - Qualquer ajuste em `supabase/schema.sql` deve usar `IF NOT EXISTS` e `ON CONFLICT DO NOTHING / UPDATE`.
4. **Mobile First & Performance 60fps**:
   - Animações e transições devem usar `transform` e `opacity`. O scroll listener do header sticky deve ser throttled com `requestAnimationFrame`.

---

## 2. Fluxo Obrigatório de Atualização

### Passo 1: Mapeamento de Impacto
- Antes de alterar o código, verifique o checklist em [checklist_arquivos.md](checklist_arquivos.md) para garantir que todas as interdependências sejam contempladas.

### Passo 2: Banco de Dados / Supabase
- Se envolver novo campo ou nova tabela:
  1. Atualizar `supabase/schema.sql`.
  2. Atualizar o objeto `DEFAULT_CMS_DATA` em `js/cms.js`.
  3. Atualizar o arquivo de fallback `data/cms-data.json`.
  4. Atualizar os formulários de edição e exibição em `admin.html`.

### Passo 3: Frontend e Design System
- Respeitar estritamente as variáveis de `css/themes.css` (Cores Vermelho/Dourado/Preto do Galeto & Picanha).
- Nunca usar classes utilitárias fora do padrão ou frameworks externos como TailwindCSS.

### Passo 4: Validação & Testes
- Abrir localmente o site e o painel `admin.html` para validar visualmente.
- Inspecionar o console do navegador para garantir que não há erros de CORS, 404 de imagens ou quebra de scripts.
- Conferir `git status` para assegurar que apenas os arquivos desejados foram alterados.
