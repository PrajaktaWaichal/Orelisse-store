// Edit the products below to customise your shop.
const WHATSAPP_NUMBER = ""; // Add your country code + number, digits only, e.g. 919876543210
// Product prices are indicative starting prices. Confirm personalisation, availability and delivery before publishing.
const products = [
  {id:1,name:"Personalised Keepsake Box",category:"Personalised",price:999,tag:"Personal favourite",description:"A thoughtful box with names, notes or a message made just for them.",image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"The Celebration Hamper",category:"Hampers",price:1499,tag:"Bestseller",description:"A curated mix of little treats for birthdays, milestones and just-because moments.",image:"https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"Flowers & Sweet Notes",category:"Celebrations",price:1299,tag:"Made to delight",description:"A graceful gifting combination for the moments worth celebrating.",image:"https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"Corporate Welcome Box",category:"Corporate",price:1199,tag:"For teams & clients",description:"A considered welcome or thank-you gift, ready to personalise with your brand.",image:"https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"Photo Memory Gift",category:"Personalised",price:799,tag:"Made personal",description:"Turn a favourite memory into a keepsake they can hold on to.",image:"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"The Festive Edit",category:"Hampers",price:1799,tag:"Seasonal favourite",description:"A premium gift assortment for festive celebrations and family gatherings.",image:"https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"Bridesmaid Thank-You Box",category:"Celebrations",price:1099,tag:"For the big day",description:"A personal way to thank the people who make your moments special.",image:"https://images.unsplash.com/photo-1512909006721-3d6018887385?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"Branded Business Hamper",category:"Corporate",price:1999,tag:"Bulk orders welcome",description:"Customisable gifts for employee milestones, client appreciation and events.",image:"https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=85"}
];
let cart = [];
let activeCategory = "All";
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const grid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const drawerCount = document.getElementById("drawer-count");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const toast = document.getElementById("toast");

function renderProducts(){
  const visible = products.filter(p => activeCategory === "All" || p.category === activeCategory);
  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-visual">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
        <button class="add-button" data-add="${p.id}">Add to bag +</button>
      </div>
      <div class="product-info"><div><h3>${p.name}</h3><p>${p.description}</p></div><span class="product-price">From ${money(p.price)}</span></div>
    </article>`).join("");
}
function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(()=>toast.classList.remove("show"),2200);
}
function addToCart(id){
  const found = cart.find(item=>item.id===id);
  if(found) found.qty++; else cart.push({id,qty:1});
  renderCart(); showToast("Added to your bag");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta; if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  renderCart();
}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  cartCount.textContent=count; drawerCount.textContent=`(${count})`;
  const total=cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
  cartTotal.textContent=money(total);
  cartEmpty.hidden=cart.length>0;
  cartItems.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-row"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div><button class="remove-item" data-remove="${p.id}">Remove</button></div><strong>${money(p.price*item.qty)}</strong></div>`;
  }).join("");
}
function openCart(){document.body.classList.add("cart-open");document.getElementById("cart-drawer").setAttribute("aria-hidden","false")}
function closeCart(){document.body.classList.remove("cart-open");document.getElementById("cart-drawer").setAttribute("aria-hidden","true")}

grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
document.getElementById("filters").addEventListener("click",e=>{
  const b=e.target.closest("[data-category]");if(!b)return;
  activeCategory=b.dataset.category;
  document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));
  renderProducts();
});
cartItems.addEventListener("click",e=>{
  const q=e.target.closest("[data-qty]");const r=e.target.closest("[data-remove]");
  if(q)changeQty(Number(q.dataset.qty),Number(q.dataset.delta));
  if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));renderCart();}
});
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
document.getElementById("cart-backdrop").addEventListener("click",closeCart);
document.getElementById("continue-shopping").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){showToast("Your bag is empty");return;}
  if(!WHATSAPP_NUMBER){
    const summary=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `${p.name} x ${item.qty} — ${money(p.price*item.qty)} (starting estimate)`}).join("\n");
    const total=cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
    window.prompt("Demo order summary — copy this and send it to your business contact:",`Hello! I'd like to enquire about:\n${summary}\nSubtotal: ${money(total)}\n\nPlease confirm personalisation options, final pricing, availability, delivery and payment options.`);
    return;
  }
  const summary=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `${p.name} x ${item.qty} (${money(p.price*item.qty)} starting estimate)`}).join("\n");
  const total=cart.reduce((s,x)=>s+x.qty*products.find(p=>p.id===x.id).price,0);
  const message=encodeURIComponent(`Hello! I'd like to place an order enquiry:\n${summary}\nSubtotal: ${money(total)}\nPlease confirm personalisation options, final pricing, availability, delivery and payment details.`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank","noopener");
});
document.getElementById("newsletter-form").addEventListener("submit",e=>{
  e.preventDefault();document.getElementById("newsletter-message").textContent="Thanks for your interest! Email collection isn't connected in this demo yet.";e.target.reset();
});
document.getElementById("contact-link").addEventListener("click",e=>{e.preventDefault();showToast("Add your business email in index.html before launch.");});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
