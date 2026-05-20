(function (global) {
  var CART_KEY = 'hiloconecta_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function addToCart(product, qty) {
    qty = qty || 1;
    var cart = getCart();
    var existing = cart.find(function (i) { return i.id === product.id; });
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        spec: product.spec,
        price: product.price,
        image: product.image,
        qty: qty,
      });
    }
    saveCart(cart);
    return cart;
  }

  function updateQty(productId, delta) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === productId; });
    if (!item) return cart;
    item.qty += delta;
    cart = cart.filter(function (i) { return i.qty > 0; });
    saveCart(cart);
    return cart;
  }

  function removeFromCart(productId) {
    var cart = getCart().filter(function (i) { return i.id !== productId; });
    saveCart(cart);
    return cart;
  }

  function getCartTotal(cart) {
    return cart.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
  }

  function getCartCount(cart) {
    return cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  global.HiloCart = {
    getCart: getCart,
    addToCart: addToCart,
    updateQty: updateQty,
    removeFromCart: removeFromCart,
    getCartTotal: getCartTotal,
    getCartCount: getCartCount,
  };
})(window);
