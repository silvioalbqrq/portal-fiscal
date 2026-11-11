// Teste de fumaça: serve a pasta, abre no Chrome headless e exige um card por ferramenta do tools.json.
// Um card a menos = entrada descartada, duplicada ou tools.json fora do ar.
const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

const RAIZ = __dirname;
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

if (!fs.existsSync(CHROME)) {
  console.error("Chrome não encontrado. Defina CHROME_PATH.");
  process.exit(1);
}

const servidor = http.createServer((req, res) => {
  let arquivo = path.join(RAIZ, decodeURIComponent(req.url.split("?")[0]));
  if (arquivo.endsWith(path.sep)) arquivo = path.join(arquivo, "index.html");
  fs.readFile(arquivo, (erro, dados) => {
    if (erro) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(arquivo)] || "application/octet-stream" });
    res.end(dados);
  });
});

servidor.listen(0, "127.0.0.1", () => {
  const porta = servidor.address().port;
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--virtual-time-budget=8000",
    "--dump-dom",
    `http://127.0.0.1:${porta}/`,
  ]);
  let dom = "";
  chrome.stdout.on("data", (pedaco) => (dom += pedaco));

  const prazo = setTimeout(() => {
    chrome.kill();
    console.error("FALHOU: Chrome não terminou em 30s");
    process.exit(1);
  }, 30000);

  chrome.on("close", () => {
    clearTimeout(prazo);
    servidor.close();
    const esperado = JSON.parse(fs.readFileSync(path.join(RAIZ, "tools.json"), "utf8")).length;
    const cards = (dom.match(/class="card"/g) || []).length;
    const erros = [];
    if (cards !== esperado) erros.push(cards + " cards para " + esperado + " ferramentas em tools.json");
    if (dom.includes("Não foi possível carregar a lista")) erros.push("tools.json não carregou");
    if (erros.length) {
      console.error("FALHOU: " + erros.join("; "));
      process.exit(1);
    }
    console.log("OK: " + cards + " cards = " + esperado + " ferramentas");
  });
});
