# Hub Fiscal — Canivete Suíço da Área Fiscal

Portal corporativo que reúne as ferramentas fiscais do GitHub Pages em um só lugar.

**Regra de ouro:** o Hub não copia código. Cada card abre a URL oficial ao vivo
(`iframe` interno + botão nova aba). Atualizou o repositório original no GitHub Pages,
atualizou aqui automaticamente.

## A lista oficial é `tools.json`

Um bloco por ferramenta (`id`, `nome`, `descricao`, `url`, `categoria`, `categoriaLabel`, `tags`).
A ordem do arquivo é a ordem dos cards; favoritos ficam nas primeiras linhas.
Nenhuma outra parte do projeto repete essa lista.

## Publicar como `portal-fiscal` no GitHub Pages

1. No GitHub, crie o repositório público `portal-fiscal`.
2. Suba para a raiz: `index.html`, `styles.css`, `app.js`, `tools.json`.
3. Em **Settings → Pages → Deploy from branch → `main` / `/ (root)`**.
4. Acesse `https://silvioalbqrq.github.io/portal-fiscal/`.
5. Mudou `app.js` ou `styles.css`? Troque o `?v=` do link correspondente em `index.html`.
   O Pages guarda os arquivos por 10 minutos; sem trocar a versão, o visitante continua com o antigo.

Teste local — o `fetch` de `tools.json` não funciona em `file://`, então use um servidor:
`python -m http.server 8000` na pasta e abra `http://localhost:8000/`.

Teste de fumaça (Chrome headless, exige Node): `node teste-fumaca.js`.

Favoritos: estrela ★ em cada card, salvos no `localStorage` (`hubfiscal:favoritos:v1`) + filtro "Favoritos".
