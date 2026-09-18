/* Hub Fiscal — renderização via tools.json (com fallback local para abrir via file://) */
const FALLBACK_TOOLS = [
  { id: "analise-xml-ibs-cbs", nome: "Análise XML — IBS e CBS", descricao: "Leitor de XML da NF-e com apuração de vBC, IBS (UF + Município) e CBS, itens por produto e exportação CSV.", url: "https://silvioalbqrq.github.io/AnaliseXML-IBSeCBS/", categoria: "reforma", categoriaLabel: "Reforma / IBS-CBS", tags: ["Reforma", "XML", "IBS", "CBS", "NF-e"] },
  { id: "taxreform-das", nome: "IBS/CBS Dentro ou Fora do DAS", descricao: "Simulador do Simples Nacional: RBT12 oficial, cronograma 2026–2033, alíquotas editáveis e parecer B2B.", url: "https://silvioalbqrq.github.io/TaxReform/", categoria: "reforma", categoriaLabel: "Reforma / IBS-CBS", tags: ["Simples", "DAS", "Híbrido", "CGSN 186/26"] },
  { id: "lc116-nbs", nome: "LC 116 × NBS — Local do ISS", descricao: "Correlação oficial LC 116/2003 → NBS (Anexo VIII) com local do ISS (art. 3º) e local IBS/CBS.", url: "https://silvioalbqrq.github.io/LC116-NBS/", categoria: "reforma", categoriaLabel: "Reforma / IBS-CBS", tags: ["ISS", "LC 116", "NBS", "Consulta"] },
  { id: "50-segmentos", nome: "50 Segmentos na Reforma", descricao: "E-book setorial: impacto prático de IBS, CBS e IS em mais de 50 setores, com cronograma e regimes diferenciados.", url: "https://silvioalbqrq.github.io/50-Segmentos/", categoria: "reforma", categoriaLabel: "Reforma / IBS-CBS", tags: ["E-book", "Setores", "LC 214/25"] },
  { id: "fator-r", nome: "Calculadora Fator R & DAS", descricao: "Diagnóstico Anexo III vs. Anexo V, alíquota efetiva e DAS com segregação de ISS retido (Res. CGSN 140/18).", url: "https://silvioalbqrq.github.io/fator-r/", categoria: "simples-iss", categoriaLabel: "ISS / Simples Nacional", tags: ["Fator R", "Simples", "Anexo III", "Anexo V"] },
  { id: "iss-fixo", nome: "Portal do ISS Fixo", descricao: "Elegibilidade e economia para sociedades uniprofissionais — Fortaleza e Canindé/CE (DL 406/68, STF Tema 918).", url: "https://silvioalbqrq.github.io/iss-fixo/", categoria: "simples-iss", categoriaLabel: "ISS / Simples Nacional", tags: ["ISS Fixo", "Municipal", "Sociedades"] },
  { id: "tributacao-dentista", nome: "Tributação para Dentistas", descricao: "Guia prático: Fator R, equiparação hospitalar, livro-caixa, modelo híbrido CPF+CNPJ e Reforma 2027.", url: "https://silvioalbqrq.github.io/Tributacao-Dentista/", categoria: "simples-iss", categoriaLabel: "ISS / Simples Nacional", tags: ["Odonto", "Lucro Presumido", "Guia"] },
  { id: "consulta-cest", nome: "Consulta CEST & NCM", descricao: "Localiza o CEST a partir da NCM ou descrição — 1.032 registros dos Anexos II a XXVI do Convênio ICMS 142/18, até Conv. 95/24, com exportação CSV.", url: "https://silvioalbqrq.github.io/consulta-cest/", categoria: "consultas", categoriaLabel: "Consultas / ICMS", tags: ["CEST", "NCM", "ST", "Convênio 142/18"] },
  { id: "consulta-cnae", nome: "Consulta CNAE — Simples Nacional", descricao: "Dashboard de enquadramento no Simples por CNAE (Subclasses IBGE 2.3, LC 123/06) — optante, ambíguo com Fator R, vedado e MEI, com análise de cartão CNPJ e simulador de alíquota efetiva.", url: "https://silvioalbqrq.github.io/consulta-cnae/", categoria: "consultas", categoriaLabel: "Consultas / ICMS", tags: ["CNAE", "Simples", "Fator R", "MEI"] },
  { id: "consulta-ncm", nome: "Consulta NCM × TIPI", descricao: "Painel NCM × TIPI (Decreto 11.158/2022 até ADE RFB 001/2026) — 15.653 linhas, busca por código/descrição, filtro por alíquota, EX e NT, com exportação CSV, 100% local.", url: "https://silvioalbqrq.github.io/consulta-ncm/", categoria: "consultas", categoriaLabel: "Consultas / ICMS", tags: ["NCM", "TIPI", "IPI", "Tabela"] },
  { id: "consulta-cfop", nome: "CFOP — Localizador de Operações", descricao: "Localizador de CFOP (entradas 1·2·3 / saídas 5·6·7, IT 2023.002 v2.10) — 619 registros com filtros de fluxo, UF e natureza, ficha completa e espelho de devolução.", url: "https://silvioalbqrq.github.io/consulta-cfop/", categoria: "consultas", categoriaLabel: "Consultas / ICMS", tags: ["CFOP", "NF-e", "Operações"] },
  { id: "conversor-xml-excel", nome: "Conversor XML → Excel", descricao: "Processa NFe (55) e NFCe (65) em lote, com CST IBS/CBS, agrupamento por produto e exportação .xlsx.", url: "https://silvioalbqrq.github.io/conversorXML-Excel/", categoria: "conversores", categoriaLabel: "Conversores / Utilidades", tags: ["XML", "Excel", "NFe", "NFCe"] },
  { id: "docconvert", nome: "DocConvert — PDF/A & Compressor", descricao: "Imagem → PDF/A, compressão real de PDF e mesclagem com metadados. Tudo 100% no navegador.", url: "https://silvioalbqrq.github.io/DocConvert/", categoria: "conversores", categoriaLabel: "Conversores / Utilidades", tags: ["PDF", "PDF/A", "Arquivo"] },
  { id: "converter-md", nome: "Conversor para Markdown", descricao: "Converte PDF, DOCX, XLSX e HTML em .md limpo para LLMs e documentação (ponte para app Streamlit).", url: "https://silvioalbqrq.github.io/converter-md/", categoria: "conversores", categoriaLabel: "Conversores / Utilidades", tags: ["Markdown", "Documentos", "IA"] },
  { id: "60-oportunidades", nome: "60 Oportunidades Tributárias", descricao: "Mapa de teses de redução de carga e recuperação de créditos — PIS/COFINS, ICMS, IRPJ, previdenciário e IBS/CBS.", url: "https://silvioalbqrq.github.io/60-Oportunidades/", categoria: "estrategia", categoriaLabel: "Estratégia / Recuperação", tags: ["Planejamento", "Créditos", "Teses"] }
];

const FAV_KEY = "hubfiscal:favoritos:v1";

let TOOLS = [];
let filtroAtual = "todos";
let favoritos = new Set();

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
  } catch (e) { /* armazenamento indisponível: ignora */ }
}

function alternarFavorito(id) {
  if (favoritos.has(id)) favoritos.delete(id);
  else favoritos.add(id);
  salvarFavoritos();
  render();
}

async function carregarFerramentas() {
  carregarFavoritos();
  try {
    const resp = await fetch("tools.json", { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("JSON vazio");
    TOOLS = data;
  } catch (e) {
    // Fallback: permite abrir o index.html com duplo clique (file://) sem servidor
    TOOLS = FALLBACK_TOOLS;
  }
  document.getElementById("stat-total").textContent = TOOLS.length;
  document.getElementById("count-todos").textContent = TOOLS.length;
  render();
}

function normalizar(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrar() {
  const termo = normalizar(busca.value.trim());
  return TOOLS.filter((t) => {
    let okFiltro = true;
    if (filtroAtual === "favoritos") okFiltro = favoritos.has(t.id);
    else if (filtroAtual !== "todos") okFiltro = t.categoria === filtroAtual;
    if (!okFiltro) return false;
    if (!termo) return true;
    const alvo = normalizar(t.nome + " " + t.descricao + " " + t.url + " " + (t.tags || []).join(" ") + " " + (t.categoriaLabel || ""));
    return termo.split(/\s+/).every((p) => alvo.includes(p));
  });
}

function render() {
  const lista = filtrar();
  grid.innerHTML = "";
  lista.forEach((t) => {
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
    favBtn.addEventListener("click", () => alternarFavorito(t.id));
    const ext = card.querySelector("[data-ext]");
    ext.href = t.url;
    ext.setAttribute("aria-label", "Abrir " + t.nome + " em nova aba");
    card.querySelector("[data-open]").addEventListener("click", () => abrirViewer(t));
    card.querySelector(".card-url").textContent = t.url.replace("https://", "");
    grid.appendChild(card);
  });
  empty.hidden = lista.length > 0;
  if (filtroAtual === "favoritos" && lista.length === 0 && !busca.value.trim()) {
    empty.querySelector("p").textContent = "Você ainda não favoritou nenhuma ferramenta. Toque na estrela ★ de um card para fixá-lo aqui.";
  } else {
    empty.querySelector("p").textContent = "Ajuste a busca ou o filtro de categoria.";
  }
  const favCount = document.getElementById("count-fav");
  if (favCount) favCount.textContent = favoritos.size;
  resultadoInfo.textContent = "Exibindo " + lista.length + " de " + TOOLS.length + " ferramentas.";
}

function abrirViewer(tool) {
  viewerTitle.textContent = tool.nome;
  viewerUrl.textContent = tool.url;
  viewerOpen.href = tool.url;
  viewerLoading.style.display = "grid";
  viewerLoading.textContent = "Carregando " + tool.nome + "…";
  // Cache-busting leve: garante versão mais recente sem quebrar o Pages
  const sep = tool.url.includes("?") ? "&" : "?";
  viewerFrame.src = tool.url + sep + "hub=1";
  viewer.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("viewer-close").focus();
}

function fecharViewer() {
  viewer.hidden = true;
  viewerFrame.src = "";
  document.body.style.overflow = "";
}

viewerFrame.addEventListener("load", () => {
  viewerLoading.style.display = "none";
});
document.getElementById("viewer-close").addEventListener("click", fecharViewer);
document.getElementById("viewer-reload").addEventListener("click", () => {
  viewerLoading.style.display = "grid";
  viewerFrame.contentWindow.location.reload();
});
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) fecharViewer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !viewer.hidden) fecharViewer();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    filtroAtual = chip.dataset.filter;
    render();
  });
});
busca.addEventListener("input", render);
document.getElementById("limpar").addEventListener("click", () => {
  busca.value = "";
  render();
  busca.focus();
});

carregarFerramentas();
