# Checklist de Arquivos Obrigatórios por Cenário — Galeto & Picanha

Sempre que realizar uma manutenção ou nova funcionalidade, consulte o cenário correspondente para garantir que **nenhum arquivo dependente seja esquecido**.

---

## 🍗 Cenário 1: Novo Prato ou Alteração no Cardápio
*Exemplo: Cadastrar um novo prato em destaque na Home ou alterar preços/guarnições.*

Sempre sincronizar:
1. **Banco Supabase**: Tabela `cardapio` via `supabase/schema.sql` (ou painel `admin.html`).
2. **Fallback Local**:
   - `data/cms-data.json`: Adicionar/atualizar o item no array `cardapio`.
   - `js/cms.js`: Manter o objeto `DEFAULT_CMS_DATA.cardapio` sincronizado.
3. **Cardápio Completo Estático**:
   - `data/cardapio-completo.json`: Se o item pertencer ao catálogo completo de 100+ itens, atualizar o JSON com `nome`, `preco`, `descricao` e `categoria`.
4. **Imagens**:
   - Colocar foto otimizada em `assets/imagens/` exclusivamente no formato `.webp`.
5. **Painel Admin**:
   - `admin.html`: Verificar se a categoria do prato existe nos filtros da aba *Cardápio Completo*.

---

## 🌟 Cenário 2: Novo Destaque da Semana (Ticker Top Bar)
*Exemplo: Inserir promoção de prato, chope ou drink no ticker superior deslizante.*

Sempre sincronizar:
1. **Banco Supabase**: Tabela `destaques` via `supabase/schema.sql` (ou painel `admin.html`).
2. **Fallback Local**:
   - `data/cms-data.json`: Adicionar/atualizar no array `destaques`.
   - `js/cms.js`: Atualizar em `DEFAULT_CMS_DATA.destaques`.
3. **Campos Obrigatórios**: `nome`, `preco`, `icone` (emoji como 🍗, 🥩, 🍺), `badge` (ex: Mais Pedido, Happy Hour), `ativo` e `ordem`.

---

## 📅 Cenário 3: Evento, Show ou Roda de Samba
*Exemplo: Atualizar atração de sábado ou domingo flutuante no Hero.*

Sempre sincronizar:
1. **Banco Supabase**: Tabela `eventos` (e bucket Storage `eventos` se houver upload de banner).
2. **Fallback Local**:
   - `data/cms-data.json`: Array `eventos`.
   - `js/cms.js`: Array `DEFAULT_CMS_DATA.eventos`.
3. **Hero & Mobile**:
   - O item com `destaque_hero: true` é renderizado tanto no card flutuante do desktop (`index.html`) quanto na seção dedicada mobile.
   - Mensagem de WhatsApp: Atualizar `link_whatsapp_msg` para reserva automática de mesa.

---

## 🎨 Cenário 4: Alteração de Estilos CSS ou Scripts
*Exemplo: Ajustes no header, menu mobile, carrossel ou cores do tema.*

Sempre verificar:
1. **Cache-Busting**:
   - Em `index.html`, incrementar a query string do arquivo alterado (ex: `css/navbar.css?v=7`, `js/main.js?v=9`).
2. **Segurança e Cache em Servidor**:
   - Verificar conformidade no arquivo `_headers` para garantir que arquivos com query string recebam headers de cache apropriados.
3. **Painel CMS**:
   - Se o script alterado for `js/cms.js`, atualizar também a importação em `admin.html`.
