# Pesquisa Sabará - Metodologia de Coleta de Legislação sobre Doenças Raras

Repositório de scripts para coleta e análise de legislação e normas relacionadas a **doenças raras** no Brasil.

## Estrutura do Projeto

```
.
├── ans_E_anvisa/       # Scrapers ANS e ANVISA (usando raspe)
├── biblioteca_conitec/ # Coleta de diretrizes CONITEC
├── cfm/                # Scraper CFM - Conselho Federal de Medicina
├── cns/                # Documentação CNS (scraper em repo separado)
├── legislacao/         # Scraper legislação federal (Presidência)
├── ms/                 # Scraper SaudeLegis (Ministério da Saúde)
├── stj/                # Parser de jurisprudência STJ
├── utils/              # Utilitários compartilhados
└── visualizacoes/      # Scripts de visualização
```

## Instalação

O projeto usa [uv](https://docs.astral.sh/uv/) para gerenciamento de dependências.

```bash
# Instalar uv (se não tiver)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar dependências
uv sync

# Executar um scraper
uv run python ans_E_anvisa/scraper_ans.py
```

## Scrapers Disponíveis

| Módulo | Fonte | Comando |
|--------|-------|---------|
| ANS | Agência Nacional de Saúde Suplementar | `uv run python ans_E_anvisa/scraper_ans.py` |
| ANVISA | Agência Nacional de Vigilância Sanitária | `uv run python ans_E_anvisa/scraper_anvisa.py` |
| CFM | Conselho Federal de Medicina | `uv run python cfm/scraper_cfm.py` |
| MS | Ministério da Saúde (SaudeLegis) | `uv run python ms/scraper_saudelegis.py` |
| Legislação | Legislação Federal (Presidência) | `uv run python legislacao/legislacao_federal_scraper.py` |
| CONITEC | Diretrizes Metodológicas | `uv run python biblioteca_conitec/scraper_conitec.py` |

## Biblioteca raspe

A maioria dos scrapers utiliza a biblioteca [raspe](https://github.com/bdcdo/RasPe) que fornece:

- Bypass automático de proteção Cloudflare (Selenium + stealth)
- Paginação automática
- Deduplicação de resultados
- Interface consistente entre fontes

## Termos de Busca

Os scrapers utilizam queries booleanas para encontrar documentos relacionados a doenças raras:

```
(doença OU síndrome OU patologia) E (rara OU ultrarrara)
(doenças OU síndromes OU patologias) E (raras OU ultrarraras)
medicamento E órfão
medicamentos E órfãos
terapia E órfã
terapias E órfãs
```

## Saída

Cada scraper gera arquivos CSV com metadados dos documentos encontrados:

- Título/número da norma
- Data de publicação
- Situação (vigente, revogado, etc.)
- Link para documento completo
- Ementa/descrição

## Requisitos

- Python 3.11+
- Chrome/Chromium (para scrapers que usam Selenium)
- Conexão com internet

## Licença

Este projeto foi desenvolvido para fins de pesquisa acadêmica no Hospital Sabará.
