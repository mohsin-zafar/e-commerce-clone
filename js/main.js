// Sample product data. Replace 'image' values with 'images/yourimage.jpg' for local pictures.
const products = [
  {id:1,name:'Classic Sneakers',price:59.99,image:'/images/products1.webp'},
  {id:2,name:'Casual Hoodie',price:399.99,image:'images/products2.jpg'},
  {id:3,name:'Smart Watch',price:129.99,image:'images/products3.jpg'},
  {id:4,name:'Sunglasses',price:24.99,image:'images/products4.webp'},
  {id:5,name:'Backpack',price:49.99,image:'images/products5.webp'},
  {id:6,name:'Wireless Earbuds',price:79.99,image:'images/products6.jpg'},
  {id:7,name:'Sleek Speaker',price:120,image:'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=60'},
  {id:8,name:'Retro Music',price:199,image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60'}
];

// Cart state
const cart = [];

// Elements
const grid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');
const overlay = document.getElementById('overlay');
const cartList = document.getElementById('cart-list');
const totalPriceEl = document.getElementById('total-price');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');

const detailOverlay = document.getElementById('detail-overlay');
const detailContent = document.getElementById('detail-content');
const closeDetailBtn = document.getElementById('close-detail');

// Utility: format price
function fmt(n){return '₹' + n.toFixed(2)}

// Render product cards
function renderProducts(){
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/420x300?text=Product'" data-id="${p.id}">
      <div class="meta">
        <div class="title">${p.name}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="actions">
          <button class="btn" data-add="${p.id}">Add to cart</button>
          <button class="btn secondary" data-view="${p.id}">View</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Add to cart
function addToCart(id){
  const prod = products.find(x=>x.id===id);
  const existing = cart.find(x=>x.id===id);
  if(existing){ existing.qty += 1; }
  else cart.push({id:prod.id,name:prod.name,price:prod.price,qty:1,image:prod.image});
  updateCartUI();
}

// Update badge and list
function updateCartUI(){
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = totalQty;
}

// Show cart drawer
function openCart(){
  renderCartList();
  overlay.style.display = 'flex';
}
function closeCart(){ overlay.style.display = 'none'; }

function renderCartList(){
  cartList.innerHTML = '';
  if(cart.length===0){ cartList.innerHTML = '<div>Your cart is empty.</div>'; totalPriceEl.textContent = fmt(0); return }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/120x90?text=Img'">
      <div style="flex:1">
        <div style="font-weight:600">${item.name}</div>
        <div style="color:#666">${fmt(item.price)} × ${item.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button data-inc="${item.id}" class="btn">＋</button>
        <button data-dec="${item.id}" class="btn secondary">－</button>
      </div>
    `;
    cartList.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s + i.price * i.qty,0);
  totalPriceEl.textContent = fmt(total);
}

function changeQty(id,delta){
  const it = cart.find(x=>x.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0){
    const idx = cart.findIndex(x=>x.id===id);cart.splice(idx,1);
  }
  renderCartList(); updateCartUI();
}

function clearCart(){ cart.length = 0; updateCartUI(); renderCartList(); }

// Product detail
function openDetail(id){
  const p = products.find(x=>x.id===id);
  detailContent.innerHTML = `
    <div class="detail">
      <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/640x480?text=Product'">
      <div style="flex:1">
        <h3 style="margin-bottom:6px">${p.name}</h3>
        <div style="font-weight:700;margin-bottom:8px">${fmt(p.price)}</div>
        <p style="color:#555;margin-bottom:12px">This is a sample product description. Replace with real content for each product. Use the View button or click the image to see this modal.</p>
        <div style="display:flex;gap:8px;">
          <button class="btn" id="detail-add">Add to cart</button>
          <button class="btn secondary" id="detail-close">Close</button>
        </div>
      </div>
    </div>
  `;

  // attach add handler
  setTimeout(()=>{
    document.getElementById('detail-add').addEventListener('click',()=>{ addToCart(p.id); alert('Added to cart'); });
    document.getElementById('detail-close').addEventListener('click',()=>closeDetail());
  },50);

  detailOverlay.style.display = 'flex';
}
function closeDetail(){ detailOverlay.style.display = 'none'; }

// Event delegation for product actions
document.body.addEventListener('click',function(e){
  const add = e.target.closest('[data-add]');
  const view = e.target.closest('[data-view]');
  const img = e.target.closest('img[data-id]');
  if(add){ addToCart(Number(add.dataset.add)); }
  if(view){ openDetail(Number(view.dataset.view)); }
  if(img){ openDetail(Number(img.dataset.id)); }

  // cart drawer buttons
  if(e.target.matches('#cart-icon, #cart-icon *')){ openCart(); }
  if(e.target.matches('#close-cart')){ closeCart(); }
  if(e.target.matches('#clear-cart')){ clearCart(); }
  if(e.target.matches('#checkout')){ alert('Checkout flow not implemented in preview'); }

  if(e.target.matches('[data-inc]')){ changeQty(Number(e.target.dataset.inc), +1); }
  if(e.target.matches('[data-dec]')){ changeQty(Number(e.target.dataset.dec), -1); }

  if(e.target.matches('#close-detail')){ closeDetail(); }
});

// close overlays by clicking outside drawer
[overlay, detailOverlay].forEach(ov => {
  ov.addEventListener('click', (ev)=>{
    if(ev.target === ov) ov.style.display = 'none';
  });
});

// wire close buttons
closeCartBtn.addEventListener('click', closeCart);
closeDetailBtn.addEventListener('click', closeDetail);

// initial render
renderProducts();
updateCartUI();
