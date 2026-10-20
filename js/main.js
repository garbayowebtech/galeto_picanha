/**
 * ==============================================================================
 * GALETO & PICANHA - MAIN JAVASCRIPT
 * Interatividades: Hero Video Controls, Sticky Navbar & Scrollspy, Mobile Drawer,
 * Cardápio Dinâmico com Busca & Filtros, Lightbox de Galeria, Gerador de Pedido/Reserva
 * via WhatsApp, FAQ Accordion, Copiar Endereço e Acessibilidade WCAG.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializa o CMS primeiro se disponível
  if (window.GaletoCMS) {
    try {
      await window.GaletoCMS.init();
    } catch (e) {
      console.warn('[Main] Falha na inicialização do CMS:', e);
    }
  }

  initTrendingCardapio();
  initHeroVideo();
  initStickyHeader();
  initMobileDrawer();
  initCardapio();
  initHeroEvents();
  initCdbCarousel();
  initGalleryCarousel();
  initGalleryLightbox();
  initReservationForm();
  initFAQ();
  initCopyAddress();
  initBackToTop();
  initPrivacyModal();
  initFaqModal();
  initCardapioCompletoModal();

  // Escuta atualizações do CMS para re-renderização em tempo real
  window.addEventListener('galeto:cms:updated', () => {
    initTrendingCardapio();
    initCardapio();
    initHeroEvents();
  });
});

/* Constante Central de WhatsApp */
const WA_PHONE = '5521959261848';

/**
 * 1. HERO VIDEO CONTROLS (Referência Casa 137)
 * Play/Pause e Mute/Unmute com ícones dinâmicos e controle de acessibilidade
 */
function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  const toggleBtn = document.getElementById('heroVideoToggle');
  const muteBtn = document.getElementById('heroMuteToggle');

  if (!video) return;

  // Garante autoplay sem som
  video.muted = true;
  video.play().catch(() => {
    // Caso o navegador bloqueie autoplay, exibe o estado pausado
    if (toggleBtn) updatePlayIcon(false);
  });

  // Alternar Play / Pause
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        updatePlayIcon(true);
      } else {
        video.pause();
        updatePlayIcon(false);
      }
    });
  }

  function updatePlayIcon(isPlaying) {
    if (!toggleBtn) return;
    const iconPause = toggleBtn.querySelector('.icon-pause');
    const iconPlay = toggleBtn.querySelector('.icon-play');
    if (isPlaying) {
      if (iconPause) iconPause.style.display = 'block';
      if (iconPlay) iconPlay.style.display = 'none';
      toggleBtn.setAttribute('aria-label', 'Pausar vídeo');
      toggleBtn.setAttribute('title', 'Pausar vídeo');
    } else {
      if (iconPause) iconPause.style.display = 'none';
      if (iconPlay) iconPlay.style.display = 'block';
      toggleBtn.setAttribute('aria-label', 'Reproduzir vídeo');
      toggleBtn.setAttribute('title', 'Reproduzir vídeo');
    }
  }

  // Alternar Mudo / Com Áudio
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      const iconMuted = muteBtn.querySelector('.icon-muted');
      const iconAudio = muteBtn.querySelector('.icon-audio');
      if (video.muted) {
        if (iconMuted) iconMuted.style.display = 'block';
        if (iconAudio) iconAudio.style.display = 'none';
        muteBtn.setAttribute('aria-label', 'Ativar som do vídeo');
        muteBtn.setAttribute('title', 'Ativar áudio');
      } else {
        if (iconMuted) iconMuted.style.display = 'none';
        if (iconAudio) iconAudio.style.display = 'block';
        muteBtn.setAttribute('aria-label', 'Desativar som do vídeo');
        muteBtn.setAttribute('title', 'Desativar áudio');
      }
    });
  }
}

/**
 * 2. STICKY HEADER & SCROLLSPY
 */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-menu__link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // Efeito de shrink no scroll
        if (scrollY > 30) {
          if (!header.classList.contains('scrolled')) header.classList.add('scrolled');
        } else {
          if (header.classList.contains('scrolled')) header.classList.remove('scrolled');
        }

        // Scrollspy
        let current = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 120;
          const sectionHeight = section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          const isTarget = link.getAttribute('href') === `#${current}`;
          if (isTarget) {
            if (!link.classList.contains('active')) link.classList.add('active');
          } else {
            if (link.classList.contains('active')) link.classList.remove('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 3. MOBILE DRAWER NAVIGATION (Referência Casa 137)
 */
function initMobileDrawer() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');
  const closeBtn = document.getElementById('navMenuClose');
  const backdrop = document.getElementById('navBackdrop');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Fecha ao clicar em qualquer link interno
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha ao clicar fora do menu drawer
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Fecha no Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 4. CARDÁPIO DINÂMICO INTEGRADO AO CMS COM FILTROS & BUSCA EM TEMPO REAL
 */
async function initCardapio() {
  const grid = document.getElementById('cardapioGrid');
  const tabs = document.querySelectorAll('.menu-tab, .tab-btn');
  const searchInput = document.getElementById('cardapioSearch');
  const emptyState = document.getElementById('cardapioEmpty');

  const CAT_LABELS = {
    'galeto': 'Galetos na Brasa',
    'carnes': 'Picanhas & Carnes',
    'petiscos': 'Petiscos de Botequim',
    'frutos-do-mar': 'Frutos do Mar',
    'bebidas': 'Bebidas & Drinks'
  };

  if (grid && window.GaletoCMS) {
    try {
      const pratos = await window.GaletoCMS.getCardapio(true);
      if (pratos && pratos.length > 0) {
        grid.innerHTML = pratos.map((dish, idx) => renderDishCard(dish, idx)).join('');
      }
    } catch (e) {
      console.warn('[Main] Erro ao carregar pratos do CMS, mantendo estáticos:', e);
    }
  }

  function renderDishCard(dish, index) {
    const badgeClass = dish.badge_tipo || 'badge--red';
    const num = String((index !== undefined ? index + 1 : 1)).padStart(2, '0');
    const catLabel = CAT_LABELS[dish.categoria] || dish.categoria || '';
    const hasPhoto = Boolean(dish.imagem_url && dish.imagem_url.trim());

    return `
      <article class="menu-card dish-card ${hasPhoto ? '' : 'menu-card--no-photo'}" data-category="${dish.categoria}">
        ${hasPhoto ? `
          <img src="${dish.imagem_url}" alt="${dish.nome}" class="menu-card__img" width="600" height="600" loading="lazy">
          <div class="menu-card__shade" aria-hidden="true"></div>
        ` : `
          <div class="menu-card__no-photo-badge" aria-hidden="true">
            <span class="no-photo-icon">🍽</span>
          </div>
        `}
        <div class="menu-card__top">
          ${dish.badge ? `<span class="badge ${badgeClass}">${dish.badge}</span>` : '<span></span>'}
          ${dish.serve ? `<span class="menu-card__serves">${dish.serve}</span>` : ''}
        </div>
        <div class="menu-card__content">
          <span class="menu-card__kicker"><span class="menu-card__num">${num}</span>${catLabel}</span>
          <h3 class="menu-card__title">${dish.nome}</h3>
          <p class="menu-card__desc">${dish.descricao || ''}</p>
          ${dish.acompanhamentos ? `
            <div class="menu-card__acomp">
              <strong>Guarnições inclusas:</strong> ${dish.acompanhamentos}
            </div>` : ''}
          <div class="menu-card__footer">
            <div class="menu-card__price">
              <small>${dish.preco_label || 'Preço'}</small>
              <strong>${dish.preco}</strong>
            </div>
            <button type="button" class="menu-card__order dish-card__btn" data-dish="${dish.nome}" aria-label="Pedir ${dish.nome} no WhatsApp">
              Pedir
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  const paginationContainer = document.getElementById('cardapioPagination');
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let activeCategory = 'todos';
  let searchTerm = '';

  function renderPagination(totalPages) {
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      paginationContainer.style.display = 'none';
      return;
    }

    paginationContainer.style.display = 'flex';

    let html = `
      <button type="button" class="menu-page-btn menu-page-btn--nav" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled aria-disabled="true"' : ''} aria-label="Página anterior">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        <span>Anterior</span>
      </button>
      <div class="menu-page-numbers">
    `;

    for (let p = 1; p <= totalPages; p++) {
      html += `
        <button type="button" class="menu-page-btn menu-page-number ${p === currentPage ? 'is-active' : ''}" data-page="${p}" aria-label="Ir para a página ${p}" ${p === currentPage ? 'aria-current="page"' : ''}>
          ${p}
        </button>
      `;
    }

    html += `
      </div>
      <button type="button" class="menu-page-btn menu-page-btn--nav" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled aria-disabled="true"' : ''} aria-label="Próxima página">
        <span>Próxima</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    paginationContainer.innerHTML = html;
  }

  function filterCards() {
    const cards = Array.from(document.querySelectorAll('#cardapioGrid .menu-card, #cardapioGrid .dish-card'));

    const matchedCards = cards.filter(card => {
      const cardCategory = card.dataset.category || '';
      const cardText = (card.innerText || '').toLowerCase();
      const matchesCategory = (activeCategory === 'todos' || cardCategory === activeCategory);
      const matchesSearch = (!searchTerm || cardText.includes(searchTerm));
      return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(matchedCards.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) {
      currentPage = 1;
    }

    cards.forEach(card => {
      card.style.display = 'none';
      card.classList.remove('is-paged-in');
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageCards = matchedCards.slice(startIndex, endIndex);

    pageCards.forEach(card => {
      card.style.display = 'flex';
      card.classList.add('is-paged-in');
    });

    if (emptyState) {
      if (matchedCards.length === 0) {
        emptyState.classList.add('visible');
      } else {
        emptyState.classList.remove('visible');
      }
    }

    renderPagination(totalPages);
  }

  // Clique na paginação
  if (paginationContainer) {
    paginationContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.menu-page-btn:not([disabled])');
      if (!btn) return;
      const targetPage = parseInt(btn.dataset.page, 10);
      if (targetPage && targetPage !== currentPage) {
        currentPage = targetPage;
        filterCards();
        const board = document.querySelector('.menu-board') || grid;
        if (board) {
          const rect = board.getBoundingClientRect();
          if (rect.top < 0) {
            board.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  }

  // Clique nas abas de categorias
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => {
        t.classList.remove('is-active', 'active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active', 'active');
      tab.setAttribute('aria-selected', 'true');
      activeCategory = tab.dataset.category || 'todos';
      currentPage = 1;
      filterCards();
    };
  });

  // Digitação na barra de busca
  if (searchInput) {
    searchInput.oninput = (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      currentPage = 1;
      filterCards();
    };
  }

  // Inicializa a paginação e filtro dos itens
  filterCards();

  // Delegação do clique de pedido no WhatsApp
  if (grid) {
    grid.onclick = (e) => {
      const btn = e.target.closest('.menu-card__order, .dish-card__btn');
      if (!btn) return;
      e.preventDefault();
      const dishName = btn.dataset.dish || 'Prato Especial';
      const text = `Olá, Galeto e Picanha! Vi o cardápio no site e gostaria de pedir o item: *${dishName}*. Vocês estão no iFood e no 99 ou posso pedir direto por aqui?`;
      const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    };
  }
}

/**
 * 5. CARROSSEL RESPONSIVO DA GALERIA (3 por linha desktop, 2 tablet, 1 mobile)
 */
function initGalleryCarousel() {
  const trackWrap = document.getElementById('galeriaTrackWrap');
  const track = document.getElementById('galeriaTrack');
  const prevBtn = document.getElementById('galeriaPrevBtn');
  const nextBtn = document.getElementById('galeriaNextBtn');
  const dotsContainer = document.getElementById('galeriaDots');
  if (!trackWrap || !track) return;

  const items = track.querySelectorAll('.galeria-item');
  if (!items.length) return;

  function getStepWidth() {
    const first = items[0];
    if (!first) return 300;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return first.offsetWidth + gap;
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = items.length;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `galeria-dot${i === 0 ? ' is-active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir para a foto ${i + 1}`);
      dot.onclick = () => {
        const step = getStepWidth();
        trackWrap.scrollTo({ left: i * step, behavior: 'smooth' });
      };
      dotsContainer.appendChild(dot);
    }
  }

  renderDots();

  function updateState() {
    const scrollLeft = trackWrap.scrollLeft;
    const step = getStepWidth();
    const currentIndex = Math.min(items.length - 1, Math.max(0, Math.round(scrollLeft / step)));

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.galeria-dot');
      dots.forEach((d, idx) => {
        if (idx === currentIndex) d.classList.add('is-active');
        else d.classList.remove('is-active');
      });
    }

    if (prevBtn) {
      prevBtn.disabled = scrollLeft <= 4;
    }
    if (nextBtn) {
      const maxScroll = trackWrap.scrollWidth - trackWrap.clientWidth - 4;
      nextBtn.disabled = scrollLeft >= maxScroll;
    }
  }

  trackWrap.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateState);
  }, { passive: true });

  if (prevBtn) {
    prevBtn.onclick = () => {
      const step = getStepWidth();
      trackWrap.scrollBy({ left: -step, behavior: 'smooth' });
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      const step = getStepWidth();
      trackWrap.scrollBy({ left: step, behavior: 'smooth' });
    };
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateState();
    }, 150);
  });

  updateState();
}

/**
 * 5.0 CARROSSEL RESPONSIVO COMIDA DI BUTECO (Mobile)
 */
function initCdbCarousel() {
  const trackWrap = document.getElementById('cdbTrackWrap');
  const track = document.getElementById('cdbTrack');
  const prevBtn = document.getElementById('cdbPrevBtn');
  const nextBtn = document.getElementById('cdbNextBtn');
  const dotsContainer = document.getElementById('cdbDots');
  if (!trackWrap || !track) return;

  const items = track.querySelectorAll('.cdb-photo-card');
  if (!items.length) return;

  function getStepWidth() {
    const first = items[0];
    if (!first) return 300;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 16;
    return first.offsetWidth + gap;
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = items.length;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `cdb-dot${i === 0 ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `Ir para a foto ${i + 1}`);
      dot.onclick = () => {
        const step = getStepWidth();
        trackWrap.scrollTo({ left: i * step, behavior: 'smooth' });
      };
      dotsContainer.appendChild(dot);
    }
  }

  renderDots();

  function updateState() {
    const scrollLeft = trackWrap.scrollLeft;
    const step = getStepWidth();
    const currentIndex = Math.min(items.length - 1, Math.max(0, Math.round(scrollLeft / step)));

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.cdb-dot');
      dots.forEach((d, idx) => {
        if (idx === currentIndex) d.classList.add('is-active');
        else d.classList.remove('is-active');
      });
    }

    if (prevBtn) {
      prevBtn.disabled = scrollLeft <= 6;
      prevBtn.style.opacity = scrollLeft <= 6 ? '0.35' : '1';
    }
    if (nextBtn) {
      const maxScroll = trackWrap.scrollWidth - trackWrap.clientWidth - 6;
      nextBtn.disabled = scrollLeft >= maxScroll;
      nextBtn.style.opacity = scrollLeft >= maxScroll ? '0.35' : '1';
    }
  }

  trackWrap.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateState);
  }, { passive: true });

  if (prevBtn) {
    prevBtn.onclick = () => {
      const step = getStepWidth();
      trackWrap.scrollBy({ left: -step, behavior: 'smooth' });
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      const step = getStepWidth();
      trackWrap.scrollBy({ left: step, behavior: 'smooth' });
    };
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateState();
    }, 150);
  });

  updateState();
}

/**
 * 5.1 LIGHTBOX DE FOTOS DA GALERIA
 */
let currentGalleryIndex = 0;
const galleryImages = [];

function initGalleryLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  const items = document.querySelectorAll('.galeria-item');
  if (!items.length || !lightbox) return;

  // Popula array da galeria
  items.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.galeria-item__title')?.innerText || '';
    const category = item.querySelector('.galeria-item__category')?.innerText || '';

    galleryImages.push({
      src: img?.getAttribute('src') || '',
      alt: img?.getAttribute('alt') || '',
      title: title,
      category: category
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryImages[currentGalleryIndex];
    if (!item) return;
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxTitle) lightboxTitle.innerText = item.title;
    if (lightboxCategory) lightboxCategory.innerText = item.category;
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    updateLightboxContent();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Fecha ao clicar fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });
}

/**
 * 6. SIMULADOR & FORMULÁRIO DE PEDIDO / RESERVA VIA WHATSAPP
 */
function initReservationForm() {
  const form = document.getElementById('reservasForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const tipo = document.getElementById('reservaTipo')?.value || 'Mesa / Reserva';
    const nome = document.getElementById('reservaNome')?.value || 'Cliente';
    const data = document.getElementById('reservaData')?.value || '';
    const hora = document.getElementById('reservaHora')?.value || '';
    const pessoas = document.getElementById('reservaPessoas')?.value || '1';
    const obs = document.getElementById('reservaObs')?.value || '';

    // Formata mensagem elegante pro WhatsApp
    let msg = `*GALETO & PICANHA (GRAJAÚ) - CONTATO PELO SITE*\n\n`;
    msg += `📍 *Tipo de Solicitação:* ${tipo}\n`;
    msg += `👤 *Nome:* ${nome}\n`;
    if (data) msg += `📅 *Data pretendida:* ${data}\n`;
    if (hora) msg += `⏰ *Horário estimado:* ${hora}\n`;
    if (pessoas) msg += `👥 *Quantidade de pessoas / porções:* ${pessoas}\n`;
    if (obs.trim()) msg += `📝 *Observações / Pedido:* ${obs.trim()}\n`;
    msg += `\n_Enviado através do site oficial galetoepicanha.com.br_`;

    const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}

/**
 * 7. FAQ ACCORDION (SEO ESTRUTURADO)
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens para comportamento accordion limpo
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * 8. COPIAR ENDEREÇO & TOAST NOTIFICATION
 */
function initCopyAddress() {
  const copyBtn = document.getElementById('copyAddressBtn');
  const toast = document.getElementById('toastMsg');
  const addressText = 'R. Sá Viana, 148 - Grajaú, Rio de Janeiro - RJ, 20540-260';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(addressText);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = addressText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      showToast('Endereço copiado para a área de transferência!');
    } catch (err) {
      showToast('Endereço: R. Sá Viana, 148 - Grajaú');
    }
  });

  function showToast(msg) {
    if (!toast) return;
    const textEl = toast.querySelector('.toast-text');
    if (textEl) textEl.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/**
 * 9. BOTÃO VOLTAR AO TOPO
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const isVisible = window.pageYOffset > 450;
        if (isVisible !== btn.classList.contains('visible')) {
          btn.classList.toggle('visible', isVisible);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 10. MODAL DE POLÍTICA DE PRIVACIDADE
 */
function initPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  const openLinks = document.querySelectorAll('[data-open-privacy]');
  const closeBtn = document.getElementById('privacyClose');

  if (!modal) return;

  function open() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/**
 * 10.1 MODAL FLUTUANTE DE FAQ
 */
function initFaqModal() {
  const modal = document.getElementById('faqModal');
  const openLinks = document.querySelectorAll('[data-open-faq]');
  const closeBtns = modal ? modal.querySelectorAll('[data-close-faq], .modal-close') : [];

  if (!modal) return;

  function open() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', close);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/**
 * 10.2 MODAL DE CARDÁPIO COMPLETO (130+ Itens com Preços Oficiais)
 */
function initCardapioCompletoModal() {
  const modal = document.getElementById('cardapioCompletoModal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('#btnOpenCardapioFull, #btnOpenCardapioFullCta, [data-open-cardapio-modal]');
  const closeBtns = modal.querySelectorAll('[data-close-cardapio-modal], .modal-close');
  const searchInput = document.getElementById('modalMenuSearch');
  const categoriesContainer = document.getElementById('modalMenuCategories');
  const listContainer = document.getElementById('modalMenuList');
  const emptyMsg = document.getElementById('modalMenuEmpty');

  let fullMenuData = null;
  let activeCategory = 'all';

  function open() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!fullMenuData) {
      loadMenuData();
    }
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 150);
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', close);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });

  async function loadMenuData() {
    try {
      const res = await fetch('data/cardapio-completo.json');
      fullMenuData = await res.json();
      renderModalContent();
    } catch (err) {
      console.error('[CardapioModal] Erro ao carregar cardapio-completo.json:', err);
      if (listContainer) {
        listContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: #ff6666;">
            <p>Não foi possível carregar o cardápio no momento.</p>
            <a href="cardapio-completo.html" class="btn btn--gold btn--sm" style="margin-top: 12px; display: inline-flex;">Ver página do cardápio completo</a>
          </div>
        `;
      }
    }
  }

  function renderModalContent() {
    if (!fullMenuData || !fullMenuData.categorias) return;

    // Renderiza pílulas de categorias
    if (categoriesContainer) {
      let pillsHtml = `
        <button type="button" class="cardapio-modal__cat-pill is-active" data-cat="all">
          Todos <span class="cat-pill-count">${fullMenuData.total_itens || 133}</span>
        </button>
      `;

      fullMenuData.categorias.forEach(cat => {
        pillsHtml += `
          <button type="button" class="cardapio-modal__cat-pill" data-cat="${cat.id}">
            ${cat.icone || ''} ${cat.nome} <span class="cat-pill-count">${cat.itens.length}</span>
          </button>
        `;
      });

      categoriesContainer.innerHTML = pillsHtml;

      categoriesContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.cardapio-modal__cat-pill');
        if (!pill) return;
        categoriesContainer.querySelectorAll('.cardapio-modal__cat-pill').forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        activeCategory = pill.dataset.cat || 'all';
        applyFilters();
      });
    }

    // Renderiza seções e itens
    if (listContainer) {
      let sectionsHtml = '';
      fullMenuData.categorias.forEach(cat => {
        sectionsHtml += `
          <section class="cardapio-modal__section" data-section-cat="${cat.id}">
            <div class="cardapio-modal__section-header">
              <h3 class="cardapio-modal__section-title">
                <span class="cat-emoji" aria-hidden="true">${cat.icone || '🍴'}</span>
                ${cat.nome}
              </h3>
              ${cat.observacao ? `<span class="cardapio-modal__section-note">${cat.observacao}</span>` : ''}
            </div>
            <div class="cardapio-modal__grid">
              ${cat.itens.map(item => {
                const hasPhoto = Boolean(item.foto && item.foto.trim());
                const orderText = `Olá, Galeto e Picanha! Gostaria de pedir: *${item.nome}* (${item.preco})`;
                const orderUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(orderText)}`;
                const searchTokens = (item.nome + ' ' + (item.acompanhamentos || '') + ' ' + (item.serve || '') + ' ' + cat.nome).toLowerCase();

                return `
                  <article class="cardapio-modal__item ${hasPhoto ? 'has-photo' : 'no-photo'}" data-item-text="${searchTokens}" data-item-cat="${cat.id}">
                    ${hasPhoto ? `
                      <img src="${item.foto}" alt="${item.nome}" class="cardapio-modal__item-thumb" width="70" height="70" loading="lazy">
                    ` : ''}
                    <div class="cardapio-modal__item-info">
                      ${item.serve ? `<span class="cardapio-modal__item-badge">${item.serve}</span>` : ''}
                      <h4 class="cardapio-modal__item-name">${item.nome}</h4>
                      ${item.acompanhamentos ? `<p class="cardapio-modal__item-desc">${item.acompanhamentos}</p>` : ''}
                    </div>
                    <div class="cardapio-modal__item-meta">
                      <span class="cardapio-modal__item-price">${item.preco}</span>
                      <a href="${orderUrl}" target="_blank" rel="noopener" class="cardapio-modal__item-btn" title="Pedir pelo WhatsApp">
                        Pedir
                      </a>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </section>
        `;
      });

      listContainer.innerHTML = sectionsHtml;
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
  }

  function applyFilters() {
    if (!listContainer) return;
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let totalVisible = 0;

    const sections = listContainer.querySelectorAll('.cardapio-modal__section');
    sections.forEach(sec => {
      const secCat = sec.dataset.sectionCat;
      const catMatches = (activeCategory === 'all' || activeCategory === secCat);
      
      let visibleInSec = 0;
      const items = sec.querySelectorAll('.cardapio-modal__item');

      items.forEach(item => {
        const itemCatMatches = (activeCategory === 'all' || item.dataset.itemCat === activeCategory);
        const itemText = item.dataset.itemText || '';
        const searchMatches = (!query || itemText.includes(query));

        if (itemCatMatches && searchMatches) {
          item.style.display = 'flex';
          visibleInSec++;
          totalVisible++;
        } else {
          item.style.display = 'none';
        }
      });

      sec.style.display = (visibleInSec > 0 && catMatches) ? 'block' : 'none';
    });

    if (emptyMsg) {
      emptyMsg.style.display = totalVisible === 0 ? 'block' : 'none';
    }
  }
}

/**
 * 11. TRENDING BAR DINÂMICA DE DESTAQUES (Integrado ao CMS)
 */
async function initTrendingCardapio() {
  const container = document.getElementById('trending-container');
  if (!container) return;

  let items = [];
  if (window.GaletoCMS) {
    try {
      items = await window.GaletoCMS.getDestaques(true);
    } catch (e) {
      console.warn('[Main] Falha ao ler destaques do CMS:', e);
    }
  }

  // Fallback se lista vazia
  if (!items || !items.length) {
    items = [
      { nome: 'Galeto Dourado na Brasa', preco: 'R$ 69,90', icone: '🍗', badge: 'Mais Pedido' },
      { nome: 'Picanha Nobre Fatiada na Chapa', preco: 'R$ 138,90', icone: '🥩', badge: 'Corte Nobre' },
      { nome: 'Petisqueira Mista Especial', preco: 'R$ 119,90', icone: '🍟', badge: 'Happy Hour' },
      { nome: 'Carne de Sol com Aipim na Manteiga', preco: 'R$ 94,90', icone: '🥘', badge: 'Tradição' }
    ];
  }

  // Renderiza item com link direto para o cardápio
  function renderTrendingItem(item) {
    const nome = item.nome || item.name || 'Destaque';
    const preco = item.preco || item.price || '';
    const icone = item.icone || item.icon || '🍗';
    const badge = item.badge || '';

    return `
      <span class="trending-bar__item">
        <a href="#cardapio" class="trending-bar__link" title="Ver ${nome} no cardápio">
          <span class="trending-bar__icon">${icone}</span>
          <strong class="trending-bar__name">${nome}</strong>
          ${badge ? `<span class="trending-bar__badge">${badge}</span>` : ''}
          <span class="trending-bar__price">${preco}</span>
        </a>
        <span class="trending-bar__sep">•</span>
      </span>
    `;
  }

  // Duplicação para garantir ticker contínuo sem saltos
  const loopItens = [...items, ...items];
  container.innerHTML = loopItens.map(renderTrendingItem).join('');
}

/**
 * 12. SESSÃO DE EVENTOS (Hero Floating Modal no Desktop & Seção Mobile)
 */
async function initHeroEvents() {
  const floatingContainer = document.getElementById('heroEventFloating');
  const mobileContainer = document.getElementById('eventsMobileContainer');
  const mobileSec = document.getElementById('eventosMobile');

  let eventos = [];
  if (window.GaletoCMS) {
    try {
      eventos = await window.GaletoCMS.getEventos(true);
    } catch (e) {
      console.warn('[Main] Falha ao ler eventos do CMS:', e);
    }
  }

  // Fallback padrão se não houver eventos cadastrados
  if (!eventos || !eventos.length) {
    eventos = [
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
        destaque_hero: true,
        ativo: true
      }
    ];
  }

  const heroEvent = eventos.find(e => e.destaque_hero) || eventos[0];

  // 1. Renderiza no Modal Flutuante do Hero (Desktop)
  if (floatingContainer && heroEvent) {
    floatingContainer.style.display = 'block';
    const whatsappMsg = heroEvent.link_whatsapp_msg || 
      `Olá, Galeto e Picanha! Gostaria de reservar uma mesa para o evento: *${heroEvent.titulo}*.`;
    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(whatsappMsg)}`;

    floatingContainer.innerHTML = `
      <div class="event-card__header" id="heroEventHeader">
        <span class="event-card__badge-tag">
          <span class="event-card__badge-dot"></span>
          <span>${heroEvent.badge || 'Próximo Evento'}</span>
        </span>
        <button type="button" class="event-card__close-btn" id="heroEventToggle" title="Minimizar / Expandir" aria-label="Minimizar / Expandir evento">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>

      <div class="event-card__banner">
        <img src="${heroEvent.imagem_url || 'assets/imagens/1.webp'}" alt="${heroEvent.titulo}" class="event-card__banner-img">
        <div class="event-card__banner-overlay"></div>
        <span class="event-card__date-pill">
          <span>📅 ${heroEvent.data_texto} • ${heroEvent.horario}</span>
        </span>
      </div>

      <div class="event-card__body">
        <h2 class="event-card__title">${heroEvent.icone ? heroEvent.icone + ' ' : ''}${heroEvent.titulo}</h2>
        ${heroEvent.subtitulo ? `<div class="event-card__sub">${heroEvent.subtitulo}</div>` : ''}
        <p class="event-card__desc">${heroEvent.descricao || ''}</p>
      </div>

      <div class="event-card__footer">
        <a href="${waUrl}" target="_blank" rel="noopener" class="event-card__btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20.52 3.48A11.9 11.9 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.09.55 4.14 1.59 5.94L0 24l6.33-1.66a11.89 11.89 0 0 0 5.75 1.48h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.44zm-8.44 18.33h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.22-3.75.98 1-3.65-.24-.38a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.91-9.9 2.64 0 5.13 1.03 7 2.9a9.85 9.85 0 0 1 2.9 7c0 5.46-4.44 9.9-9.89 9.91z"/>
          </svg>
          Reservar Mesa no WhatsApp
        </a>
      </div>
    `;

    const toggleBtn = document.getElementById('heroEventToggle');
    const headerEl = document.getElementById('heroEventHeader');
    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        floatingContainer.classList.toggle('minimized');
      };
    }
    if (headerEl) {
      headerEl.onclick = () => {
        if (floatingContainer.classList.contains('minimized')) {
          floatingContainer.classList.remove('minimized');
        }
      };
    }
  }

  // 2. Renderiza na Seção Mobile (Logo abaixo do Vídeo)
  if (mobileContainer) {
    if (mobileSec) mobileSec.style.display = '';

    mobileContainer.innerHTML = `
      <div class="events-mobile__header">
        <span class="events-mobile__tag">
          <span class="event-card__badge-dot"></span>
          Agenda do Bar
        </span>
        <h2 class="events-mobile__title">Próximos <span class="highlight-gold">Eventos &amp; Atrações</span></h2>
      </div>
      <div class="events-mobile__list">
        ${eventos.map(ev => {
          const msg = ev.link_whatsapp_msg || `Olá, gostaria de reservar uma mesa para o evento: *${ev.titulo}*.`;
          const wa = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
          return `
            <div class="events-mobile__card">
              <div class="events-mobile__banner">
                <img src="${ev.imagem_url || 'assets/imagens/1.webp'}" alt="${ev.titulo}" loading="lazy">
              </div>
              <span class="event-card__date-pill">
                <span>📅 ${ev.data_texto} • ${ev.horario}</span>
              </span>
              <h3 class="event-card__title">${ev.icone ? ev.icone + ' ' : ''}${ev.titulo}</h3>
              ${ev.subtitulo ? `<div class="event-card__sub">${ev.subtitulo}</div>` : ''}
              <p class="event-card__desc">${ev.descricao || ''}</p>
              <a href="${wa}" target="_blank" rel="noopener" class="event-card__btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20.52 3.48A11.9 11.9 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.09.55 4.14 1.59 5.94L0 24l6.33-1.66a11.89 11.89 0 0 0 5.75 1.48h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.44zm-8.44 18.33h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.22-3.75.98 1-3.65-.24-.38a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.91-9.9 2.64 0 5.13 1.03 7 2.9a9.85 9.85 0 0 1 2.9 7c0 5.46-4.44 9.9-9.89 9.91z"/>
                </svg>
                Reservar no WhatsApp
              </a>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

