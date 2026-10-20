# Galeto & Picanha — Website Institucional & CMS

Website oficial e de alta performance do **Galeto & Picanha**, tradicional bar e restaurante localizado no Grajaú, Rio de Janeiro - RJ.

Desenvolvido por **Garbayowebtech.com**.

---

## 🚀 Tecnologias Utilizadas

- **HTML5 Semântico**: Estruturação acessível com SEO técnico completo (JSON-LD Schema, Open Graph e Twitter Cards).
- **CSS3 Moderno**: Variáveis CSS, layout responsivo (Mobile-First), animações fluidas e suporte a temas.
- **JavaScript Vanilla (ES6+)**: Performance máxima sem dependências pesadas, scroll throttling com `requestAnimationFrame` e lazy loading de mídia.
- **Supabase (Backend Serverless)**:
  - Banco de Dados PostgreSQL na nuvem para sincronização em tempo real.
  - Row Level Security (RLS) para proteção das tabelas.
  - Supabase Storage para armazenamento de fotos de eventos.
  - Fallback local automático (`localStorage` + `cms-data.json`) para operação contínua e offline.

---

## 📂 Estrutura do Projeto

```text
galeto_picanha/
├── admin.html               # Painel administrativo CMS (destaques, cardápio, eventos e Supabase)
├── cardapio-completo.html   # Página do cardápio completo com busca instantânea e categorias
├── index.html               # Landing page principal com vídeo hero, destaques e mapa
├── robots.txt               # Diretrizes para indexadores de busca
├── sitemap.xml              # Mapa do site para SEO
├── site.webmanifest         # Configuração de PWA e ícones
├── assets/                  # Mídias e imagens otimizadas em formato WebP
│   ├── cdb/                 # Fotos do festival Comida di Buteco
│   ├── imagens/             # Fotos dos pratos e ambiente (WebP)
│   └── videos/              # Vídeo do hero e animação da marca
├── css/                     # Folhas de estilo modulares
│   ├── cardapio.css
│   ├── components.css
│   ├── footer.css
│   ├── global.css
│   ├── hero.css
│   ├── navbar.css
│   ├── sections.css
│   └── themes.css
├── data/                    # Dados e catálogos locais de fallback
│   ├── cardapio-completo.json
│   └── cms-data.json
├── js/                      # Lógica da aplicação
│   ├── cms.js               # Cliente unificado de CMS (Supabase + Local Cache)
│   ├── main.js              # Interações da UI, carrosséis, modals e menu mobile
│   └── supabase-config.js   # Credenciais do Supabase
└── supabase/
    └── schema.sql           # Script SQL para criação das tabelas, RLS e dados iniciais
```

---

## ⚡ Como Rodar Localmente

Por ser uma aplicação web estática com JavaScript modular, você pode abrir diretamente com qualquer servidor local:

### Usando Python:
```bash
python -m http.server 8000
```
Acesse: `http://localhost:8000`

### Usando Node.js (npx serve / live-server):
```bash
npx serve .
```

---

## 🛠️ Painel CMS (`admin.html`)

O painel administrativo permite gerenciar dinamicamente:
1. **Destaques da Semana**: Ticker deslizante do topo (Trending Bar).
2. **Cardápio Principal**: Pratos, preços, guarnições, badges e imagens.
3. **Eventos & Shows**: Card flutuante sobre o hero de vídeo e seção mobile.
4. **Configuração Supabase**: Conectar, desconectar ou alterar credenciais.
5. **Backup & Restauração**: Download e upload de arquivos `cms-data.json`.

---

## 📄 Licença & Direitos

Todos os direitos reservados a **Galeto & Picanha** e **Garbayowebtech.com**.
Operação e atendimento no Grajaú, Rio de Janeiro - RJ.
