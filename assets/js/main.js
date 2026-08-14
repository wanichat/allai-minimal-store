/* ==========================================================================
   ALLAI — app behaviour
   Vanilla JS, no build step. Cart + wishlist persist in localStorage.
   ========================================================================== */

document.documentElement.classList.add('js');

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const store = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

const Cart = {
  key: 'allai.cart',
  all() { return store.read(this.key, []); },
  save(items) { store.write(this.key, items); paintCartCount(); },
  add(id, color, size, qty = 1) {
    const items = this.all();
    const hit = items.find(i => i.id === id && i.color === color && i.size === size);
    if (hit) hit.qty += qty; else items.push({ id, color, size, qty });
    this.save(items);
  },
  remove(index) { const i = this.all(); i.splice(index, 1); this.save(i); },
  setQty(index, qty) {
    const items = this.all();
    if (!items[index]) return;
    items[index].qty = Math.max(1, qty);
    this.save(items);
  },
  count() { return this.all().reduce((n, i) => n + i.qty, 0); },
  subtotal() {
    return this.all().reduce((sum, i) => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return p ? sum + p.price * i.qty : sum;
    }, 0);
  }
};

const Wish = {
  key: 'allai.wishlist',
  all() { return store.read(this.key, []); },
  has(id) { return this.all().includes(id); },
  toggle(id) {
    const list = this.all();
    const at = list.indexOf(id);
    if (at > -1) list.splice(at, 1); else list.push(id);
    store.write(this.key, list);
    return at === -1;
  }
};

/* ------------------------------------------------------------- toast -- */
let toastTimer;
function toast(message) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span></span>`;
    document.body.appendChild(el);
  }
  $('span', el).textContent = message;
  requestAnimationFrame(() => el.classList.add('is-on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
}

/* -------------------------------------------------------------- chrome -- */
function paintCartCount() {
  const n = Cart.count();
  $$('.cart-count').forEach(el => {
    el.textContent = n;
    el.style.display = n ? '' : 'none';
  });
}

function initChrome() {
  const drawer  = $('#drawer');
  const overlay = $('#overlay');
  const open  = () => { drawer?.classList.add('is-open'); overlay?.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer?.classList.remove('is-open'); overlay?.classList.remove('is-open'); document.body.style.overflow = ''; };

  $('#burger')?.addEventListener('click', open);
  $('#drawer-close')?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  $$('[data-search]').forEach(btn => btn.addEventListener('click', () => {
    const q = prompt('ค้นหาสินค้า — ลองพิมพ์ "เดรส", "เชิ้ต" หรือ "linen"');
    if (q && q.trim()) location.href = `shop.html?q=${encodeURIComponent(q.trim())}`;
  }));

  // mark the active nav item
  const page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link, .drawer nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('is-active');
  });

  paintCartCount();
}

/* ------------------------------------------------------------- reveal -- */
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('is-in'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('is-in'), Math.min(i * 70, 350));
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));

  // safety net: never leave content stuck invisible
  clearTimeout(initReveal.timer);
  initReveal.timer = setTimeout(() => $$('.reveal').forEach(el => el.classList.add('is-in')), 2500);
}

/* ---------------------------------------------------------- accordion -- */
function initAccordion() {
  $$('.acc__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc__item');
      const open = item.classList.contains('is-open');
      if (btn.closest('.acc').dataset.single !== 'false') {
        $$('.acc__item', btn.closest('.acc')).forEach(i => i.classList.remove('is-open'));
      }
      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
}

/* ----------------------------------------------------------- product -- */
function productCard(p) {
  const colorHex = PALETTE[p.colors[0]].hex;
  const tagMap = { new: 'New In', sale: 'Sale', best: 'Best Seller' };
  const tag = p.tag
    ? `<span class="card__tag ${p.tag === 'sale' ? 'card__tag--sale' : ''}">${tagMap[p.tag]}</span>` : '';
  const price = p.old
    ? `<del>${formatTHB(p.old)}</del><ins>${formatTHB(p.price)}</ins>`
    : formatTHB(p.price);

  return `
  <article class="card reveal" data-id="${p.id}">
    <a class="card__media" href="product.html?id=${p.id}" aria-label="${p.name}">
      ${garmentSVG(p.garment, colorHex)}
      ${tag}
    </a>
    <button class="card__fav ${Wish.has(p.id) ? 'is-on' : ''}" data-fav="${p.id}"
            aria-label="เพิ่มลงรายการที่ชอบ">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="${Wish.has(p.id) ? 'currentColor' : 'none'}"
           stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
    </button>
    <button class="card__quick" data-quick="${p.id}">หยิบใส่ตะกร้า</button>
    <div class="card__body">
      <h3 class="card__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="card__meta">${p.th}</p>
      <p class="card__price">${price}</p>
      <div class="swatches">
        ${p.colors.map(c => `<span class="swatch" style="background:${PALETTE[c].hex}" title="${PALETTE[c].name}"></span>`).join('')}
      </div>
    </div>
  </article>`;
}

function bindCardActions(root = document) {
  $$('[data-fav]', root).forEach(btn => btn.addEventListener('click', () => {
    const on = Wish.toggle(btn.dataset.fav);
    btn.classList.toggle('is-on', on);
    $('svg', btn).setAttribute('fill', on ? 'currentColor' : 'none');
    toast(on ? 'บันทึกลงรายการที่ชอบแล้ว' : 'นำออกจากรายการที่ชอบแล้ว');
  }));

  $$('[data-quick]', root).forEach(btn => btn.addEventListener('click', () => {
    const p = PRODUCTS.find(x => x.id === btn.dataset.quick);
    Cart.add(p.id, p.colors[0], p.sizes[Math.min(1, p.sizes.length - 1)], 1);
    toast(`เพิ่ม “${p.name}” ลงตะกร้าแล้ว`);
  }));
}

function renderGrid(target, list) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  el.innerHTML = list.length
    ? list.map(productCard).join('')
    : `<p class="muted" style="grid-column:1/-1;padding:48px 0;text-align:center">
         ไม่พบสินค้าที่ตรงกับเงื่อนไข — ลองปรับตัวกรองดูอีกครั้ง</p>`;
  bindCardActions(el);
  initReveal();
}

/* -------------------------------------------------------------- home -- */
function initHome() {
  const featured = $('#grid-featured');
  if (!featured) return;

  renderGrid(featured, PRODUCTS.filter(p => p.isNew || p.tag === 'best').slice(0, 8));

  // category cards
  const cats = $('#cat-grid');
  if (cats) {
    cats.innerHTML = CATEGORIES.slice(0, 4).map(c => `
      <a class="cat-card reveal" href="shop.html?cat=${c.slug}">
        <figure>${garmentSVG(c.garment, '#F2BFCF')}
          <figcaption><h3>${c.name}</h3><small>${c.en} — ช้อปเลย</small></figcaption>
        </figure>
      </a>`).join('');
  }

  // lookbook
  const look = $('#look-grid');
  if (look) {
    const items = [
      { cls: 'look--tall', cap: 'Soft Morning' },
      { cls: 'look--wide', cap: 'Everyday Neutral' },
      { cls: '',           cap: 'Pink Hour' },
      { cls: '',           cap: 'City Layer' },
      { cls: 'look--wide', cap: 'Weekend Off' }
    ];
    look.innerHTML = items.map((it, i) => `
      <figure class="look ${it.cls} reveal">${sceneSVG(i)}
        <figcaption class="look__cap">${it.cap}</figcaption>
      </figure>`).join('');
  }

  $('#hero-art')?.insertAdjacentHTML('afterbegin', sceneSVG(1));
  $('#split-art')?.insertAdjacentHTML('afterbegin', sceneSVG(2));
  initReveal();
}

/* -------------------------------------------------------------- shop -- */
function initShop() {
  const grid = $('#grid-shop');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  const state = {
    cats: params.get('cat') ? [params.get('cat')] : [],
    sizes: [],
    max: 4000,
    sort: 'featured',
    q: params.get('q') || ''
  };

  // build category filters
  $('#f-cats').innerHTML = CATEGORIES.map(c => `
    <label>
      <input type="checkbox" value="${c.slug}" ${state.cats.includes(c.slug) ? 'checked' : ''}>
      ${c.name}
      <span class="count">${PRODUCTS.filter(p => p.cat === c.slug).length}</span>
    </label>`).join('');

  const allSizes = [...new Set(PRODUCTS.flatMap(p => p.sizes))];
  $('#f-sizes').innerHTML = allSizes
    .map(s => `<button class="chip" data-size="${s}">${s}</button>`).join('');

  if (state.q) $('#f-search').value = state.q;

  function apply() {
    let list = PRODUCTS.filter(p =>
      (!state.cats.length || state.cats.includes(p.cat)) &&
      (!state.sizes.length || p.sizes.some(s => state.sizes.includes(s))) &&
      p.price <= state.max &&
      (!state.q || `${p.name} ${p.th} ${p.material} ${p.cat}`.toLowerCase().includes(state.q.toLowerCase()))
    );

    const sorters = {
      'price-asc':  (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'new':        (a, b) => Number(b.isNew) - Number(a.isNew),
      'rating':     (a, b) => b.rating - a.rating
    };
    if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);

    $('#result-count').textContent = `${list.length} รายการ`;
    renderGrid(grid, list);
  }

  $('#f-cats').addEventListener('change', () => {
    state.cats = $$('#f-cats input:checked').map(i => i.value);
    apply();
  });

  $('#f-sizes').addEventListener('click', e => {
    const chip = e.target.closest('[data-size]');
    if (!chip) return;
    chip.classList.toggle('is-on');
    state.sizes = $$('#f-sizes .chip.is-on').map(c => c.dataset.size);
    apply();
  });

  $('#f-price').addEventListener('input', e => {
    state.max = Number(e.target.value);
    $('#f-price-out').textContent = `สูงสุด ${formatTHB(state.max)}`;
    apply();
  });

  $('#f-search').addEventListener('input', e => { state.q = e.target.value; apply(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; apply(); });

  $('#f-reset').addEventListener('click', () => {
    state.cats = []; state.sizes = []; state.max = 4000; state.q = ''; state.sort = 'featured';
    $$('#f-cats input').forEach(i => (i.checked = false));
    $$('#f-sizes .chip').forEach(c => c.classList.remove('is-on'));
    $('#f-price').value = 4000;
    $('#f-price-out').textContent = 'สูงสุด ฿4,000';
    $('#f-search').value = '';
    $('#sort').value = 'featured';
    apply();
  });

  apply();
}

/* ------------------------------------------------------------- pdp -- */
function initPDP() {
  const root = $('#pdp');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id');
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

  const sel = { color: p.colors[0], size: p.sizes[Math.min(1, p.sizes.length - 1)], qty: 1 };

  document.title = `${p.name} — ALLAI`;
  $('#crumb-name').textContent = p.name;
  $('#pdp-title').textContent = p.name;
  $('#pdp-sub').textContent = `${p.th} · ${p.material}`;
  $('#pdp-desc').textContent = p.desc;
  $('#pdp-rating').innerHTML =
    `<span style="color:var(--pink-500)">${'★'.repeat(Math.round(p.rating))}</span>
     <span class="muted">${p.rating} · ${p.reviews} รีวิว</span>`;
  $('#pdp-price').innerHTML = p.old
    ? `<del>${formatTHB(p.old)}</del><ins>${formatTHB(p.price)}</ins>`
    : formatTHB(p.price);
  $('#spec-material').textContent = p.material;
  $('#spec-code').textContent = p.id.toUpperCase();

  function paintArt() {
    const hex = PALETTE[sel.color].hex;
    $('#gallery-main').innerHTML = garmentSVG(p.garment, hex);
    $('#gallery-thumbs').innerHTML = [p.garment, 'tee', 'bag', p.garment]
      .map((g, i) => `<button class="${i === 0 ? 'is-on' : ''}" data-thumb="${g}">${garmentSVG(g, hex)}</button>`)
      .join('');
    $$('#gallery-thumbs button').forEach(b => b.addEventListener('click', () => {
      $$('#gallery-thumbs button').forEach(x => x.classList.remove('is-on'));
      b.classList.add('is-on');
      $('#gallery-main').innerHTML = garmentSVG(b.dataset.thumb, PALETTE[sel.color].hex);
    }));
  }

  $('#pdp-colors').innerHTML = p.colors.map(c => `
    <button class="color-opt ${c === sel.color ? 'is-on' : ''}" data-color="${c}"
            style="background:${PALETTE[c].hex}" title="${PALETTE[c].name}"
            aria-label="สี ${PALETTE[c].name}"></button>`).join('');
  $('#pdp-color-name').textContent = PALETTE[sel.color].name;

  $('#pdp-sizes').innerHTML = p.sizes.map(s => `
    <button class="chip ${s === sel.size ? 'is-on' : ''}" data-size="${s}">${s}</button>`).join('');

  $('#pdp-colors').addEventListener('click', e => {
    const b = e.target.closest('[data-color]');
    if (!b) return;
    sel.color = b.dataset.color;
    $$('#pdp-colors .color-opt').forEach(x => x.classList.remove('is-on'));
    b.classList.add('is-on');
    $('#pdp-color-name').textContent = PALETTE[sel.color].name;
    paintArt();
  });

  $('#pdp-sizes').addEventListener('click', e => {
    const b = e.target.closest('[data-size]');
    if (!b) return;
    sel.size = b.dataset.size;
    $$('#pdp-sizes .chip').forEach(x => x.classList.remove('is-on'));
    b.classList.add('is-on');
  });

  $('#qty-minus').addEventListener('click', () => { sel.qty = Math.max(1, sel.qty - 1); $('#qty-val').textContent = sel.qty; });
  $('#qty-plus').addEventListener('click',  () => { sel.qty = Math.min(9, sel.qty + 1); $('#qty-val').textContent = sel.qty; });

  $('#add-to-cart').addEventListener('click', () => {
    Cart.add(p.id, sel.color, sel.size, sel.qty);
    toast(`เพิ่ม “${p.name}” (${PALETTE[sel.color].name} / ${sel.size}) แล้ว`);
  });
  $('#buy-now').addEventListener('click', () => {
    Cart.add(p.id, sel.color, sel.size, sel.qty);
    location.href = 'cart.html';
  });
  $('#pdp-fav').addEventListener('click', () => {
    const on = Wish.toggle(p.id);
    toast(on ? 'บันทึกลงรายการที่ชอบแล้ว' : 'นำออกจากรายการที่ชอบแล้ว');
  });

  paintArt();

  // same category first, then top up with other pieces so the row stays full
  const sameCat = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id);
  const filler  = PRODUCTS.filter(x => x.cat !== p.cat && x.id !== p.id);
  renderGrid('#grid-related', [...sameCat, ...filler].slice(0, 4));
}

/* -------------------------------------------------------------- cart -- */
function initCart() {
  const list = $('#cart-list');
  if (!list) return;

  function paint() {
    const items = Cart.all();

    if (!items.length) {
      list.innerHTML = `
        <div class="empty-cart">
          <h3 class="display h3">ตะกร้ายังว่างอยู่</h3>
          <p class="muted">เลือกชิ้นโปรดของคุณจากคอลเลกชันล่าสุดได้เลย</p>
          <a class="btn btn--primary" href="shop.html">เริ่มช้อป</a>
        </div>`;
      $('#cart-summary').style.display = 'none';
      return;
    }
    $('#cart-summary').style.display = '';

    list.innerHTML = items.map((it, i) => {
      const p = PRODUCTS.find(x => x.id === it.id);
      if (!p) return '';
      return `
      <div class="cart-row">
        <a class="cart-row__media" href="product.html?id=${p.id}">${garmentSVG(p.garment, PALETTE[it.color].hex)}</a>
        <div>
          <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
          <p class="opts">${PALETTE[it.color].name} · ไซส์ ${it.size}</p>
          <div class="qty">
            <button data-dec="${i}" aria-label="ลดจำนวน">−</button>
            <span>${it.qty}</span>
            <button data-inc="${i}" aria-label="เพิ่มจำนวน">+</button>
          </div>
        </div>
        <div class="cart-row__right">
          <strong>${formatTHB(p.price * it.qty)}</strong>
          <button class="remove" data-del="${i}">ลบออก</button>
        </div>
      </div>`;
    }).join('');

    const sub = Cart.subtotal();
    const ship = sub >= 1500 || sub === 0 ? 0 : 60;
    // recompute from the code each time so the discount tracks cart changes
    const discount = store.read('allai.promo', '') === 'ALLAI10' ? Math.round(sub * 0.1) : 0;
    const total = Math.max(0, sub - discount + ship);

    $('#sum-sub').textContent = formatTHB(sub);
    $('#sum-ship').textContent = ship ? formatTHB(ship) : 'ฟรี';
    $('#sum-discount').textContent = discount ? '−' + formatTHB(discount) : '฿0';
    $('#sum-total').textContent = formatTHB(total);
    $('#free-ship-note').textContent = sub >= 1500
      ? 'คุณได้รับสิทธิ์จัดส่งฟรีแล้ว'
      : `ซื้อเพิ่มอีก ${formatTHB(1500 - sub)} รับส่งฟรี`;

    $$('[data-inc]', list).forEach(b => b.addEventListener('click', () => { Cart.setQty(+b.dataset.inc, Cart.all()[+b.dataset.inc].qty + 1); paint(); }));
    $$('[data-dec]', list).forEach(b => b.addEventListener('click', () => { Cart.setQty(+b.dataset.dec, Cart.all()[+b.dataset.dec].qty - 1); paint(); }));
    $$('[data-del]', list).forEach(b => b.addEventListener('click', () => { Cart.remove(+b.dataset.del); toast('นำสินค้าออกแล้ว'); paint(); }));
  }

  $('#promo-apply')?.addEventListener('click', () => {
    const code = $('#promo-code').value.trim().toUpperCase();
    if (code === 'ALLAI10') {
      store.write('allai.promo', 'ALLAI10');
      toast('ใช้โค้ด ALLAI10 — ลด 10% แล้ว');
    } else {
      store.write('allai.promo', '');
      toast('ไม่พบโค้ดส่วนลดนี้');
    }
    paint();
  });

  $('#checkout')?.addEventListener('click', () => toast('นี่คือ mockup — ขั้นตอนชำระเงินยังไม่เปิดใช้งาน'));

  paint();
}

/* ------------------------------------------------------------- forms -- */
function initForms() {
  $$('form[data-mock]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.reset();
      toast(form.dataset.mock);
    });
  });

  const team = $('#team-grid');
  if (team) $$('.team__ava', team).forEach((el, i) => (el.innerHTML = avatarSVG(i)));

  $('#about-art')?.insertAdjacentHTML('afterbegin', sceneSVG(0));
  $('#about-art-2')?.insertAdjacentHTML('afterbegin', sceneSVG(3));
}

/* -------------------------------------------------------------- boot -- */
document.addEventListener('DOMContentLoaded', () => {
  initChrome();
  initAccordion();
  initHome();
  initShop();
  initPDP();
  initCart();
  initForms();
  initReveal();
  $('#year') && ($('#year').textContent = new Date().getFullYear());
});
