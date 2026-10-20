-- ==============================================================================
-- GALETO & PICANHA - SUPABASE DATABASE SCHEMA
-- Execute este script no SQL Editor do seu projeto Supabase para criar as tabelas,
-- configurar as políticas de segurança (RLS) e inserir os dados iniciais.
-- ==============================================================================

-- 1. TABELA DE DESTAQUES DA SEMANA (Ticker Top Bar)
CREATE TABLE IF NOT EXISTS public.destaques (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco VARCHAR(50) NOT NULL,
  icone VARCHAR(10) DEFAULT '🍗',
  badge VARCHAR(100),
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DO CARDÁPIO COMPLETO
CREATE TABLE IF NOT EXISTS public.cardapio (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) NOT NULL, -- 'galeto', 'carnes', 'petiscos', 'frutos-do-mar', 'bebidas'
  preco VARCHAR(50) NOT NULL,
  preco_label VARCHAR(50) DEFAULT 'Valor sugerido',
  descricao TEXT,
  acompanhamentos TEXT,
  serve VARCHAR(100),
  badge VARCHAR(100),
  badge_tipo VARCHAR(50) DEFAULT 'badge--red', -- 'badge--red', 'badge--gold', 'badge--soft-gold', 'badge--green'
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE EVENTOS (Hero Floating & Mobile Section)
CREATE TABLE IF NOT EXISTS public.eventos (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  subtitulo VARCHAR(255),
  data_texto VARCHAR(100) NOT NULL, -- Ex: 'Todo Sábado' ou '25 de Outubro'
  horario VARCHAR(100) NOT NULL,    -- Ex: 'A partir das 13h'
  badge VARCHAR(100) DEFAULT 'Música ao Vivo',
  icone VARCHAR(10) DEFAULT '🎵',
  descricao TEXT,
  link_whatsapp_msg TEXT,
  imagem_url TEXT,
  destaque_hero BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Leitura pública para visitantes, edição restrita para administradores autenticados
-- ==============================================================================

ALTER TABLE public.destaques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardapio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública (Visitantes do site)
CREATE POLICY "Leitura pública de destaques ativos" 
  ON public.destaques FOR SELECT 
  USING (ativo = true OR auth.role() = 'authenticated');

CREATE POLICY "Leitura pública de pratos ativos" 
  ON public.cardapio FOR SELECT 
  USING (ativo = true OR auth.role() = 'authenticated');

CREATE POLICY "Leitura pública de eventos ativos" 
  ON public.eventos FOR SELECT 
  USING (ativo = true OR auth.role() = 'authenticated');

-- Permissões de gerenciamento (Admin / Painel CMS com anonKey ou authenticated):
CREATE POLICY "Gerenciamento de destaques" 
  ON public.destaques FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Gerenciamento de cardapio" 
  ON public.cardapio FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Gerenciamento de eventos" 
  ON public.eventos FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

-- ==============================================================================
-- 4. SUPABASE STORAGE (BUCKET PÚBLICO PARA IMAGENS DE EVENTOS)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('eventos', 'eventos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Permitir leitura pública dos arquivos de imagem
CREATE POLICY "Leitura pública de imagens de eventos" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'eventos');

-- Permitir upload de imagens no bucket
CREATE POLICY "Upload permitido de imagens em eventos" 
  ON storage.objects FOR INSERT 
  TO anon, authenticated
  WITH CHECK (bucket_id = 'eventos');

-- Permitir atualização e substituição
CREATE POLICY "Atualizacao de imagens em eventos" 
  ON storage.objects FOR UPDATE 
  TO anon, authenticated
  USING (bucket_id = 'eventos');

-- ==============================================================================
-- CARGA INICIAL DE DADOS (SEEDS)
-- ==============================================================================

INSERT INTO public.destaques (nome, preco, icone, badge, ativo, ordem) VALUES
('Galeto Dourado na Brasa', 'R$ 69,90', '🍗', 'Mais Pedido', true, 1),
('Picanha Nobre Fatiada na Chapa', 'R$ 138,90', '🥩', 'Corte Nobre', true, 2),
('Petisqueira Mista Especial', 'R$ 119,90', '🍟', 'Happy Hour', true, 3),
('Carne de Sol com Aipim na Manteiga', 'R$ 94,90', '🥘', 'Tradição', true, 4),
('Bobó de Camarão na Panela de Barro', 'R$ 114,90', '🍤', 'Especial', true, 5),
('Camarão Cremoso ao Catupiry', 'R$ 108,90', '🍤', 'Gratinado', true, 6),
('Peixe Inteiro Frito Crocante', 'R$ 102,90', '🐟', 'Do Dia', true, 7),
('O boi do Zé (Comida di Buteco)', 'R$ 35,00', '🏆', 'Premiado', true, 8),
('Queijo Coalho Grelhado no Melaço', 'R$ 29,90', '🧀', 'Petisco', true, 9),
('Balde Cervejas Puro Malte Nevadas', 'R$ 54,90', '🍻', 'Trincando', true, 10),
('Moscow Mule na Caneca de Cobre', 'R$ 32,90', '🍹', 'Autoral', true, 11),
('Coquetel Red Velvet Tropical', 'R$ 34,90', '🍸', 'Refrescante', true, 12)
ON CONFLICT DO NOTHING;

INSERT INTO public.cardapio (nome, categoria, preco, preco_label, descricao, acompanhamentos, serve, badge, badge_tipo, imagem_url, ativo, ordem) VALUES
('Galeto Dourado na Brasa Completo', 'galeto', 'R$ 69,90', 'Valor sugerido', 'Galeto jovem marinado em especiarias finas, assado lentamente na brasa viva até ficar com a pele super crocante e a carne extremamente macia e suculenta.', 'Arroz de brócolis ao alho, batatas rústicas douradas, farofa de ovos e molho à campanha fresco.', 'Serve 2 pessoas', 'Campeão de Vendas', 'badge--red', 'assets/imagens/2.webp', true, 1),
('Picanha Nobre na Brasa Fatiada', 'carnes', 'R$ 138,90', 'Valor sugerido', 'Corte especial com capa de gordura perfeita, grelhada no sal grosso no ponto que você preferir, finalizada com manteiga temperada e ramos de alecrim fresco.', 'Arroz branco soltinho, batata frita crocante ou aipim, farofa da casa e vinagrete especial.', 'Serve 2 a 3 pessoas', 'Corte Nobre', 'badge--gold', 'assets/imagens/8.webp', true, 2),
('Petisqueira Mista Especial', 'petiscos', 'R$ 119,90', 'Valor sugerido', 'A clássica tábua de happy hour do Grajaú: tiras de picanha macia, linguiça calabresa fatiada acebolada, iscas de frango empanadas super crocantes e batatas fritas sequinhas.', 'Molho de alho artesanal da casa, geleia de pimenta e farofa crocante.', 'Serve 3 a 4 pessoas', 'Ideal p/ Grupos', 'badge--red', 'assets/imagens/9.webp', true, 3),
('Carne de Sol Acebolada com Aipim', 'carnes', 'R$ 94,90', 'Valor sugerido', 'Carne de sol artesanal desfiada, puxada na frigideira com cebolas douradas na legítima manteiga de garrafa nordestina e aipim frito crocante por fora e macio por dentro.', 'Arroz branco, feijão fradinho e farofa crocante de manteiga.', 'Serve 2 a 3 pessoas', 'Tradição', 'badge--soft-gold', 'assets/imagens/6.webp', true, 4),
('Bobó de Camarão na Panela de Barro', 'frutos-do-mar', 'R$ 114,90', 'Valor sugerido', 'Camarões médios e grandes selecionados em creme aveludado de aipim, azeite de dendê puro, leite de coco fresco, pimentões coloridos e cheiro-verde, servido borbulhando.', 'Arroz branco soltinho e farofa de dendê crocante.', 'Serve 2 pessoas', 'Receita Especial', 'badge--gold', 'assets/imagens/5.webp', true, 5),
('Camarão Cremoso ao Catupiry', 'frutos-do-mar', 'R$ 108,90', 'Valor sugerido', 'Travessa de barro com camarões graúdos salteados ao alho e óleo, envolvidos em molho cremoso de Catupiry original e gratinados até dourarem perfeitamente.', 'Arroz de brócolis ao azeite e batata palha artesanal fininha.', 'Serve 2 pessoas', 'Gratinado', 'badge--soft-gold', 'assets/imagens/10.webp', true, 6),
('Peixe Inteiro Frito Crocante', 'frutos-do-mar', 'R$ 102,90', 'Valor sugerido', 'Peixe inteiro fresco temperado com limão taiti e ervas, empanado finamente e frito até alcançar crocância exterior incomparável com carne úmida e macia.', 'Pirão de peixe saboroso, arroz branco e salada colorida vinagrete.', 'Serve 2 a 3 pessoas', 'Fresco do Dia', 'badge--red', 'assets/imagens/11.webp', true, 7),
('O boi do Zé (Comida di Buteco)', 'petiscos', 'R$ 35,00', 'Valor do Festival', 'Costela bovina marinada no azeite com verduras e especiarias. Servido com um purê aligot, agrião, pimenta-biquinho e legumes assados.', 'Purê aligot cremoso, agrião fresco, pimenta-biquinho e legumes assados.', 'Porção individual', 'Comida di Buteco', 'badge--gold', 'assets/cdb/cdb_foto_oficial.jpg', true, 8),
('Queijo Coalho Grelhado no Melaço', 'petiscos', 'R$ 29,90', 'Valor sugerido', 'Espetos de queijo de coalho de alta qualidade dourados na brasa, servidos com fio de melaço de cana e toque de orégano fresco. Combinação perfeita com chope gelado.', 'Harmonização ideal com Chope Pilsen artesanal trincando de gelado.', 'Porção individual / aperitivo', 'Clássico de Boteco', 'badge--soft-gold', 'assets/imagens/1.webp', true, 9),
('Balde Puro Malte Trincando', 'bebidas', 'R$ 54,90', 'A partir de', 'Garrafas long neck ou 600ml estupidamente geladas (Spaten, Heineken, Stella Artois, Original e Amstel) servidas no balde de inox com gelo abundante na sua mesa.', 'Servidas rigorosamente abaixo de zero.', 'Balde com 5 unidades', 'Nevadas', 'badge--green', 'assets/imagens/4.webp', true, 10),
('Moscow Mule na Caneca de Cobre', 'bebidas', 'R$ 32,90', 'Valor sugerido', 'Vodka premium, suco de limão taiti espremido na hora, xarope de gengibre caseiro, finalizado com espuma artesanal aveludada de gengibre, raspas de limão e anis estrelado.', 'Servido na autêntica caneca de cobre térmica.', 'Caneca de cobre 350ml', 'Drink Autoral', 'badge--gold', 'assets/imagens/3.webp', true, 11),
('Coquetel Tropical Red Velvet', 'bebidas', 'R$ 34,90', 'Valor sugerido', 'Gin importado ou vodka, infusão de frutas vermelhas (amora, framboesa e morango), toque cítrico de pitaya rosa, xarope artesanal e cobertura aerada refrescante.', 'Pode ser preparado sem álcool (Mocktail).', 'Taça 400ml', 'Refrescante', 'badge--red', 'assets/imagens/7.webp', true, 12)
ON CONFLICT DO NOTHING;

INSERT INTO public.eventos (titulo, subtitulo, data_texto, horario, badge, icone, descricao, link_whatsapp_msg, imagem_url, destaque_hero, ativo, ordem) VALUES
('Samba de Raiz & Feijoada Completa', 'Roda de Samba do Grajaú com Chope Nevado', 'Todo Sábado', 'A partir das 13h', 'Música ao Vivo', '🎵', 'Venha curtir o melhor samba de raiz do bairro saboreando nossa premiada feijoada na panela de barro com couve mineira, torresmo crocante e chope trincando!', 'Olá, Galeto e Picanha! Gostaria de reservar uma mesa para o Samba de Raiz e Feijoada deste sábado.', 'assets/imagens/1.webp', true, true, 1),
('Domingo de Picanha na Brasa & MPB', 'Voz e Violão com Clássicos da MPB', 'Todo Domingo', '13h às 17h', 'Ambiente Familiar', '🥩', 'O almoço perfeito para reunir a família no Grajaú: cortes nobres de picanha, galetos suculentos e música acústica de qualidade.', 'Olá, Galeto e Picanha! Gostaria de reservar uma mesa para o almoço de domingo com a família.', 'assets/imagens/8.webp', false, true, 2)
ON CONFLICT DO NOTHING;
