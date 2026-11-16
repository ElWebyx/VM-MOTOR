/* =========================================================
   VM MOTOR · Interacción
   ========================================================= */
window.__startSite = (CFG) => {
  CFG = CFG || {};

  // ---- Datos de contacto (editar aquí) ----
  // PENDIENTE: confirmar que el 628 015 594 es el número de WhatsApp.
  const WHATSAPP = (CFG.whatsapp || "34628015594").replace(/\D/g, "");
  const PHOTO_BASE = "https://pro.fastly.ccdn.es/pro/pro/vehicles/images/";
  const PHOTO_SIZES = { card: ["1280x960", "800x600cut"], big: ["1280x960", "1024x768cut"] };
  // Coche que aparece en la portada (si se vende, se usa el primero del stock)
  const HERO_CAR = INVENTORY.find(c => c.model.startsWith("Serie 3")) || INVENTORY[0];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const group = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const euro = n => group(n) + " €";
  const km = n => group(n) + " km";
  const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Fotos con respaldo ----------
  // Si una foto no carga se prueba un tamaño menor; si ninguno carga, se muestra un fondo de marca.
  // Fotos incrustadas en el propio archivo (si existen) para que se vean siempre, incluso sin conexión
  const EMBEDDED = (typeof PHOTO_DATA !== "undefined") ? PHOTO_DATA : {};
  function loadPhoto(img, path, onFail, size = "card") {
    if (!path) { onFail(); return; }
    if (path.startsWith("fs:")) { // foto subida desde el panel (Firestore)
      img.onerror = onFail;
      (window.vmPhoto ? window.vmPhoto(path.slice(3)) : Promise.reject()).then(src => (img.src = src)).catch(onFail);
      return;
    }
    if (path.startsWith("data:")) { img.onerror = onFail; img.src = path; return; }
    if (EMBEDDED[path]) {
      // si hay versión incrustada se usa; en la galería grande se intenta mejorar con la remota
      img.onerror = onFail;
      img.src = EMBEDDED[path];
      return;
    }
    if (!/^[0-9a-f]{2}\//.test(path)) { img.onerror = onFail; img.src = path; return; } // URL completa o ruta propia
    const sizes = PHOTO_SIZES[size];
    let i = 0;
    const next = () => {
      if (i >= sizes.length) { onFail(); return; }
      img.src = `${PHOTO_BASE}${path}/${sizes[i++]}/`;
    };
    img.onerror = next;
    next();
  }

  // ---------- Hero: foto de fondo ----------
  const heroShop = $("#hero-shop");
  if (heroShop && EMBEDDED["local-escaparate"]) {
    heroShop.onload = () => heroShop.classList.add("is-loaded");
    heroShop.src = EMBEDDED["local-escaparate"];
  }
  const heroBg = $("#hero-bg");
  if (heroBg) {
    const small = matchMedia("(max-width: 900px)").matches;
    heroBg.onload = () => heroBg.classList.add("is-loaded");
    heroBg.src = EMBEDDED[small ? "hero-car-sm" : "hero-car"] || EMBEDDED[small ? "hero-bg-sm" : "hero-bg"] || `https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=${small ? 1100 : 2200}&q=80&fm=jpg`;
  }
  $$('[data-count="stock"]').forEach(el => (el.textContent = INVENTORY.length));

  // ---------- Inventario ----------
  const grid = $("#cars");
  const icons = {
    road: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 9 4M20 20 15 4M12 6v2M12 11v2M12 16v2"/></svg>',
    fuel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M3 20h12M4 10h10M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/></svg>',
    power: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
  };

  // ---------- Favoritos (se guardan solo en este navegador) ----------
  INVENTORY.forEach((c, i) => (c.id = c.id || `${c.brand}-${c.model}-${c.year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")));
  const FAV_KEY = "vmmotor-favs";
  let favs = new Set();
  try { favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch (e) {}
  const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch (e) {} };
  const updateFavCount = () => ($("#fav-count").textContent = [...favs].filter(id => INVENTORY.some(c => c.id === id)).length);

  function carCard(car, i) {
    const name = `${car.brand} ${car.model}`;
    const msg = `Hola VM MOTOR, me interesa el ${name} (${car.year}, ${km(car.km)}) de ${euro(car.price)}. ¿Sigue disponible?`;
    const el = document.createElement("article");
    el.className = "car";
    el.style.animationDelay = reduceMotion ? "0s" : `${Math.min(i, 8) * 50}ms`;
    el.innerHTML = `
      <div class="car__media">
        <img alt="${name}, ${car.year}" loading="lazy" decoding="async" width="800" height="600">
        ${car.photos.length > 1 ? '<img class="car__alt" alt="" loading="lazy" decoding="async" width="800" height="600">' : ""}
        <span class="car__shade" aria-hidden="true"></span>
        ${car.estado === "reservado" ? '<span class="car__badge car__badge--res">Reservado</span>' : '<span class="car__badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.4 8.6 8 9.6 4.6-1 8-4.6 8-9.6V6l-8-3z"/></svg>Garantía 1 año</span>'}
        <button type="button" class="car__fav" aria-pressed="${favs.has(car.id)}" aria-label="Guardar ${name}">${icons.heart}</button>
        <div class="car__title">
          <span class="car__mk">${car.brand}</span>
          <h3 class="car__model"><button type="button" data-open>${car.model}</button></h3>
        </div>
        <span class="car__count"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/></svg>${car.photos.length} fotos</span>
      </div>
      <div class="car__body">
        <div class="car__pricebox">
          <div>
            <span class="car__label">Precio final</span>
            <p class="car__price">${euro(car.price)}</p>
            <span class="car__note">IGIC incluido</span>
          </div>
          <a class="car__link" href="${car.url}" target="_blank" rel="noopener" aria-label="Ver la ficha completa del ${name} en coches.net" title="Ver ficha en coches.net">${icons.ext}</a>
        </div>
        <dl class="car__grid">
          <div><dt>Año</dt><dd>${car.year}</dd></div>
          <div><dt>Kilómetros</dt><dd>${km(car.km)}</dd></div>
          <div><dt>Combustible</dt><dd>${car.fuel}</dd></div>
          <div><dt>Potencia</dt><dd>${car.hp} CV</dd></div>
        </dl>
        <a class="car__cta" href="${waLink(msg)}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp por el ${name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>
          Consultar por WhatsApp
          <span class="car__arrow" aria-hidden="true">→</span>
        </a>
      </div>`;
    const img = $("img", el);
    $(".car__media", el).prepend(placeholder(car));
    img.onload = () => img.classList.add("is-loaded");
    loadPhoto(img, car.photos[0], () => img.remove());
    const alt = $(".car__alt", el);
    if (alt) {
      // la segunda foto se carga solo al pasar el ratón por primera vez
      el.addEventListener("pointerenter", () => {
        if (alt.dataset.loaded) return;
        alt.dataset.loaded = "1";
        alt.onload = () => alt.classList.add("is-loaded");
        loadPhoto(alt, car.photos[1], () => alt.remove());
      }, { once: true });
    }

    const favBtn = $(".car__fav", el);
    favBtn.addEventListener("click", e => {
      e.stopPropagation();
      favs.has(car.id) ? favs.delete(car.id) : favs.add(car.id);
      const on = favs.has(car.id);
      favBtn.setAttribute("aria-pressed", on);
      favBtn.setAttribute("aria-label", (on ? "Quitar de guardados " : "Guardar ") + name);
      favBtn.classList.remove("pop"); void favBtn.offsetWidth; favBtn.classList.add("pop");
      saveFavs(); updateFavCount();
      if (state.fav && !on) render();
    });
    $(".car__media", el).addEventListener("click", () => openModal(car));
    $("[data-open]", el).addEventListener("click", e => { e.stopPropagation(); openModal(car); });
    return el;
  }

  function placeholder(car) {
    const ph = document.createElement("div");
    ph.className = "car__ph";
    ph.innerHTML = `<strong>${car.brand}</strong><span>Fotos en la ficha</span>`;
    return ph;
  }

  // ---------- Ficha del vehículo (modal) ----------
  const modal = $("#car-modal");
  function openModal(car) {
    const name = `${car.brand} ${car.model}`;
    $("#modal-brand").textContent = "";
    $("#modal-title").textContent = `${car.brand} ${car.model}`;
    $("#modal-price").textContent = euro(car.price);
    const specs = [["Año", car.year], ["Kilómetros", km(car.km)], ["Combustible", car.fuel], ["Potencia", `${car.hp} CV`],
                   ["Garantía", "1 año"], ["Ubicación", "Guanarteme, Las Palmas"]];
    $("#modal-specs").innerHTML = specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    $("#modal-wa").href = waLink(`Hola VM MOTOR, me interesa el ${name} (${car.year}, ${km(car.km)}) de ${euro(car.price)}. ¿Sigue disponible?`);
    $("#modal-ext").href = car.url;
    gallery.car = car;
    const thumbs = $("#gal-thumbs");
    thumbs.replaceChildren(...car.photos.map((p, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "gal__thumb"; b.setAttribute("aria-label", `Foto ${i + 1} de ${car.photos.length}`);
      const t = new Image(); t.alt = ""; t.loading = "lazy";
      t.onload = () => t.classList.add("is-loaded");
      loadPhoto(t, p, () => t.remove());
      b.append(t);
      b.addEventListener("click", () => showPhoto(i));
      return b;
    }));
    $(".modal__gallery").classList.toggle("is-single", car.photos.length < 2);
    showPhoto(0);
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  const gallery = { car: null, i: 0 };
  function showPhoto(i) {
    const car = gallery.car, n = car.photos.length;
    gallery.i = (i + n) % n;
    const media = $("#modal-media");
    const img = new Image();
    img.alt = `${car.brand} ${car.model}, foto ${gallery.i + 1} de ${n}`;
    img.onload = () => { img.classList.add("is-loaded"); [...media.querySelectorAll("img")].slice(0, -1).forEach(o => setTimeout(() => o.remove(), 500)); };
    if (!media.querySelector(".car__ph")) media.append(placeholder(car));
    media.append(img);
    loadPhoto(img, car.photos[gallery.i], () => img.remove(), "big");
    $("#gal-count").textContent = `${gallery.i + 1} / ${n}`;
    $$(".gal__thumb").forEach((t, k) => t.classList.toggle("is-active", k === gallery.i));
    $$(".gal__thumb")[gallery.i]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }
  $(".gal__prev").addEventListener("click", () => showPhoto(gallery.i - 1));
  $(".gal__next").addEventListener("click", () => showPhoto(gallery.i + 1));
  modal.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") showPhoto(gallery.i + 1);
    if (e.key === "ArrowLeft") showPhoto(gallery.i - 1);
  });
  // deslizar con el dedo en móvil
  let touchX = null;
  $("#modal-media").addEventListener("touchstart", e => (touchX = e.touches[0].clientX), { passive: true });
  $("#modal-media").addEventListener("touchend", e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) showPhoto(gallery.i + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  const closeModal = () => { modal.close ? modal.close() : modal.removeAttribute("open"); };
  modal.addEventListener("close", () => (document.body.style.overflow = ""));
  modal.addEventListener("click", e => { if (e.target === modal || e.target.closest("[data-close]")) closeModal(); });

  // ---------- Fotos de la sección "Sobre nosotros" ----------
  $$("[data-src], .contact__bg[data-photo], .services__pic[data-photo], .way__pic[data-photo], .tile__pic[data-photo], .why__pic[data-photo], .map__static[data-photo]").forEach(box => {
    const src = EMBEDDED[box.dataset.photo] || box.dataset.src;
    if (!src) return;
    const img = new Image(); img.alt = box.dataset.alt || ""; img.loading = "lazy"; img.decoding = "async";
    img.onload = () => img.classList.add("is-loaded");
    img.onerror = () => img.remove();
    img.src = src;
    box.append(img);
  });

  // ---------- Coche destacado: el más reciente del stock ----------
  const spotCar = [...INVENTORY].sort((a, b) => b.year - a.year || b.price - a.price)[0];
  if (spotCar && $("#spot-media")) {
    const name = `${spotCar.brand} ${spotCar.model}`;
    $("#spot-brand").textContent = spotCar.brand;
    $("#spot-title").textContent = spotCar.model;
    $("#spot-year").textContent = spotCar.year;
    $("#spot-km").textContent = km(spotCar.km);
    $("#spot-hp").textContent = `${spotCar.hp} CV`;
    $("#spot-fuel").textContent = spotCar.fuel;
    $("#spot-price").textContent = euro(spotCar.price);
    $("#spot-wa").href = waLink(`Hola VM MOTOR, me interesa el ${name} (${spotCar.year}, ${km(spotCar.km)}) de ${euro(spotCar.price)}. ¿Sigue disponible?`);
    $("#spot-more").addEventListener("click", () => openModal(spotCar));
    const media = $("#spot-media");
    media.append(placeholder(spotCar));
    const img = new Image(); img.alt = name; img.loading = "lazy";
    img.onload = () => img.classList.add("is-loaded");
    media.append(img);
    loadPhoto(img, spotCar.photos[0], () => img.remove(), "big");
  }

  // ---------- Exposición: el local + una selección de coches ----------
  const sg = $("#showroom-grid");
  if (sg) {
    const shop = EMBEDDED["local-escaparate"];
    if (shop) {
      const fig = document.createElement("a");
      fig.className = "sr sr--main reveal";
      fig.href = "https://www.google.com/maps/place/V+M+Motor/@28.1288191,-15.4425195,17z";
      fig.target = "_blank"; fig.rel = "noopener";
      fig.innerHTML = `<div class="sr__img"><img class="is-loaded" src="${shop}" alt="Escaparate de VM MOTOR en la calle Almansa 78" loading="lazy"><span class="sr__tag">Nuestro local</span></div>
        <div class="sr__cap"><strong>Calle Almansa 78, Guanarteme</strong><span>Lunes a viernes · 9:00–13:30 y 16:30–19:00</span></div>`;
      sg.append(fig);
    }
    INVENTORY.filter(c => c.photos.length > 1).slice(0, 4).forEach(car => {
      const fig = document.createElement("button");
      fig.type = "button";
      fig.className = "sr reveal";
      fig.setAttribute("aria-label", `Ver ficha del ${car.brand} ${car.model}`);
      fig.innerHTML = `<div class="sr__img"><span class="sr__tag">${car.year}</span></div>
        <div class="sr__cap"><strong>${car.brand} ${car.model}</strong><span>${km(car.km)} · ${car.fuel}</span><b>${euro(car.price)}</b></div>`;
      const box = $(".sr__img", fig);
      box.prepend(placeholder(car));
      const img = new Image(); img.alt = `${car.brand} ${car.model} en la exposición de VM MOTOR`; img.loading = "lazy"; img.decoding = "async";
      img.onload = () => img.classList.add("is-loaded");
      box.prepend(img);
      loadPhoto(img, car.photos[1] || car.photos[0], () => img.remove());
      fig.addEventListener("click", () => openModal(car));
      sg.append(fig);
    });
  }

  // ---------- Horario: ¿abierto ahora? (hora de Canarias) ----------
  const status = $("#open-status");
  if (status) {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Atlantic/Canary", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      const get = t => parts.find(p => p.type === t).value;
      const day = get("weekday"), mins = +get("hour") * 60 + +get("minute");
      const weekday = !["Sat", "Sun"].includes(day);
      const open = weekday && ((mins >= 540 && mins < 810) || (mins >= 990 && mins < 1140));
      status.textContent = open ? "Abierto ahora" : "Cerrado ahora";
      status.classList.add(open ? "is-open" : "is-closed");
    } catch (e) { status.remove(); }
  }

  // ---------- Instagram: se carga solo al llegar a la sección ----------
  const ig = $("#insta-grid");
  if (ig) {
    new IntersectionObserver(([en], o) => {
      if (!en.isIntersecting) return;
      o.disconnect();
      const sc = document.createElement("script");
      sc.async = true; sc.src = "https://www.instagram.com/embed.js";
      document.body.append(sc);
    }, { rootMargin: "400px" }).observe(ig);
  }

  // ---------- Filtros ----------
  const state = { fuel: "", brand: "", year: "", price: Infinity, min: 0, sort: "price-desc", q: "", fav: false };
  const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const fBrand = $("#f-brand"), fYear = $("#f-year"), fPrice = $("#f-price"), fPriceOut = $("#f-price-out"), fSort = $("#f-sort");

  const brands = [...new Set(INVENTORY.map(c => c.brand))].sort((a, b) => a.localeCompare(b, "es"));
  brands.forEach(b => fBrand.add(new Option(b, b)));
  const years = [...new Set(INVENTORY.map(c => c.year))].sort((a, b) => b - a);
  years.forEach(y => fYear.add(new Option(`${y} o posterior`, y)));

  const prices = INVENTORY.map(c => c.price);
  const minP = Math.floor(Math.min(...prices) / 500) * 500;
  const maxP = Math.ceil(Math.max(...prices) / 500) * 500;
  fPrice.min = minP; fPrice.max = maxP; fPrice.value = maxP;
  const setPriceOut = () => (fPriceOut.textContent = +fPrice.value >= maxP ? "Sin límite" : euro(+fPrice.value));
  setPriceOut();

  const sorters = {
    "price-desc": (a, b) => b.price - a.price,
    "price-asc": (a, b) => a.price - b.price,
    "year-desc": (a, b) => b.year - a.year,
    "km-asc": (a, b) => a.km - b.km
  };

  function render() {
    const list = INVENTORY
      .filter(c => !state.fuel || c.fuel === state.fuel)
      .filter(c => !state.brand || c.brand === state.brand)
      .filter(c => !state.year || c.year >= +state.year)
      .filter(c => c.price <= state.price && c.price >= state.min)
      .filter(c => !state.q || norm(`${c.brand} ${c.model}`).includes(norm(state.q)))
      .filter(c => !state.fav || favs.has(c.id))
      .sort(sorters[state.sort]);
    grid.replaceChildren(...list.map(carCard));
    $("#empty").hidden = list.length > 0;
    $("#stock-count").innerHTML = list.length === INVENTORY.length
      ? `Mostrando los <b>${list.length}</b> vehículos disponibles`
      : `Mostrando <b>${list.length}</b> de ${INVENTORY.length} vehículos`;
  }

  const fuelChips = $$(".chip[data-fuel]");
  fuelChips.forEach(chip => chip.addEventListener("click", () => {
    fuelChips.forEach(c => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-pressed", c === chip); });
    state.fuel = chip.dataset.fuel; render();
  }));
  const favChip = $("#fav-chip");
  favChip.addEventListener("click", () => {
    state.fav = !state.fav;
    favChip.classList.toggle("is-active", state.fav);
    favChip.setAttribute("aria-pressed", state.fav);
    render();
  });
  let qTimer;
  $("#f-q").addEventListener("input", e => { clearTimeout(qTimer); qTimer = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 120); });
  fBrand.addEventListener("change", () => { state.brand = fBrand.value; render(); });
  fYear.addEventListener("change", () => { state.year = fYear.value; render(); });
  fSort.addEventListener("change", () => { state.sort = fSort.value; render(); });
  fPrice.addEventListener("input", () => { setPriceOut(); state.price = +fPrice.value >= maxP ? Infinity : +fPrice.value; render(); });
  $("#reset-filters").addEventListener("click", () => {
    Object.assign(state, { fuel: "", brand: "", year: "", price: Infinity, min: 0, q: "", fav: false });
    fBrand.value = ""; fYear.value = ""; fPrice.value = maxP; setPriceOut(); $("#f-q").value = "";
    fuelChips.forEach((c, i) => c.classList.toggle("is-active", i === 0));
    favChip.classList.remove("is-active"); favChip.setAttribute("aria-pressed", false);
    render();
  });
  updateFavCount();
  render();

  // ---------- Encuentra tu coche: por presupuesto y por marca ----------
  const goStock = () => $("#stock").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  function applyFilter({ brand = "", min = 0, max = Infinity }) {
    Object.assign(state, { fuel: "", year: "", q: "", fav: false, brand, min, price: max });
    fBrand.value = brand; fYear.value = ""; $("#f-q").value = "";
    fPrice.value = max === Infinity ? maxP : Math.min(maxP, max); setPriceOut();
    fuelChips.forEach((c, i) => c.classList.toggle("is-active", i === 0));
    render(); goStock();
  }
  const budgets = [
    { label: "Hasta 8.000 €", min: 0, max: 8000, text: "Para moverte por la isla gastando poco." },
    { label: "De 8.000 a 12.000 €", min: 8001, max: 12000, text: "El punto medio: más equipamiento, mismo cuidado." },
    { label: "Más de 12.000 €", min: 12001, max: Infinity, text: "Los más recientes y mejor equipados del stock." }
  ];
  const fb = $("#finder-budgets");
  if (fb) {
    budgets.forEach(bd => {
      const cars = INVENTORY.filter(c => c.price >= bd.min && c.price <= bd.max).sort((a, b) => a.price - b.price);
      if (!cars.length) return;
      const card = document.createElement("button");
      card.type = "button"; card.className = "budget reveal";
      card.setAttribute("aria-label", `Ver los ${cars.length} coches de ${bd.label}`);
      card.innerHTML = `
        <div class="budget__pics"></div>
        <div class="budget__body">
          <strong class="budget__label">${bd.label}</strong>
          <span class="budget__text">${bd.text}</span>
          <span class="budget__meta"><b>${cars.length} coches</b> · desde <span class="nw">${euro(cars[0].price)}</span></span>
          <span class="budget__go">Ver coches <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </div>`;
      const pics = $(".budget__pics", card);
      cars.slice(0, 3).forEach(c => {
        const box = document.createElement("span"); box.className = "budget__pic";
        const img = new Image(); img.alt = ""; img.decoding = "async";
        img.onload = () => img.classList.add("is-loaded");
        loadPhoto(img, c.photos[0], () => img.remove());
        box.append(img); pics.append(box);
      });
      card.addEventListener("click", () => applyFilter({ min: bd.min, max: bd.max }));
      fb.append(card);
    });
  }
  const fbr = $("#finder-brands");
  if (fbr) {
    const chips = [];
    const mk = (b, label, n) => {
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "bchip"; btn.dataset.brand = b;
      btn.innerHTML = `${label}<span>${n}</span>`;
      btn.addEventListener("click", () => { fBrand.value = b; fBrand.dispatchEvent(new Event("change")); });
      chips.push(btn); fbr.append(btn);
    };
    mk("", "Todas", INVENTORY.length);
    brands.forEach(b => mk(b, b, INVENTORY.filter(c => c.brand === b).length));
    const sync = () => chips.forEach(c => c.classList.toggle("is-active", c.dataset.brand === fBrand.value));
    fBrand.addEventListener("change", sync); sync();
    new MutationObserver(sync).observe($("#cars"), { childList: true });
  }
  const stB = $("#st-brands"), stF = $("#st-from");
  if (stB) stB.textContent = brands.length;
  if (stF) stF.textContent = euro(Math.min(...INVENTORY.map(c => c.price)));

  // ---------- Búsqueda rápida de la portada ----------
  const qsBrand = $("#qs-brand"), qsPrice = $("#qs-price");
  if (qsBrand && qsPrice) {
    brands.forEach(b => qsBrand.add(new Option(b, b)));
    [6000, 8000, 10000, 12000, 15000].filter(v => v > minP).forEach(v => qsPrice.add(new Option(`Hasta ${euro(v)}`, v)));
    const qsCount = () => {
      const n = INVENTORY.filter(c => (!qsBrand.value || c.brand === qsBrand.value) && (!qsPrice.value || c.price <= +qsPrice.value)).length;
      $("#qs-count").textContent = n;
    };
    qsBrand.addEventListener("change", qsCount); qsPrice.addEventListener("change", qsCount); qsCount();
    $("#quick-search").addEventListener("submit", e => {
      e.preventDefault();
      fBrand.value = qsBrand.value; state.brand = qsBrand.value;
      const pv = qsPrice.value ? +qsPrice.value : maxP;
      fPrice.value = pv; setPriceOut(); state.price = pv >= maxP ? Infinity : pv; state.min = 0;
      render();
      $("#stock").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // ---------- Marcas en stock (franja animada) ----------
  const track = $("#brands-track");
  if (track) {
    const html = brands.map(b => `<span>${b}</span>`).join("");
    track.innerHTML = html + html + html + html; // duplicado para el bucle continuo
    $$("span", track).slice(brands.length * 2).forEach(s => s.setAttribute("aria-hidden", "true"));
  }

  // ---------- Enlaces de WhatsApp ----------
  $$(".js-wa").forEach(a => {
    a.href = waLink(a.dataset.msg || "Hola VM MOTOR");
    a.target = "_blank"; a.rel = "noopener";
  });

  // ---------- Formulario → WhatsApp ----------
  const form = $("#contact-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    ["name", "phone", "message"].forEach(n => {
      const field = form.elements[n];
      const valid = field.value.trim() !== "" && field.checkValidity();
      field.closest(".input").classList.toggle("is-invalid", !valid);
      if (!valid && ok) { field.focus(); ok = false; }
    });
    const priv = form.elements.privacy;
    $(".input__err--check").classList.toggle("is-shown", !priv.checked);
    if (!priv.checked) ok = false;
    if (!ok) return;

    const d = Object.fromEntries(new FormData(form));
    const text = `Hola VM MOTOR, soy ${d.name.trim()} (tel. ${d.phone.trim()}).\nMe interesa: ${d.topic}.\n\n${d.message.trim()}`;
    const url = waLink(text);
    window.vmSaveLead?.({ nombre: d.name.trim(), telefono: d.phone.trim(), interes: d.topic, mensaje: d.message.trim() });
    const win = window.open(url, "_blank", "noopener");
    $("#form-status").innerHTML = win
      ? "Hemos abierto WhatsApp con tu mensaje. Solo tienes que pulsar enviar."
      : `Si WhatsApp no se ha abierto, <a href="${url}" target="_blank" rel="noopener">pulsa aquí</a> o llámanos al 628 015 594.`;
  });
  form.addEventListener("input", e => e.target.closest(".input")?.classList.remove("is-invalid"));

  // ---------- Mapa (se carga solo al pulsar: más rápido y sin cookies de terceros) ----------
  $("#map-load")?.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.google.com/maps?q=V+M+Motor,+Calle+Almansa+78,+35010+Las+Palmas+de+Gran+Canaria&ll=28.1288191,-15.4425195&z=17&output=embed";
    iframe.title = "Mapa: VM MOTOR, Calle Almansa 78, Las Palmas de Gran Canaria";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    $("#map").appendChild(iframe);
    $("#map-load").remove();
  });

  // ---------- Cabecera y menú ----------
  const totop = $("#totop"), progress = $("#progress");
  const nav = $(".nav"), toggle = $(".nav__toggle"), menu = $("#mobile-menu"), mbar = $(".mbar");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    mbar.classList.toggle("is-visible", y > innerHeight * 0.6 && y < lastY - 2);
    if (Math.abs(y - lastY) > 2) lastY = y;
    totop.classList.toggle("is-visible", y > innerHeight * 1.2);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add("is-open")); }
    else { menu.classList.remove("is-open"); setTimeout(() => (menu.hidden = true), 350); }
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false); });
  addEventListener("resize", () => { if (innerWidth > 900 && !menu.hidden) setMenu(false); });

  // Enlace activo según la sección visible
  const links = $$(".nav__links a");
  const sections = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(a => a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));

  // ---------- Aparición al hacer scroll ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => {
    const sib = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
    el.style.transitionDelay = reduceMotion ? "0s" : `${Math.min(sib.indexOf(el), 4) * 80}ms`;
    io.observe(el);
  });

  // ---------- Contador animado ----------
  $$("[data-count]").forEach(el => {
    const end = +el.textContent;
    if (reduceMotion || !end) return;
    const co = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      co.disconnect();
      const t0 = performance.now(), dur = 1200;
      const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      el.textContent = "0"; requestAnimationFrame(tick);
    });
    co.observe(el);
  });

  // ---------- Textos legales ----------
  const legalModal = $("#legal-modal");
  $$("[data-legal]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    legalModal.showModal ? legalModal.showModal() : legalModal.setAttribute("open", "");
    document.body.style.overflow = "hidden";
    $(a.getAttribute("href"), legalModal)?.scrollIntoView({ block: "start" });
  }));
  legalModal.addEventListener("close", () => (document.body.style.overflow = ""));
  legalModal.addEventListener("click", e => {
    if (e.target === legalModal || e.target.closest("[data-close]")) legalModal.close ? legalModal.close() : legalModal.removeAttribute("open");
  });

  $("#year").textContent = new Date().getFullYear();
};

/* =========================================================
   Efectos y animaciones
   ========================================================= */
window.__startEffects = () => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const body = document.body;

  // ---------- Entrada de la portada (sin pantalla de carga) ----------
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add("is-ready")));

  // ---------- Titulares: dividir en palabras ----------
  $$(".h2").forEach(h => {
    if (h.closest(".contact__hero")) return;
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "w";
            const inner = document.createElement("span"); inner.textContent = part; inner.style.setProperty("--i", i++);
            w.append(inner); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(h);
    if (!h.closest(".reveal")) {
      new IntersectionObserver(([en], o) => { if (en.isIntersecting) { h.classList.add("is-in"); o.disconnect(); } }, { threshold: .3 }).observe(h);
    }
  });

  // ---------- Iconos que se dibujan ----------
  $$(".why__list svg *").forEach(el => el.setAttribute("pathLength", "1"));

  if (reduce) return;

  // ---------- Hero: seguimiento del ratón ----------
  const hero = $(".hero");
  if (finePointer && hero) {
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
    hero.addEventListener("pointerleave", () => { hero.style.setProperty("--mx", 0); hero.style.setProperty("--my", 0); });
  }

  // ---------- Efectos ligados al scroll (un solo bucle) ----------
  const visual = $(".hero__visual");
  const whyList = $(".why__list");
  const ctaShapes = $$(".cta__shapes i");
  let ticking = false;
  function onScroll() {
    const y = scrollY, vh = innerHeight;
    if (y < vh * 1.3) {
      visual && visual.style.setProperty("--py", (y * .12).toFixed(1));
    }
    if (whyList) {
      const r = whyList.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * .6 - r.top) / r.height));
      whyList.style.setProperty("--wp", p.toFixed(3));
    }
    ctaShapes.forEach(s => {
      const r = s.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const d = +s.dataset.depth, c = r.top + r.height / 2 - vh / 2;
      s.style.setProperty("--cy", `${(c * d * -.25).toFixed(1)}px`);
      s.style.setProperty("--cr", `${(c * d * .02).toFixed(2)}deg`);
    });
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // ---------- Tarjetas: inclinación 3D y brillo ----------
  const cars = $("#cars");
  if (finePointer && cars) {
    cars.addEventListener("pointermove", e => {
      const media = e.target.closest(".car__media");
      if (!media) return;
      if (!media.querySelector(".car__glare")) { const g = document.createElement("span"); g.className = "car__glare"; media.append(g); }
      const r = media.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      media.style.setProperty("--ry", `${((x - .5) * 8).toFixed(2)}deg`);
      media.style.setProperty("--rx", `${((.5 - y) * 6).toFixed(2)}deg`);
      media.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      media.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    });
    cars.addEventListener("pointerout", e => {
      const media = e.target.closest(".car__media");
      if (media && !media.contains(e.relatedTarget)) { media.style.setProperty("--rx", "0deg"); media.style.setProperty("--ry", "0deg"); }
    });
  }

  // ---------- Botones magnéticos ----------
  if (finePointer) {
    $$(".magnet").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

};
