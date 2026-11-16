/* Arranque: lee coches y ajustes de Firebase; si no responde, usa los datos incrustados */
const FIREBASE_CONFIG = window.FIREBASE_CONFIG;
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
let started = false;
const applyCfg = cfg => {
  const set = (k, v) => v != null && v !== "" && document.querySelectorAll(`[data-cfg="${k}"]`).forEach(el => (el.textContent = v));
  set("rating", cfg.rating); set("reviews", cfg.opiniones);
  set("horario_semana", cfg.horarioSemana); set("horario_finde", cfg.horarioFinde);
  const n = document.getElementById("notice");
  if (n && cfg.aviso) { n.textContent = cfg.aviso; n.hidden = false; }
};
const start = (cfg = {}) => {
  if (started) return; started = true;
  try { applyCfg(cfg); } catch (e) {}
  window.__startSite(cfg); window.__startEffects();
};
const fallback = setTimeout(() => start(), 3500);
try {
  if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey) throw new Error("sin config");
  const { initializeApp } = await import(SDK + "firebase-app.js");
  const fs = await import(SDK + "firebase-firestore.js");
  const db = fs.getFirestore(initializeApp(FIREBASE_CONFIG));
  const cache = {};
  window.vmPhoto = id => cache[id] || (cache[id] = fs.getDoc(fs.doc(db, "fotos", id)).then(s => { if (!s.exists()) throw 0; return s.data().data; }));
  window.vmSaveLead = d => fs.addDoc(fs.collection(db, "mensajes"), { ...d, leido: false, creado: fs.serverTimestamp() }).catch(() => {});
  const [cars, cfgSnap] = await Promise.all([fs.getDocs(fs.collection(db, "coches")), fs.getDoc(fs.doc(db, "config", "web"))]);
  const list = cars.docs.map(d => ({ id: d.id, ...d.data() }))
    .filter(c => c.estado !== "vendido" && Array.isArray(c.photos) && c.brand && c.price);
  if (list.length) {
    list.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || b.price - a.price);
    INVENTORY.splice(0, INVENTORY.length, ...list);
  }
  clearTimeout(fallback);
  start(cfgSnap.exists() ? cfgSnap.data() : {});
} catch (e) {
  clearTimeout(fallback);
  start();
}
