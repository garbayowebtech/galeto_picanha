/**
 * ==============================================================================
 * GALETO & PICANHA - CMS CLIENT (SUPABASE + LOCAL RESILIENCE)
 * Gerenciador centralizado dos 3 pontos do CMS:
 * 1. Destaques da Semana (Ticker Top Bar)
 * 2. Cardápio Completo (Categorias, Pratos, Preços e Fotos)
 * 3. Sessão de Eventos (Hero Floating & Mobile Section)
 * ==============================================================================
 */

(function (window) {
  'use strict';

  const STORAGE_KEY_DATA = 'gp_cms_data_cache';
  const STORAGE_KEY_URL = 'gp_supabase_url';
  const STORAGE_KEY_KEY = 'gp_supabase_key';
  const INITIAL_DATA_URL = 'data/cms-data.json';

  let supabaseClient = null;
  let isInitialized = false;
  let localCache = null;

  const DEFAULT_CMS_DATA = {
    destaques: [
      { id: 1, nome: "Galeto Dourado na Brasa", preco: "R$ 69,90", icone: "🍗", badge: "Mais Pedido", ativo: true, ordem: 1 },
      { id: 2, nome: "Picanha Nobre Fatiada na Chapa", preco: "R$ 138,90", icone: "🥩", badge: "Corte Nobre", ativo: true, ordem: 2 },
      { id: 3, nome: "Petisqueira Mista Especial", preco: "R$ 119,90", icone: "🍟", badge: "Happy Hour", ativo: true, ordem: 3 },
      { id: 4, nome: "Carne de Sol com Aipim na Manteiga", preco: "R$ 94,90", icone: "🥘", badge: "Tradição", ativo: true, ordem: 4 },
      { id: 5, nome: "Bobó de Camarão na Panela de Barro", preco: "R$ 114,90", icone: "🍤", badge: "Especial", ativo: true, ordem: 5 },
      { id: 6, nome: "Camarão Cremoso ao Catupiry", preco: "R$ 108,90", icone: "🍤", badge: "Gratinado", ativo: true, ordem: 6 },
      { id: 7, nome: "Peixe Inteiro Frito Crocante", preco: "R$ 102,90", icone: "🐟", badge: "Do Dia", ativo: true, ordem: 7 },
      { id: 8, nome: "O boi do Zé (Comida di Buteco)", preco: "R$ 35,00", icone: "🏆", badge: "Premiado", ativo: true, ordem: 8 },
      { id: 9, nome: "Queijo Coalho Grelhado no Melaço", preco: "R$ 29,90", icone: "🧀", badge: "Petisco", ativo: true, ordem: 9 },
      { id: 10, nome: "Balde Cervejas Puro Malte Nevadas", preco: "R$ 54,90", icone: "🍻", badge: "Trincando", ativo: true, ordem: 10 },
      { id: 11, nome: "Moscow Mule na Caneca de Cobre", preco: "R$ 32,90", icone: "🍹", badge: "Autoral", ativo: true, ordem: 11 },
      { id: 12, nome: "Coquetel Red Velvet Tropical", preco: "R$ 34,90", icone: "🍸", badge: "Refrescante", ativo: true, ordem: 12 }
    ],
    cardapio: [
      {
        id: 1,
        nome: "Galeto Dourado na Brasa Completo",
        categoria: "galeto",
        preco: "R$ 69,90",
        preco_label: "Valor sugerido",
        descricao: "Galeto jovem marinado em especiarias finas, assado lentamente na brasa viva até ficar com a pele super crocante e a carne extremamente macia e suculenta.",
        acompanhamentos: "Arroz de brócolis ao alho, batatas rústicas douradas, farofa de ovos e molho à campanha fresco.",
        serve: "Serve 2 pessoas",
        badge: "Campeão de Vendas",
        badge_tipo: "badge--red",
        imagem_url: "assets/imagens/2.webp",
        ativo: true,
        ordem: 1
      },
      {
        id: 2,
        nome: "Picanha Nobre na Brasa Fatiada",
        categoria: "carnes",
        preco: "R$ 138,90",
        preco_label: "Valor sugerido",
        descricao: "Corte especial com capa de gordura perfeita, grelhada no sal grosso no ponto que você preferir, finalizada com manteiga temperada e ramos de alecrim fresco.",
        acompanhamentos: "Arroz branco soltinho, batata frita crocante ou aipim, farofa da casa e vinagrete especial.",
        serve: "Serve 2 a 3 pessoas",
        badge: "Corte Nobre",
        badge_tipo: "badge--gold",
        imagem_url: "assets/imagens/8.webp",
        ativo: true,
        ordem: 2
      },
      {
        id: 3,
        nome: "Petisqueira Mista Especial",
        categoria: "petiscos",
        preco: "R$ 119,90",
        preco_label: "Valor sugerido",
        descricao: "A clássica tábua de happy hour do Grajaú: tiras de picanha macia, linguiça calabresa fatiada acebolada, iscas de frango empanadas super crocantes e batatas fritas sequinhas.",
        acompanhamentos: "Molho de alho artesanal da casa, geleia de pimenta e farofa crocante.",
        serve: "Serve 3 a 4 pessoas",
        badge: "Ideal p/ Grupos",
        badge_tipo: "badge--red",
        imagem_url: "assets/imagens/9.webp",
        ativo: true,
        ordem: 3
      },
      {
        id: 4,
        nome: "Carne de Sol Acebolada com Aipim",
        categoria: "carnes",
        preco: "R$ 94,90",
        preco_label: "Valor sugerido",
        descricao: "Carne de sol artesanal desfiada, puxada na frigideira com cebolas douradas na legítima manteiga de garrafa nordestina e aipim frito crocante por fora e macio por dentro.",
        acompanhamentos: "Arroz branco, feijão fradinho e farofa crocante de manteiga.",
        serve: "Serve 2 a 3 pessoas",
        badge: "Tradição",
        badge_tipo: "badge--soft-gold",
        imagem_url: "assets/imagens/6.webp",
        ativo: true,
        ordem: 4
      },
      {
        id: 5,
        nome: "Bobó de Camarão na Panela de Barro",
        categoria: "frutos-do-mar",
        preco: "R$ 114,90",
        preco_label: "Valor sugerido",
        descricao: "Camarões médios e grandes selecionados em creme aveludado de aipim, azeite de dendê puro, leite de coco fresco, pimentões coloridos e cheiro-verde, servido borbulhando.",
        acompanhamentos: "Arroz branco soltinho e farofa de dendê crocante.",
        serve: "Serve 2 pessoas",
        badge: "Receita Especial",
        badge_tipo: "badge--gold",
        imagem_url: "assets/imagens/5.webp",
        ativo: true,
        ordem: 5
      },
      {
        id: 6,
        nome: "Camarão Cremoso ao Catupiry",
        categoria: "frutos-do-mar",
        preco: "R$ 108,90",
        preco_label: "Valor sugerido",
        descricao: "Travessa de barro com camarões graúdos salteados ao alho e óleo, envolvidos em molho cremoso de Catupiry original e gratinados até dourarem perfeitamente.",
        acompanhamentos: "Arroz de brócolis ao azeite e batata palha artesanal fininha.",
        serve: "Serve 2 pessoas",
        badge: "Gratinado",
        badge_tipo: "badge--soft-gold",
        imagem_url: "assets/imagens/10.webp",
        ativo: true,
        ordem: 6
      },
      {
        id: 7,
        nome: "Peixe Inteiro Frito Crocante",
        categoria: "frutos-do-mar",
        preco: "R$ 102,90",
        preco_label: "Valor sugerido",
        descricao: "Peixe inteiro fresco temperado com limão taiti e ervas, empanado finamente e frito até alcançar crocância exterior incomparável com carne úmida e macia.",
        acompanhamentos: "Pirão de peixe saboroso, arroz branco e salada colorida vinagrete.",
        serve: "Serve 2 a 3 pessoas",
        badge: "Fresco do Dia",
        badge_tipo: "badge--red",
        imagem_url: "assets/imagens/11.webp",
        ativo: true,
        ordem: 7
      },
      {
        id: 8,
        nome: "O boi do Zé (Comida di Buteco)",
        categoria: "petiscos",
        preco: "R$ 35,00",
        preco_label: "Valor do Festival",
        descricao: "Costela bovina marinada no azeite com verduras e especiarias. Servido com um purê aligot, agrião, pimenta-biquinho e legumes assados.",
        acompanhamentos: "Purê aligot cremoso, agrião fresco, pimenta-biquinho e legumes assados.",
        serve: "Porção individual",
        badge: "Comida di Buteco",
        badge_tipo: "badge--gold",
        imagem_url: "assets/cdb/cdb_foto_oficial.jpg",
        ativo: true,
        ordem: 8
      },
      {
        id: 9,
        nome: "Queijo Coalho Grelhado no Melaço",
        categoria: "petiscos",
        preco: "R$ 29,90",
        preco_label: "Valor sugerido",
        descricao: "Espetos de queijo de coalho de alta qualidade dourados na brasa, servidos com fio de melaço de cana e toque de orégano fresco. Combinação perfeita com chope gelado.",
        acompanhamentos: "Harmonização ideal com Chope Pilsen artesanal trincando de gelado.",
        serve: "Porção individual / aperitivo",
        badge: "Clássico de Boteco",
        badge_tipo: "badge--soft-gold",
        imagem_url: "assets/imagens/1.webp",
        ativo: true,
        ordem: 9
      },
      {
        id: 10,
        nome: "Balde Puro Malte Trincando",
        categoria: "bebidas",
        preco: "R$ 54,90",
        preco_label: "A partir de",
        descricao: "Garrafas long neck ou 600ml estupidamente geladas (Spaten, Heineken, Stella Artois, Original e Amstel) servidas no balde de inox com gelo abundante na sua mesa.",
        acompanhamentos: "Servidas rigorosamente abaixo de zero.",
        serve: "Balde com 5 unidades",
        badge: "Nevadas",
        badge_tipo: "badge--green",
        imagem_url: "assets/imagens/4.webp",
        ativo: true,
        ordem: 10
      },
      {
        id: 11,
        nome: "Moscow Mule na Caneca de Cobre",
        categoria: "bebidas",
        preco: "R$ 32,90",
        preco_label: "Valor sugerido",
        descricao: "Vodka premium, suco de limão taiti espremido na hora, xarope de gengibre caseiro, finalizado com espuma artesanal aveludada de gengibre, raspas de limão e anis estrelado.",
        acompanhamentos: "Servido na autêntica caneca de cobre térmica.",
        serve: "Caneca de cobre 350ml",
        badge: "Drink Autoral",
        badge_tipo: "badge--gold",
        imagem_url: "assets/imagens/3.webp",
        ativo: true,
        ordem: 11
      },
      {
        id: 12,
        nome: "Coquetel Tropical Red Velvet",
        categoria: "bebidas",
        preco: "R$ 34,90",
        preco_label: "Valor sugerido",
        descricao: "Gin importado ou vodka, infusão de frutas vermelhas (amora, framboesa e morango), toque cítrico de pitaya rosa, xarope artesanal e cobertura aerada refrescante.",
        acompanhamentos: "Pode ser preparado sem álcool (Mocktail).",
        serve: "Taça 400ml",
        badge: "Refrescante",
        badge_tipo: "badge--red",
        imagem_url: "assets/imagens/7.webp",
        ativo: true,
        ordem: 12
      }
    ],
    eventos: [
      {
        id: 1,
        titulo: "Samba de Raiz & Feijoada Completa",
        subtitulo: "Roda de Samba do Grajaú com Chope Nevado",
        data_texto: "Todo Sábado",
        horario: "A partir das 13h",
        badge: "Música ao Vivo",
        icone: "🎵",
        descricao: "Venha curtir o melhor samba de raiz do bairro saboreando nossa premiada feijoada na panela de barro com couve mineira, torresmo crocante e chope trincando!",
        link_whatsapp_msg: "Olá, Galeto e Picanha! Gostaria de reservar uma mesa para o Samba de Raiz e Feijoada deste sábado.",
        imagem_url: "assets/imagens/1.webp",
        destaque_hero: true,
        ativo: true,
        ordem: 1
      },
      {
        id: 2,
        titulo: "Domingo de Picanha na Brasa & MPB",
        subtitulo: "Voz e Violão com Clássicos da MPB",
        data_texto: "Todo Domingo",
        horario: "13h às 17h",
        badge: "Ambiente Familiar",
        icone: "🥩",
        descricao: "O almoço perfeito para reunir a família no Grajaú: cortes nobres de picanha, galetos suculentos e música acústica de qualidade.",
        link_whatsapp_msg: "Olá, Galeto e Picanha! Gostaria de reservar uma mesa para o almoço de domingo com a família.",
        imagem_url: "assets/imagens/8.webp",
        destaque_hero: false,
        ativo: true,
        ordem: 2
      }
    ],
    config: {
      whatsapp_phone: "5521959261848",
      nome_restaurante: "Galeto & Picanha",
      endereco: "Rua Sá Viana, 148 - Grajaú, Rio de Janeiro - RJ"
    }
  };

  const CMS = {
    /**
     * Inicializa o cliente CMS (Supabase ou Local Fallback)
     */
    async init() {
      if (isInitialized) return localCache;

      // 1. Tenta carregar dados em cache local se existirem
      const cached = localStorage.getItem(STORAGE_KEY_DATA);
      if (cached) {
        try {
          localCache = JSON.parse(cached);
        } catch (e) {
          console.warn('[CMS] Erro ao ler cache local:', e);
          localCache = null;
        }
      }

      // Validação: se localCache não existir ou estiver vazio em qualquer categoria, hidrata com os dados padrão
      if (!localCache || !Array.isArray(localCache.eventos) || localCache.eventos.length === 0) {
        localCache = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA));
        this._saveLocalCache(localCache);
      } else {
        if (!Array.isArray(localCache.destaques) || localCache.destaques.length === 0) {
          localCache.destaques = DEFAULT_CMS_DATA.destaques;
        }
        if (!Array.isArray(localCache.cardapio) || localCache.cardapio.length === 0) {
          localCache.cardapio = DEFAULT_CMS_DATA.cardapio;
        }
      }

      // 3. Inicializa Supabase se credenciais estiverem disponíveis
      this._initSupabaseClient();

      // 4. Se o Supabase estiver configurado, tenta sincronizar dados da nuvem
      if (supabaseClient) {
        try {
          await this.syncFromSupabase();
        } catch (err) {
          console.warn('[CMS] Supabase configurado mas offline/erro, usando dados locais:', err);
        }
      }

      isInitialized = true;
      return localCache;
    },

    /**
     * Configura o cliente do Supabase
     */
    _initSupabaseClient() {
      let url = localStorage.getItem(STORAGE_KEY_URL) || 
                (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || '';
      const key = localStorage.getItem(STORAGE_KEY_KEY) || 
                  (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || '';

      if (url) {
        url = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      }

      if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          supabaseClient = window.supabase.createClient(url, key.trim());
          console.log('[CMS] Supabase conectado com sucesso! URL:', url);
        } catch (e) {
          console.error('[CMS] Falha ao criar cliente Supabase:', e);
          supabaseClient = null;
        }
      } else {
        supabaseClient = null;
      }
    },

    /**
     * Retorna o status de conexão
     */
    getStatus() {
      let url = localStorage.getItem(STORAGE_KEY_URL) || (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || '';
      if (url) {
        url = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      }
      return {
        hasCredentials: Boolean(url),
        connected: Boolean(supabaseClient),
        provider: supabaseClient ? 'supabase' : 'local',
        url: url ? url.replace(/https?:\/\//, '').split('.')[0] + '...' : ''
      };
    },

    /**
     * Salva novas credenciais do Supabase e reinicializa
     */
    async setSupabaseConfig(url, anonKey) {
      if (url) {
        const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
        localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
      } else {
        localStorage.removeItem(STORAGE_KEY_URL);
      }

      if (anonKey) {
        localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_KEY);
      }

      this._initSupabaseClient();
      if (supabaseClient) {
        await this.syncFromSupabase();
      }
      this._notifyUpdate();
      return this.getStatus();
    },

    /**
     * Sincroniza dados do Supabase para o cache local
     */
    async syncFromSupabase() {
      if (!supabaseClient) return;

      const [destaquesRes, cardapioRes, eventosRes] = await Promise.all([
        supabaseClient.from('destaques').select('*').order('ordem', { ascending: true }),
        supabaseClient.from('cardapio').select('*').order('ordem', { ascending: true }),
        supabaseClient.from('eventos').select('*').order('ordem', { ascending: true })
      ]);

      if (!destaquesRes.error && Array.isArray(destaquesRes.data) && destaquesRes.data.length > 0) {
        localCache.destaques = destaquesRes.data;
      }
      if (!cardapioRes.error && Array.isArray(cardapioRes.data) && cardapioRes.data.length > 0) {
        localCache.cardapio = cardapioRes.data;
      }
      if (!eventosRes.error && Array.isArray(eventosRes.data) && eventosRes.data.length > 0) {
        localCache.eventos = eventosRes.data;
      }

      this._saveLocalCache(localCache);
      this._notifyUpdate();
    },

    /* ==========================================================================
       1. DESTAQUES DA SEMANA (Ticker Top Bar)
       ========================================================================== */
    async getDestaques(onlyActive = true) {
      await this.init();
      let list = localCache?.destaques || [];
      if (onlyActive) {
        list = list.filter(item => item.ativo !== false);
      }
      return [...list].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    },

    async saveDestaque(item) {
      await this.init();
      item.ordem = Number(item.ordem) || (localCache.destaques.length + 1);
      item.ativo = item.ativo !== false;

      if (supabaseClient) {
        try {
          if (item.id && typeof item.id === 'number') {
            const { data, error } = await supabaseClient
              .from('destaques')
              .update(item)
              .eq('id', item.id)
              .select()
              .single();
            if (!error && data) item = data;
          } else {
            const { id, ...newItem } = item;
            const { data, error } = await supabaseClient
              .from('destaques')
              .insert([newItem])
              .select()
              .single();
            if (!error && data) item = data;
          }
        } catch (err) {
          console.warn('[CMS] Erro ao salvar destaque no Supabase, salvando localmente:', err);
        }
      }

      // Atualiza localmente
      if (!item.id) item.id = Date.now();
      const idx = localCache.destaques.findIndex(d => d.id === item.id);
      if (idx >= 0) {
        localCache.destaques[idx] = item;
      } else {
        localCache.destaques.push(item);
      }

      this._saveLocalCache(localCache);
      this._notifyUpdate();
      return item;
    },

    async deleteDestaque(id) {
      await this.init();
      if (supabaseClient) {
        try {
          await supabaseClient.from('destaques').delete().eq('id', id);
        } catch (err) {
          console.warn('[CMS] Erro ao deletar no Supabase:', err);
        }
      }

      localCache.destaques = localCache.destaques.filter(d => d.id !== id);
      this._saveLocalCache(localCache);
      this._notifyUpdate();
      return true;
    },

    /* ==========================================================================
       2. CARDÁPIO COMPLETO
       ========================================================================== */
    async getCardapio(onlyActive = true) {
      await this.init();
      let list = localCache?.cardapio || [];
      if (onlyActive) {
        list = list.filter(item => item.ativo !== false);
      }
      return [...list].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    },

    async savePrato(item) {
      await this.init();
      item.ordem = Number(item.ordem) || (localCache.cardapio.length + 1);
      item.ativo = item.ativo !== false;

      if (supabaseClient) {
        try {
          if (item.id && typeof item.id === 'number') {
            const { data, error } = await supabaseClient
              .from('cardapio')
              .update(item)
              .eq('id', item.id)
              .select()
              .single();
            if (!error && data) item = data;
          } else {
            const { id, ...newItem } = item;
            const { data, error } = await supabaseClient
              .from('cardapio')
              .insert([newItem])
              .select()
              .single();
            if (!error && data) item = data;
          }
        } catch (err) {
          console.warn('[CMS] Erro ao salvar prato no Supabase, salvando local:', err);
        }
      }

      // Atualiza localmente
      if (!item.id) item.id = Date.now();
      const idx = localCache.cardapio.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        localCache.cardapio[idx] = item;
      } else {
        localCache.cardapio.push(item);
      }

      this._saveLocalCache(localCache);
      this._notifyUpdate();
      return item;
    },

    async deletePrato(id) {
      await this.init();
      if (supabaseClient) {
        try {
          await supabaseClient.from('cardapio').delete().eq('id', id);
        } catch (err) {
          console.warn('[CMS] Erro ao deletar prato no Supabase:', err);
        }
      }

      localCache.cardapio = localCache.cardapio.filter(p => p.id !== id);
      this._saveLocalCache(localCache);
      this._notifyUpdate();
      return true;
    },

    /* ==========================================================================
       3. SESSÃO DE EVENTOS (Hero Floating & Mobile Section)
       ========================================================================== */
    async getEventos(onlyActive = true) {
      await this.init();
      let list = localCache?.eventos || [];
      if (onlyActive) {
        list = list.filter(item => item.ativo !== false);
      }
      return [...list].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
    },

    async getHeroEvent() {
      const eventos = await this.getEventos(true);
      // Retorna o primeiro evento ativo marcado com destaque_hero, ou o primeiro ativo
      return eventos.find(e => e.destaque_hero) || eventos[0] || null;
    },

    async saveEvento(item) {
      await this.init();
      item.ordem = Number(item.ordem) || (localCache.eventos.length + 1);
      item.ativo = item.ativo !== false;
      item.destaque_hero = item.destaque_hero !== false;

      if (supabaseClient) {
        try {
          if (item.id && typeof item.id === 'number') {
            const { data, error } = await supabaseClient
              .from('eventos')
              .update(item)
              .eq('id', item.id)
              .select()
              .single();
            if (!error && data) item = data;
          } else {
            const { id, ...newItem } = item;
            const { data, error } = await supabaseClient
              .from('eventos')
              .insert([newItem])
              .select()
              .single();
            if (!error && data) item = data;
          }
        } catch (err) {
          console.warn('[CMS] Erro ao salvar evento no Supabase, salvando local:', err);
        }
      }

      // Atualiza localmente
      if (!item.id) item.id = Date.now();
      const idx = localCache.eventos.findIndex(e => e.id === item.id);
      if (idx >= 0) {
        localCache.eventos[idx] = item;
      } else {
        localCache.eventos.push(item);
      }

      this._saveLocalCache(localCache);
      this._notifyUpdate();
      return item;
    },

    async deleteEvento(id) {
      await this.init();
      if (supabaseClient) {
        try {
          await supabaseClient.from('eventos').delete().eq('id', id);
        } catch (err) {
          console.warn('[CMS] Erro ao deletar evento no Supabase:', err);
        }
      }

      localCache.eventos = localCache.eventos.filter(e => e.id !== id);
      this._saveLocalCache(localCache);
      this._notifyUpdate();
      return true;
    },

    /**
     * Upload de imagem para o Supabase Storage ou conversão para Data URL local (fallback de cache)
     */
    async uploadImage(file, folder = 'eventos') {
      await this.init();

      // 1. Se o Supabase estiver conectado, tenta fazer o upload para o Storage
      if (supabaseClient && file) {
        try {
          const fileExt = file.name.split('.').pop() || 'webp';
          const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
          const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
          const filePath = `${folder}/${fileName}`;

          const { data, error } = await supabaseClient.storage
            .from('eventos')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });

          if (!error && data) {
            const { data: publicUrlData } = supabaseClient.storage
              .from('eventos')
              .getPublicUrl(filePath);

            if (publicUrlData && publicUrlData.publicUrl) {
              console.log('[CMS] Imagem enviada para o Supabase Storage:', publicUrlData.publicUrl);
              return { url: publicUrlData.publicUrl, source: 'supabase' };
            }
          } else {
            console.warn('[CMS] Storage bucket não acessível, usando fallback local:', error);
          }
        } catch (err) {
          console.warn('[CMS] Erro no upload Supabase Storage, usando fallback local:', err);
        }
      }

      // 2. Fallback para testes locais e modo offline: converte para Data URL (Base64)
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ url: e.target.result, source: 'local' });
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    },

    /* ==========================================================================
       UTILITÁRIOS: BACKUP, EXPORTAÇÃO & NOTIFICAÇÃO
       ========================================================================== */
    _saveLocalCache(data) {
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
      } catch (e) {
        console.warn('[CMS] Erro ao gravar local cache:', e);
      }
    },

    _notifyUpdate() {
      window.dispatchEvent(new CustomEvent('galeto:cms:updated', { detail: localCache }));
    },

    exportData() {
      return JSON.stringify(localCache, null, 2);
    },

    async importData(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.destaques && !parsed.cardapio && !parsed.eventos) {
          throw new Error('Formato de dados inválido.');
        }
        localCache = {
          destaques: parsed.destaques || [],
          cardapio: parsed.cardapio || [],
          eventos: parsed.eventos || [],
          config: parsed.config || {}
        };
        this._saveLocalCache(localCache);

        // Se Supabase estiver conectado, tenta sincronizar todas as tabelas
        if (supabaseClient) {
          try {
            if (localCache.destaques.length) await supabaseClient.from('destaques').upsert(localCache.destaques);
            if (localCache.cardapio.length) await supabaseClient.from('cardapio').upsert(localCache.cardapio);
            if (localCache.eventos.length) await supabaseClient.from('eventos').upsert(localCache.eventos);
          } catch (e) {
            console.warn('[CMS] Erro no upsert remoto ao importar:', e);
          }
        }

        this._notifyUpdate();
        return true;
      } catch (err) {
        console.error('[CMS] Erro ao importar dados:', err);
        throw err;
      }
    },

    async resetToDefault() {
      localStorage.removeItem(STORAGE_KEY_DATA);
      localCache = null;
      isInitialized = false;
      await this.init();
      this._notifyUpdate();
      return true;
    }
  };

  window.GaletoCMS = CMS;
})(window);
