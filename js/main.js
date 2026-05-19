(function () {
  var CATEGORIES = HiloData.CATEGORIES;
  var PRODUCTS = HiloData.PRODUCTS;
  var LOCATIONS = HiloData.LOCATIONS;
  var formatPrice = HiloData.formatPrice;
  var enrichStock = HiloData.enrichStock;

  var mapInstance = null;
  var markersLayer = null;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function showToast(msg) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('toast--visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove('toast--visible');
    }, 2800);
  }

  function openModal(id) {
    var d = document.getElementById(id);
    if (d && typeof d.showModal === 'function') d.showModal();
  }

  function renderProductCard(p) {
    return (
      '<article class="product-card" data-id="' + p.id + '">' +
      '<div class="product-card__img-wrap"><img class="product-card__img" src="' + p.image + '" alt="' + p.name + '" loading="lazy"></div>' +
      '<h3 class="product-card__title">' + p.name + '</h3>' +
      '<p class="product-card__spec">' + p.spec + '</p>' +
      '<div class="product-card__footer"><span class="product-card__price">' + formatPrice(p.price) + '</span></div>' +
      '<button type="button" class="product-card__cart" data-add="' + p.id + '" aria-label="Agregar al carrito">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
      '</button></article>'
    );
  }

  function bindProductCards(root) {
    root.querySelectorAll('[data-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = PRODUCTS.find(function (x) { return x.id === btn.dataset.add; });
        if (p) {
          HiloCart.addToCart(p);
          updateCartUI();
          showToast(p.name + ' agregado al carrito');
        }
      });
    });
  }

  function renderFeatured(container, list) {
    if (!container) return;
    var items = list || PRODUCTS.filter(function (p) { return p.featured; });
    container.innerHTML = items.map(renderProductCard).join('');
    bindProductCards(container);
  }

  function updateCartUI() {
    var cart = HiloCart.getCart();
    var badge = $('#cartBadge');
    if (badge) badge.textContent = HiloCart.getCartCount(cart);

    var body = $('#cartItems');
    var totalEl = $('#cartTotal');
    if (!body) return;

    if (!cart.length) {
      body.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
      if (totalEl) totalEl.textContent = formatPrice(0);
      return;
    }

    body.innerHTML = cart.map(function (i) {
      return (
        '<div class="cart-item">' +
        '<img class="cart-item__img" src="' + i.image + '" alt="">' +
        '<div><p class="cart-item__title">' + i.name + '</p>' +
        '<p class="cart-item__price">' + formatPrice(i.price) + ' × ' + i.qty + '</p>' +
        '<div class="cart-item__qty">' +
        '<button type="button" data-qty="' + i.id + '" data-delta="-1">−</button>' +
        '<span>' + i.qty + '</span>' +
        '<button type="button" data-qty="' + i.id + '" data-delta="1">+</button>' +
        '</div>' +
        '<button type="button" class="cart-item__remove" data-remove="' + i.id + '">Eliminar</button>' +
        '</div></div>'
      );
    }).join('');

    if (totalEl) totalEl.textContent = formatPrice(HiloCart.getCartTotal(cart));

    body.querySelectorAll('[data-qty]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        HiloCart.updateQty(btn.dataset.qty, Number(btn.dataset.delta));
        updateCartUI();
      });
    });
    body.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        HiloCart.removeFromCart(btn.dataset.remove);
        updateCartUI();
      });
    });
  }

  function renderCategories() {
    var grid = $('#categoriesGrid');
    if (!grid) return;

    var cards = CATEGORIES.map(function (c) {
      return (
        '<article class="category-card" data-category="' + c.id + '">' +
        '<img class="category-card__img" src="' + c.image + '" alt="' + c.name + '">' +
        '<h3>' + c.name + '</h3>' +
        '<span class="category-card__link">Ver productos ›</span></article>'
      );
    }).join('');

    var allCard =
      '<article class="category-card category-card--all" data-category="">' +
      '<div class="grid-icon">' + '<span></span>'.repeat(9) + '</div>' +
      '<h3>Ver todas las categorías</h3>' +
      '<span class="category-card__link">Explorar ›</span></article>';

    grid.innerHTML = cards + allCard;

    grid.querySelectorAll('.category-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var cat = card.dataset.category;
        var select = $('#searchCategory');
        var input = $('#searchInput');
        if (select) select.value = cat;
        if (input) { input.value = ''; input.focus(); }
        var el = document.getElementById('productos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        if (cat) {
          var filtered = PRODUCTS.filter(function (p) { return p.category === cat; });
          renderFeatured(
            $('#featuredProducts'),
            filtered.length ? filtered : PRODUCTS.filter(function (p) { return p.featured; })
          );
        }
      });
    });
  }

  function initSearch() {
    var form = document.getElementById('searchForm');
    var input = document.getElementById('searchInput');
    var category = document.getElementById('searchCategory');
    var resultsSection = document.getElementById('searchResults');
    var resultsGrid = document.getElementById('searchResultsGrid');

    function runSearch(e) {
      if (e) e.preventDefault();
      var q = (input && input.value || '').trim().toLowerCase();
      var cat = category && category.value || '';

      var list = PRODUCTS.filter(function (p) {
        var matchCat = !cat || p.category === cat;
        var matchQ = !q ||
          p.name.toLowerCase().indexOf(q) !== -1 ||
          p.spec.toLowerCase().indexOf(q) !== -1 ||
          p.category.indexOf(q) !== -1;
        return matchCat && matchQ;
      });

      if (!list.length) {
        showToast('No se encontraron productos');
        if (resultsSection) resultsSection.setAttribute('hidden', '');
        return;
      }

      if (resultsSection) resultsSection.removeAttribute('hidden');
      renderFeatured(resultsGrid, list);
      if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (form) form.addEventListener('submit', runSearch);
    if (input) input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') runSearch(e);
    });
  }

  function stockLevel(qty) {
    if (qty >= 200) return 'high';
    if (qty >= 80) return 'med';
    return 'low';
  }

  function markerColor(level) {
    if (level === 'high') return '#6332c7';
    if (level === 'med') return '#7B4FD4';
    return '#a78bfa';
  }

  function renderMapSidebar(loc) {
    var sidebar = document.getElementById('mapSidebar');
    if (!sidebar) return;

    var productFilter = document.getElementById('mapProductFilter');
    var categoryFilter = document.getElementById('mapCategoryFilter');
    var pf = productFilter ? productFilter.value : '';
    var cf = categoryFilter ? categoryFilter.value : '';

    var stock = enrichStock(loc.stock);
    if (pf) stock = stock.filter(function (s) { return s.id === pf; });
    if (cf) stock = stock.filter(function (s) { return s.category === cf; });

    if (!stock.length) {
      sidebar.innerHTML = '<p class="map-sidebar__hint">Sin existencias para el filtro seleccionado.</p>';
      return;
    }

    sidebar.innerHTML =
      '<p class="map-location__title">' + loc.name + '</p>' +
      '<p class="map-location__addr">' + loc.address + '</p>' +
      stock.map(function (s) {
        var lvl = stockLevel(s.qty);
        return (
          '<div class="map-stock-item">' +
          '<div><p class="map-stock-item__name">' + s.name + '</p>' +
          '<p class="map-stock-item__meta">' + s.priceLabel + ' · ' + s.spec + '</p></div>' +
          '<span class="stock-qty stock-qty--' + lvl + '">' + s.qty + ' pzas</span></div>'
        );
      }).join('');
    sidebar.innerHTML = sidebar.innerHTML.replace(/div/g, 'div').replace(/div/g, 'div');
  }

  function getFilteredLocations() {
    var productFilter = document.getElementById('mapProductFilter');
    var categoryFilter = document.getElementById('mapCategoryFilter');
    var pf = productFilter ? productFilter.value : '';
    var cf = categoryFilter ? categoryFilter.value : '';

    return LOCATIONS.filter(function (loc) {
      var stock = enrichStock(loc.stock);
      if (pf && !stock.some(function (s) { return s.id === pf; })) return false;
      if (cf && !stock.some(function (s) { return s.category === cf; })) return false;
      return true;
    });
  }

  function refreshMarkers() {
    if (!mapInstance || !markersLayer || typeof L === 'undefined') return;
    markersLayer.clearLayers();

    getFilteredLocations().forEach(function (loc) {
      var stock = enrichStock(loc.stock);
      var totalQty = stock.reduce(function (s, i) { return s + i.qty; }, 0);
      var level = stockLevel(totalQty / Math.max(stock.length, 1));

      var marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 10,
        fillColor: markerColor(level),
        color: '#fff',
        weight: 2,
        fillOpacity: 0.95,
      });

      marker.bindPopup('<strong>' + loc.name + '</strong><br>' + stock.length + ' productos disponibles');
      marker.on('click', function () {
        renderMapSidebar(loc);
        mapInstance.panTo([loc.lat, loc.lng]);
      });
      markersLayer.addLayer(marker);
    });
  }

  function initMapInstance() {
    var el = document.getElementById('stockMap');
    if (!el || mapInstance || typeof L === 'undefined') return;

    mapInstance = L.map(el, { scrollWheelZoom: true }).setView([23.6, -102.5], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(mapInstance);

    markersLayer = L.layerGroup().addTo(mapInstance);
    refreshMarkers();
    if (LOCATIONS[0]) renderMapSidebar(LOCATIONS[0]);
  }

  function initMap() {
    var modal = document.getElementById('mapModal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.close();
      });

      var observer = new MutationObserver(function () {
        if (modal.open) {
          setTimeout(function () {
            initMapInstance();
            if (mapInstance) mapInstance.invalidateSize();
            refreshMarkers();
          }, 120);
        }
      });
      observer.observe(modal, { attributes: true, attributeFilter: ['open'] });
    }

    var mapProd = document.getElementById('mapProductFilter');
    var mapCat = document.getElementById('mapCategoryFilter');
    if (mapProd) mapProd.addEventListener('change', refreshMarkers);
    if (mapCat) mapCat.addEventListener('change', refreshMarkers);

    window.addEventListener('map-resize', function () {
      if (mapInstance) mapInstance.invalidateSize();
    });
  }

  function initAuth() {
    var AUTH_KEY = 'hiloconecta_user';
    var role = 'consumidor';
    var hints = {
      consumidor: 'Compra insumos y gestiona pedidos.',
      admin: 'Administra inventario y pedidos de tu tienda.',
      repartidor: 'Consulta y actualiza entregas asignadas.',
    };

    var roleSelector = $('#roleSelector');
    if (roleSelector) {
      roleSelector.querySelectorAll('.role-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          role = btn.dataset.role;
          roleSelector.querySelectorAll('.role-btn').forEach(function (b) {
            b.classList.toggle('role-btn--active', b === btn);
          });
          var hint = $('#authHint');
          if (hint) hint.textContent = hints[role];
        });
      });
    }

    function showAuth(register) {
      var title = $('#authModalTitle');
      if (title) title.textContent = register ? 'Registrarse' : 'Iniciar sesión';
      openModal('authModal');
    }

    var btnLogin = $('#btnLogin');
    var btnRegister = $('#btnRegister');
    var btnSupplier = $('#btnSupplier');
    if (btnLogin) btnLogin.addEventListener('click', function () { showAuth(false); });
    if (btnRegister) btnRegister.addEventListener('click', function () { showAuth(true); });
    if (btnSupplier) btnSupplier.addEventListener('click', function () { showAuth(true); });

    var authForm = $('#authForm');
    if (authForm) {
      authForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(e.target);
        var user = { email: fd.get('email'), role: role };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        showToast('Bienvenido (' + role + ')');
        renderUserPill(user);
        var modal = document.getElementById('authModal');
        if (modal) modal.close();
      });
    }

    try {
      var saved = JSON.parse(localStorage.getItem(AUTH_KEY));
      if (saved) renderUserPill(saved);
    } catch (err) { /* ignore */ }
  }

  function renderUserPill(user) {
    var actions = $('.header__actions');
    if (!actions || actions.querySelector('.user-pill')) return;
    var pill = document.createElement('span');
    pill.className = 'user-pill';
    pill.textContent = user.role === 'admin' ? 'Admin' : user.role === 'repartidor' ? 'Repartidor' : 'Mi cuenta';
    var btnLogin = $('#btnLogin');
    if (btnLogin) actions.insertBefore(pill, btnLogin);
    else actions.appendChild(pill);
    if (btnLogin) btnLogin.remove();
  }

  function initNav() {
    var navToggle = $('#navToggle');
    if (navToggle) {
      navToggle.addEventListener('click', function () {
        var nav = $('#mainNav');
        if (nav) nav.classList.toggle('nav--open');
      });
    }

    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dialog = btn.closest('dialog');
        if (dialog) dialog.close();
      });
    });

    var btnCart = $('#btnCart');
    if (btnCart) {
      btnCart.addEventListener('click', function () {
        updateCartUI();
        openModal('cartModal');
      });
    }

    var btnCheckout = $('#btnCheckout');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', function () {
        if (!HiloCart.getCart().length) {
          showToast('El carrito está vacío');
          return;
        }
        showToast('Checkout demo — conectar pasarela de pago');
      });
    }

    var btnOpenMap = $('#btnOpenMap');
    if (btnOpenMap) {
      btnOpenMap.addEventListener('click', function () {
        openModal('mapModal');
        window.dispatchEvent(new Event('map-resize'));
      });
    }
  }

  function fillSelects() {
    var catSelect = $('#searchCategory');
    var mapCat = $('#mapCategoryFilter');
    CATEGORIES.forEach(function (c) {
      if (catSelect) catSelect.insertAdjacentHTML('beforeend', '<option value="' + c.id + '">' + c.name + '</option>');
      if (mapCat) mapCat.insertAdjacentHTML('beforeend', '<option value="' + c.id + '">' + c.name + '</option>');
    });
    var mapProd = $('#mapProductFilter');
    PRODUCTS.forEach(function (p) {
      if (mapProd) mapProd.insertAdjacentHTML('beforeend', '<option value="' + p.id + '">' + p.name + '</option>');
    });
  }

  function init() {
    fillSelects();
    renderCategories();
    renderFeatured($('#featuredProducts'));
    updateCartUI();
    initNav();
    initAuth();
    initSearch();
    initMap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
