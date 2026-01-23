# Scraper CONITEC - Diretrizes Metodológicas

Coleta e análise de diretrizes metodológicas da CONITEC (Comissão Nacional de Incorporação de Tecnologias no Sistema Único de Saúde) que mencionam doenças raras.

## Script

- **`scraper_conitec.py`** - Baixa PDFs das diretrizes e busca menções a "doença rara"

## Como Usar

```bash
# Da raiz do projeto
uv run python biblioteca_conitec/scraper_conitec.py
```

## Funcionamento

O script:

1. Baixa PDFs das diretrizes metodológicas da CONITEC
2. Extrai texto dos PDFs usando `pdfplumber`
3. Busca ocorrências de "doença rara" e "doenças raras"
4. Gera relatório com contagem de menções por documento

## Documentos Analisados

- Diretrizes Metodológicas (18 documentos)
- Limiares de custo-efetividade

## Saída

- **`pdfs/`** - PDFs baixados
- **`resultados_busca_doenca_rara.csv`** - Relatório de menções

## Tecnologia

Diferente dos outros scrapers, este módulo usa:

- `requests` - Download de PDFs
- `pdfplumber` - Extração de texto de PDFs

Não usa a biblioteca `raspe` pois a CONITEC disponibiliza PDFs diretamente (sem proteção Cloudflare).

## Fonte

- https://www.gov.br/conitec/
- https://rebrats.saude.gov.br/diretrizes-metodologicas
