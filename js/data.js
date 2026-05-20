/** Datos demo — en producción se cargarán desde la API / BD */
(function (global) {
  var LOCAL = 'assets/images/';
  var PROD = LOCAL + 'products/';

  /** URL Unsplash verificada (formato ixlib) */
  function unsplash(photoId, w, h) {
    return (
      'https://images.unsplash.com/photo-' +
      photoId +
      '?ixlib=rb-4.0.3&auto=format&fit=crop&w=' +
      (w || 400) +
      '&h=' +
      (h || 400) +
      '&q=80'
    );
  }

  /* Categorías: SVG locales (siempre cargan en GitHub Pages) */
  var CATEGORIES = [
    { id: 'hilos', name: 'Hilos', image: LOCAL + 'hilos.svg' },
    { id: 'carretes', name: 'Carretes y bobinas', image: LOCAL + 'carretes.svg' },
    { id: 'agujas', name: 'Agujas', image: LOCAL + 'agujas.svg' },
    { id: 'accesorios', name: 'Accesorios de costura', image: LOCAL + 'accesorios.svg' },
    { id: 'cierres', name: 'Cierres y deslizadores', image: LOCAL + 'cierres.svg' },
    { id: 'cintas', name: 'Cintas y elásticos', image: LOCAL + 'cintas.svg' },
    { id: 'herramientas', name: 'Herramientas', image: LOCAL + 'herramientas.svg' },
    { id: 'telas', name: 'Telas', image: LOCAL + 'telas.svg' },
  ];

  var PRODUCTS = [
    {
      id: 'h001',
      name: 'Hilo de poliéster 40/2',
      spec: 'Cono 1,000 m',
      category: 'hilos',
      price: 85,
      image: unsplash('1584917865442-89a455addebc', 400, 400),
      fallback: PROD + 'h001.svg',
      featured: true,
    },
    {
      id: 'c001',
      name: 'Carrete metálico industrial',
      spec: 'Tipo L — 20 unidades',
      category: 'carretes',
      price: 145,
      image: unsplash('1615485929310-68b305aad0c0', 400, 400),
      fallback: PROD + 'c001.svg',
      featured: true,
    },
    {
      id: 'a001',
      name: 'Agujas universales 80/12',
      spec: 'Caja 100 pzas',
      category: 'agujas',
      price: 42,
      image: unsplash('1584917865442-89a455addebc', 400, 400),
      fallback: PROD + 'a001.svg',
      featured: true,
    },
    {
      id: 'a002',
      name: 'Agujas punta de bola 75/11',
      spec: 'Caja 100 pzas',
      category: 'agujas',
      price: 48,
      image: unsplash('1584917865442-89a455addebc', 400, 400),
      fallback: PROD + 'a002.svg',
      featured: true,
    },
    {
      id: 'h010',
      name: 'Hilo overlock 80/2',
      spec: 'Cono 5,000 m',
      category: 'hilos',
      price: 420,
      image: unsplash('1615485929310-68b305aad0c0', 400, 400),
      fallback: PROD + 'h010.svg',
      featured: true,
    },
    {
      id: 'o001',
      name: 'Aceite para máquina de coser',
      spec: 'Frasco 100 ml',
      category: 'herramientas',
      price: 35,
      image: unsplash('1628177142898-93e36e4e3a50', 400, 400),
      fallback: PROD + 'o001.svg',
      featured: true,
    },
    {
      id: 't001',
      name: 'Tijeras de sastre 12"',
      spec: 'Acero inoxidable',
      category: 'herramientas',
      price: 185,
      image: unsplash('1586354272268-0a47bf64be24', 400, 400),
      fallback: PROD + 't001.svg',
    },
    {
      id: 'h003',
      name: 'Hilo de algodón 50/3',
      spec: 'Carrete 500 m',
      category: 'hilos',
      price: 45,
      image: unsplash('1584917865442-89a455addebc', 400, 400),
      fallback: PROD + 'h003.svg',
    },
  ];

  var LOCATIONS = [
    {
      id: 'loc-cdmx',
      name: 'Almacén Central CDMX',
      address: 'Av. Industria Textil 245, Iztapalapa, CDMX',
      lat: 19.391,
      lng: -99.097,
      stock: [
        { productId: 'h001', qty: 450 },
        { productId: 'c001', qty: 120 },
        { productId: 'a001', qty: 800 },
        { productId: 'o001', qty: 320 },
      ],
    },
    {
      id: 'loc-gdl',
      name: 'Centro de Distribución Guadalajara',
      address: 'Blvd. Textil 1200, Zona Industrial, GDL',
      lat: 20.659,
      lng: -103.349,
      stock: [
        { productId: 'h010', qty: 85 },
        { productId: 'a002', qty: 520 },
        { productId: 't001', qty: 45 },
        { productId: 'h003', qty: 210 },
      ],
    },
    {
      id: 'loc-mty',
      name: 'Hub Norte Monterrey',
      address: 'Carretera Nacional km 8, Santa Catarina, NL',
      lat: 25.686,
      lng: -100.316,
      stock: [
        { productId: 'h001', qty: 180 },
        { productId: 'a001', qty: 95 },
        { productId: 'c001', qty: 60 },
        { productId: 'o001', qty: 140 },
      ],
    },
  ];

  function formatPrice(amount) {
    return '$' + amount.toFixed(2) + ' MXN';
  }

  function getCategoryImage(categoryId) {
    var cat = CATEGORIES.find(function (c) { return c.id === categoryId; });
    return cat ? cat.image : LOCAL + 'hilos.svg';
  }

  function getProductFallback(productId) {
    var p = PRODUCTS.find(function (x) { return x.id === productId; });
    return p && p.fallback ? p.fallback : PROD + productId + '.svg';
  }

  function enrichStock(stock) {
    return stock
      .map(function (s) {
        var p = PRODUCTS.find(function (x) { return x.id === s.productId; });
        if (!p) return null;
        return Object.assign({}, p, { qty: s.qty, priceLabel: formatPrice(p.price) });
      })
      .filter(Boolean);
  }

  global.HiloData = {
    CATEGORIES: CATEGORIES,
    PRODUCTS: PRODUCTS,
    LOCATIONS: LOCATIONS,
    formatPrice: formatPrice,
    enrichStock: enrichStock,
    getCategoryImage: getCategoryImage,
    getProductFallback: getProductFallback,
    HERO_IMAGE: LOCAL + 'hero.png',
    LOGO_IMAGE: LOCAL + 'logo.png',
  };
})(window);
