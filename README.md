# Hub Fiscal — Canivete Suíço da Área Fiscal

Portal corporativo que reúne as 15 ferramentas fiscais em um só lugar.

**Regra de ouro:** o Hub não copia código. Cada card abre a URL oficial ao vivo
(`iframe` interno + botão nova aba). Atualizou o repositório original no GitHub Pages,
atualizou aqui automaticamente.

## Ferramentas (15)

| Categoria | Ferramenta | URL |
|---|---|---|
| Reforma / IBS-CBS | Análise XML — IBS e CBS | https://silvioalbqrq.github.io/AnaliseXML-IBSeCBS/ |
| Reforma / IBS-CBS | IBS/CBS Dentro ou Fora do DAS | https://silvioalbqrq.github.io/TaxReform/ |
| Reforma / IBS-CBS | LC 116 × NBS | https://silvioalbqrq.github.io/LC116-NBS/ |
| Reforma / IBS-CBS | 50 Segmentos na Reforma | https://silvioalbqrq.github.io/50-Segmentos/ |
| ISS / Simples | Fator R & DAS | https://silvioalbqrq.github.io/fator-r/ |
| ISS / Simples | ISS Fixo | https://silvioalbqrq.github.io/iss-fixo/ |
| ISS / Simples | Tributação Dentistas | https://silvioalbqrq.github.io/Tributacao-Dentista/ |
| Consultas / ICMS | Consulta CEST & NCM | https://silvioalbqrq.github.io/consulta-cest/ |
| Consultas / ICMS | Consulta CNAE — Simples | https://silvioalbqrq.github.io/consulta-cnae/ |
| Consultas / ICMS | Consulta NCM × TIPI | https://silvioalbqrq.github.io/consulta-ncm/ |
| Consultas / ICMS | CFOP — Localizador | https://silvioalbqrq.github.io/consulta-cfop/ |
| Conversores | XML → Excel | https://silvioalbqrq.github.io/conversorXML-Excel/ |
| Conversores | DocConvert PDF/A | https://silvioalbqrq.github.io/DocConvert/ |
| Conversores | Conversor Markdown | https://silvioalbqrq.github.io/converter-md/ |
| Estratégia | 60 Oportunidades | https://silvioalbqrq.github.io/60-Oportunidades/ |

## Publicar como `portal-fiscal` no GitHub Pages

1. No GitHub, crie o repositório público `portal-fiscal`.
2. Suba estes 4 arquivos para a raiz: `index.html`, `styles.css`, `app.js`, `tools.json`.
3. Em **Settings → Pages → Deploy from branch → `main` / `/ (root)`**.
4. Acesse `https://silvioalbqrq.github.io/portal-fiscal/`.

Teste local: abra `index.html` com duplo clique ou `python -m http.server` na pasta.

## Adicionar a 16ª ferramenta

Acrescente um bloco em `tools.json`:

```json
{
  "id": "nova-ferramenta",
  "nome": "Nome",
  "descricao": "Descrição de 1 linha",
  "url": "https://silvioalbqrq.github.io/NOVO-REPO/",
  "categoria": "reforma",
  "categoriaLabel": "Reforma / IBS-CBS",
  "tags": ["Tag1", "Tag2"]
}
```

Categorias válidas: `reforma`, `consultas`, `simples-iss`, `conversores`, `estrategia`.

Favoritos: estrela ★ em cada card, salvos em `localStorage` (`hubfiscal:favoritos:v1`) + filtro "Favoritos".
