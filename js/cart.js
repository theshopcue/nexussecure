<script>
// ------------------- CART HELPER FUNCTIONS -------------------

function getCart() {
  const raw = localStorage.getItem("ns_cart");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("ns_cart", JSON.stringify(cart));
}

// ------------------- ADD TO CART HANDLER -------------------

function handleAddToCartClick(event) {
  const btn = event.currentTarget;
  const id = btn.dataset.id;
  const name = btn.dataset.name;
  const price = parseFloat(btn.dataset.price || "0");

  if (!id || !name || isNaN(price)) {
    console.warn("Add to cart: missing data-* attributes");
    return;
  }

  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      qty: 1
    });
  }

  saveCart(cart);

  // Chhota sa feedback
  alert(`Added to cart: ${name}`);
  updateCartBadge();
}

// ------------------- CART BADGE (NAVBAR ICON PE) -------------------

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const cartIcon = document.querySelector('.icon-btn[title="Cart"]');
  if (!cartIcon) return;

  let badge = cartIcon.querySelector(".cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-badge";
    cartIcon.style.position = "relative";
    badge.style.position = "absolute";
    badge.style.top = "-4px";
    badge.style.right = "-4px";
    badge.style.minWidth = "16px";
    badge.style.height = "16px";
    badge.style.borderRadius = "999px";
    badge.style.fontSize = "10px";
    badge.style.display = "flex";
    badge.style.alignItems = "center";
    badge.style.justifyContent = "center";
    badge.style.background = "#ef4444";
    badge.style.color = "#ffffff";
    badge.style.padding = "0 4px";
    cartIcon.appendChild(badge);
  }

  badge.textContent = totalQty > 99 ? "99+" : totalQty;
  badge.style.display = totalQty > 0 ? "flex" : "none";
}

// ------------------- RENDER CART PAGE -------------------

function renderCartPage() {
  const container = document.getElementById("cartItemsContainer");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");
  const emptyState = document.getElementById("cartEmptyState");

  if (!container) return; // agar yeh Cart.html nahi hai

  const cart = getCart();

  container.innerHTML = "";

  if (!cart.length) {
    if (emptyState) emptyState.style.display = "block";
    return;
  } else {
    if (emptyState) emptyState.style.display = "none";
  }

  let subtotal = 0;

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const itemSubtotal = item.price * item.qty;
    subtotal += itemSubtotal;

    row.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="cart-item-text">
          <h4>${item.name}</h4>
          <p>Instant digital license • Email delivery</p>
          <button class="cart-remove" type="button" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <div class="cart-item-price">$${item.price.toFixed(2)}</div>
      <div class="cart-item-qty">
        <input type="number" min="1" value="${item.qty}" data-id="${item.id}">
      </div>
      <div class="cart-item-subtotal">$${itemSubtotal.toFixed(2)}</div>
    `;

    container.appendChild(row);
  });

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Qty change + remove buttons ka event
  container.addEventListener("input", function (e) {
    if (e.target.matches('.cart-item-qty input[type="number"]')) {
      const id = e.target.dataset.id;
      let qty = parseInt(e.target.value || "1", 10);
      if (qty < 1 || isNaN(qty)) qty = 1;
      e.target.value = qty;

      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty = qty;
        saveCart(cart);
        renderCartPage();
        updateCartBadge();
      }
    }
  }, { once: true });

  container.addEventListener("click", function (e) {
    if (e.target.matches(".cart-remove")) {
      const id = e.target.dataset.id;
      let cart = getCart();
      cart = cart.filter(i => i.id !== id);
      saveCart(cart);
      renderCartPage();
      updateCartBadge();
    }
  }, { once: true });
}

// ------------------- INIT ON PAGE LOAD -------------------

document.addEventListener("DOMContentLoaded", function () {
  // sabhi add-to-cart buttons ke liye
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", handleAddToCartClick);
  });

  updateCartBadge();
  renderCartPage();
});
</script>
