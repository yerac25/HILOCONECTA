/** Datos demo — en producción se cargarán desde la API / BD */
(function (global) {
  const CATEGORIES = [
    { id: 'hilos', name: 'Hilos', image: 'https://images.unsplash.com/photo-1584917865442-89a455addebc?w=160&h=160&fit=crop' },
    { id: 'carretes', name: 'Carretes y bobinas', image: 'https://images.unsplash.com/photo-1615485929310-68b305aad0c0?w=160&h=160&fit=crop' },
    { id: 'agujas', name: 'Agujas', image: 'https://images.unsplash.com/photo-1586105251261-72a257497207?w=160&h=160&fit=crop' },
    { id: 'accesorios', name: 'Accesorios de costura', image: 'https://images.unsplash.com/photo-1586354272268-0a47bf64be24?w=160&h=160&fit=crop' },
    { id: 'cierres', name: 'Cierres y deslizadores', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=160&h=160&fit=crop' },
    { id: 'cintas', name: 'Cintas y elásticos', image: 'https://images.unsplash.com/photo-1606107557192-0a6cacdce550?w=160&h=160&fit=crop' },
    { id: 'herramientas', name: 'Herramientas', image: 'https://images.unsplash.com/photo-1586354272268-0a47bf64be24?w=160&h=160&fit=crop' },
    { id: 'telas', name: 'Telas', image: 'https://images.unsplash.com/photo-1558171813-1c088753ce04?w=160&h=160&fit=crop' },
  ];

  const PRODUCTS = [
    { id: 'h001', name: 'Hilo de poliéster 40/2', spec: 'Cono 1,000 m', category: 'hilos', price: 85, image: 'https://images.unsplash.com/photo-1584917865442-89a455addebc?w=280&h=280&fit=crop', featured: true },
    { id: 'c001', name: 'Carrete metálico industrial', spec: 'Tipo L — 20 unidades', category: 'carretes', price: 145, image: 'https://images.unsplash.com/photo-1615485929310-68b305aad0c0?w=280&h=280&fit=crop', featured: true },
    { id: 'a001', name: 'Agujas universales 80/12', spec: 'Caja 100 pzas', category: 'agujas', price: 42, image: 'https://images.unsplash.com/photo-1586105251261-72a257497207?w=280&h=280&fit=crop', featured: true },
    { id: 'a002', name: 'Agujas punta de bola 75/11', spec: 'Caja 100 pzas', category: 'agujas', price: 48, image: 'https://images.unsplash.com/photo-1586105251261-72a257497207?w=280&h=280&fit=crop', featured: true },
    { id: 'h010', name: 'Hilo overlock 80/2', spec: 'Cono 5,000 m', category: 'hilos', price: 420, image: 'https://images.unsplash.com/photo-1615485929310-68b305aad0c0?w=280&h=280&fit=crop', featured: true },
    { id: 'o001', name: 'Aceite para máquina de coser', spec: 'Frasco 100 ml', category: 'herramientas', price: 35, image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=280&h=280&fit=crop', featured: true },
    { id: 't001', name: 'Tijeras de sastre 12"', spec: 'Acero inoxidable', category: 'herramientas', price: 185, image: 'https://images.unsplash.com/photo-1586354272268-0a47bf64be24?w=280&h=280&fit=crop' },
    { id: 'h003', name: 'Hilo de algodón 50/3', spec: 'Carrete 500 m', category: 'hilos', price: 45, image: 'https://images.unsplash.com/photo-1584917865442-89a455addebc?w=280&h=280&fit=crop' },
  ];

  const LOCATIONS = [
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

  function enrichStock(stock) {
    return stock
      .map(function (s) {
        const p = PRODUCTS.find(function (x) { return x.id === s.productId; });
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
  };
})(window);
