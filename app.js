const FAV_KEY = "hubfiscal:favoritos:v1";
// Aliases de IDs renomeados: favorito antigo -> ID atual (migração automática).
const FAV_ALIASES = {
  "danfe-reforma-nt2026-010": "danfe-reforma-nt2026",
};
const ALLOWED_ORIGIN = "https://silvioalbqrq.github.io";

function isUrlSegura(url) {
  try {
    const u = new URL(url, ALLOWED_ORIGIN);
    return u.protocol === "https:" && u.origin === ALLOWED_ORIGIN;
  } catch (e) {
    return false;
  }
}

function validarFerramenta(t) {
  if (!t || typeof t !== "object") return false;
  if (typeof t.id !== "string" || !t.id.trim()) return false;
  if (typeof t.nome !== "string" || !t.nome.trim()) return false;
  if (typeof t.url !== "string" || !isUrlSegura(t.url)) return false;
  if (typeof t.categoria !== "string" || !t.categoria.trim()) return false;
  if (t.tags !== undefined && !Array.isArray(t.tags)) return false;
  return true;
}

function sanitizarLista(data) {
  const vistos = new Set();
  const limpa = [];
  (Array.isArray(data) ? data : []).forEach((t) => {
    if (!validarFerramenta(t)) {
      console.warn("[Hub Fiscal] entrada descartada em tools.json:", t && t.id);
      return;
    }
    if (vistos.has(t.id)) {
      console.warn("[Hub Fiscal] id duplicado descartado:", t.id);
      return;
    }
    vistos.add(t.id);
    limpa.push(t);
  });
  return limpa;
}

function debounce(fn, ms) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

let TOOLS = [];
let filtroAtual = "todos";
let favoritos = new Set();
let falhouCarga = false;

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const busca = document.getElementById("busca");
const resultadoInfo = document.getElementById("resultado-info");

const viewer = document.getElementById("viewer");
const viewerFrame = document.getElementById("viewer-frame");
const viewerTitle = document.getElementById("viewer-title");
const viewerUrl = document.getElementById("viewer-url");
const viewerOpen = document.getElementById("viewer-open");
const viewerLoading = document.getElementById("viewer-loading");

function carregarFavoritos() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) favoritos = new Set(arr.filter((x) => typeof x === "string"));
  } catch (e) {
    favoritos = new Set();
  }
}

function salvarFavoritos() {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favoritos)));
  } catch (e) {
    console.warn("[Hub Fiscal] localStorage indisponível:", e && e.name);
  }
}

function alternarFavorito(tool, botao) {
  const fav = !favoritos.has(tool.id);
  if (fav) favoritos.add(tool.id);
  else favoritos.delete(tool.id);
  salvarFavoritos();
  // Reordenar no mesmo clique move o card sob o cursor; a ordem nova aparece no próximo carregamento.
  botao.classList.toggle("active", fav);
  botao.setAttribute("aria-pressed", fav ? "true" : "false");
  botao.setAttribute("aria-label", (fav ? "Remover dos favoritos: " : "Favoritar: ") + tool.nome);
  botao.setAttribute("title", fav ? "Remover dos favoritos" : "Favoritar ferramenta");
  atualizarContadorFavoritos();
  if (filtroAtual === "favoritos") render();
}

function atualizarContadorFavoritos() {
  const el = document.getElementById("count-fav");
  if (el) el.textContent = contarFavoritosValidos();
}

function contarFavoritosValidos() {
  if (!TOOLS.length) return favoritos.size;
  const ids = new Set(TOOLS.map((t) => t.id));
  let n = 0;
  favoritos.forEach((id) => { if (ids.has(id)) n++; });
  return n;
}

function sincronizarFavoritos() {
  // Só migra aliases; nunca descarta id desconhecido (tools.json pode falhar ou mudar).
  let mudou = false;
  const migrados = new Set();
  favoritos.forEach((id) => {
    const atual = FAV_ALIASES[id] || id;
    if (atual !== id) mudou = true;
    migrados.add(atual);
  });
  if (!mudou) return;
  favoritos = migrados;
  salvarFavoritos();
}

async function carregarFerramentas() {
  carregarFavoritos();
  try {
    // ?v= com timestamp: o valor fixo antigo (20261016-01) nunca mudava, então navegador e CDN do Pages (max-age=600) seguiam entregando o tools.json velho.
    const resp = await fetch("tools.json?v=" + Date.now(), { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    const limpa = sanitizarLista(data);
    if (limpa.length === 0) throw new Error("JSON vazio ou inválido");
    TOOLS = limpa;
  } catch (e) {
    console.warn("[Hub Fiscal] tools.json indisponível:", e && e.message);
    falhouCarga = true;
    TOOLS = [];
  }
  sincronizarFavoritos();
  atualizarContadores();
  render();
}

function atualizarContadores() {
  const total = TOOLS.length;
  const setText = (id, valor) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  };
  setText("stat-total", total);
  setText("count-todos", total);
  setText("hero-total", total);
  setText("repo-count", total);
  setText("next-site", total + 1);
}

function normalizar(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrar() {
  const termo = normalizar(busca.value.trim());
  const lista = TOOLS.filter((t) => {
    let okFiltro = true;
    if (filtroAtual === "favoritos") okFiltro = favoritos.has(t.id);
    else if (filtroAtual !== "todos") okFiltro = t.categoria === filtroAtual;
    if (!okFiltro) return false;
    if (!termo) return true;
    const alvo = normalizar(t.nome + " " + t.descricao + " " + t.url + " " + (t.tags || []).join(" ") + " " + (t.categoriaLabel || ""));
    return termo.split(/\s+/).every((p) => alvo.includes(p));
  });
  // favoritos (★) nas primeiras linhas; empate mantém o agrupamento do tools.json
  return lista.sort((a, b) => (favoritos.has(b.id) ? 1 : 0) - (favoritos.has(a.id) ? 1 : 0));
}

function render() {
  const lista = filtrar();
  grid.innerHTML = "";
  lista.forEach((t) => {
    if (!validarFerramenta(t)) return;
    const fav = favoritos.has(t.id);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<div class="card-top"><span class="badge"></span>' +
      '<button class="fav-btn" data-fav aria-pressed="false" title="Favoritar ferramenta">★</button></div>' +
      "<h3></h3><p></p>" +
      '<div class="tags"></div>' +
      '<div class="card-actions"><button class="btn btn-primary" data-open>Abrir</button>' +
      '<a class="btn btn-secondary" data-ext target="_blank" rel="noopener">Nova aba</a></div>' +
      '<span class="card-url"></span>';
    card.querySelector(".badge").textContent = t.categoriaLabel || t.categoria;
    card.querySelector("h3").textContent = t.nome;
    card.querySelector("p").textContent = t.descricao;
    const tagsBox = card.querySelector(".tags");
    (t.tags || []).forEach((tag) => {
      const s = document.createElement("span");
      s.textContent = tag;
      tagsBox.appendChild(s);
    });
    const favBtn = card.querySelector("[data-fav]");
    favBtn.classList.toggle("active", fav);
    favBtn.setAttribute("aria-pressed", fav ? "true" : "false");
    favBtn.setAttribute("aria-label", (fav ? "Remover dos favoritos: " : "Favoritar: ") + t.nome);
    favBtn.setAttribute("title", fav ? "Remover dos favoritos" : "Favoritar ferramenta");
    favBtn.addEventListener("click", () => alternarFavorito(t, favBtn));
    const ext = card.querySelector("[data-ext]");
    ext.href = t.url;
    ext.setAttribute("rel", "noopener noreferrer");
    ext.setAttribute("aria-label", "Abrir " + t.nome + " em nova aba");
    card.querySelector("[data-open]").addEventListener("click", () => abrirViewer(t));
    card.querySelector(".card-url").textContent = t.url.replace("https://", "");
    grid.appendChild(card);
  });
  const exibidos = grid.children.length;
  empty.hidden = exibidos > 0;
  empty.querySelector("p").textContent = falhouCarga
    ? "Não foi possível carregar a lista de ferramentas. Verifique a conexão e recarregue a página."
    : filtroAtual === "favoritos" && !busca.value.trim()
      ? "Você ainda não favoritou nenhuma ferramenta. Toque na estrela ★ de um card para fixá-lo aqui."
      : "Ajuste a busca ou o filtro de categoria.";
  atualizarContadorFavoritos();
  resultadoInfo.textContent = "Exibindo " + exibidos + " de " + TOOLS.length + " ferramentas.";
}

function abrirViewer(tool) {
  if (!validarFerramenta(tool)) {
    console.warn("[Hub Fiscal] URL bloqueada:", tool && tool.url);
    return;
  }
  viewerTitle.textContent = tool.nome;
  viewerUrl.textContent = tool.url;
  viewerOpen.href = tool.url;
  viewerOpen.setAttribute("rel", "noopener noreferrer");
  viewerLoading.style.display = "grid";
  viewerLoading.textContent = "Carregando " + tool.nome + "…";
  viewerFrame.src = tool.url;
  document.body.style.overflow = "hidden";
  // <dialog> modal já prende o foco, responde ao Esc e deixa o fundo inerte.
  viewer.showModal();
  document.getElementById("viewer-close").focus();
}

function fecharViewer() {
  if (viewer.open) viewer.close();
  // Limpeza síncrona: o evento "close" do <dialog> não dispara em toda build do Chromium.
  viewerFrame.src = "about:blank"; // descarrega a ferramenta; src="" faria o iframe carregar o próprio Hub
  document.body.style.overflow = "";
}

viewerFrame.addEventListener("load", () => {
  viewerLoading.style.display = "none";
});
document.getElementById("viewer-close").addEventListener("click", fecharViewer);
viewer.addEventListener("cancel", fecharViewer); // Esc
viewer.addEventListener("close", fecharViewer);
document.getElementById("viewer-reload").addEventListener("click", () => {
  try {
    viewerLoading.style.display = "grid";
    const atual = viewerFrame.getAttribute("src") || viewerOpen.href;
    viewerFrame.src = atual;
  } catch (e) {
    console.warn("[Hub Fiscal] reload via src:", e && e.message);
    viewerFrame.src = viewerOpen.href;
  }
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => {
      c.classList.remove("active");
      c.setAttribute("aria-pressed", "false");
    });
    chip.classList.add("active");
    chip.setAttribute("aria-pressed", "true");
    filtroAtual = chip.dataset.filter;
    render();
  });
});
busca.addEventListener("input", debounce(render, 150));
document.getElementById("limpar").addEventListener("click", () => {
  busca.value = "";
  render();
  busca.focus();
});

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const id = btn.getAttribute("data-copy");
    const el = document.getElementById(id);
    if (!el) return;
    const texto = (el.getAttribute("data-full") || el.textContent || "").trim();
    if (!texto || texto === "a informar") return;
    try {
      await navigator.clipboard.writeText(texto);
      btn.textContent = "Copiado!";
      setTimeout(() => { btn.textContent = "Copiar"; }, 1500);
    } catch (e) {
      console.warn("[Hub Fiscal] clipboard indisponível:", e && e.name);
    }
  });
});

document.querySelectorAll("[data-reveal]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const el = document.getElementById(link.getAttribute("data-reveal"));
    if (!el) return;
    const full = el.getAttribute("data-full") || "";
    if (!el.getAttribute("data-short")) el.setAttribute("data-short", el.textContent);
    const short = el.getAttribute("data-short");
    const mostrandoTudo = el.textContent === full;
    el.textContent = mostrandoTudo ? short : full;
    link.textContent = mostrandoTudo ? "ver chave completa" : "ocultar";
    if (link.getAttribute("data-reveal") === "ln-address") {
      link.textContent = mostrandoTudo ? "ver invoice completa" : "ocultar";
    }
  });
});

carregarFerramentas();
