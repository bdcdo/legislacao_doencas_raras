# Scrapers ANS e ANVISA

Coleta de normas sobre doenças raras dos portais ANSLegis e ANVISALegis.

## Scripts

- **`scraper_ans.py`** - Coleta normas da ANS (Agência Nacional de Saúde Suplementar)
- **`scraper_anvisa.py`** - Coleta normas da ANVISA (Agência Nacional de Vigilância Sanitária)

## Como Usar

```bash
# Da raiz do projeto
uv run python ans_E_anvisa/scraper_ans.py
uv run python ans_E_anvisa/scraper_anvisa.py
```

## Tecnologia

Os scrapers usam a biblioteca [raspe](https://github.com/bdcdo/RasPe) que implementa:

- **Selenium + stealth**: Bypass automático da proteção Cloudflare
- **Paginação automática**: Coleta todas as páginas de resultados
- **Query booleana**: Expande termos de busca automaticamente

## Termos de Busca

```
(doença OU síndrome OU patologia) E (rara OU ultrarrara)
(doenças OU síndromes OU patologias) E (raras OU ultrarraras)
medicamento E órfão
medicamentos E órfãos
terapia E órfã
terapias E órfãs
```

## Saída

Arquivos CSV com colunas:

| Coluna | Descrição |
|--------|-----------|
| `url` | Link para o ato normativo |
| `titulo` | Tipo e número do ato |
| `descricao` | Ementa/descrição |
| `situacao` | Status (vigente, revogado, etc.) |
| `termo_busca` | Termo usado na busca |

## Notas

- Requer Chrome/Chromium instalado
- Coleta pode demorar devido à paginação e delays anti-bot
- Duplicatas são removidas automaticamente baseado na URL
