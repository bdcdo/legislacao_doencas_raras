# Scraper CFM - Conselho Federal de Medicina

Coleta de normas do CFM relacionadas a doenças raras.

## Script

- **`scraper_cfm.py`** - Coleta normas usando a biblioteca raspe

## Como Usar

```bash
# Da raiz do projeto
uv run python cfm/scraper_cfm.py
```

## Tecnologia

O scraper usa a biblioteca [raspe](https://github.com/bdcdo/RasPe) (`raspe.cfm()`) que implementa:

- Busca por termos com operadores booleanos
- Paginação automática
- Filtro apenas CFM (ignora CRMs estaduais)
- Deduplicação de resultados

## Termos de Busca

```
(doença OR síndrome OR patologia) E (rara OR ultrarrara)
(doenças OR síndromes OR patologias) E (raras OR ultrarraras)
medicamento E órfão
medicamentos E órfãos
terapia E órfã
terapias E órfãs
```

## Saída

Arquivo CSV (`cfm_normas_doencas_raras_YYYYMMDD_HHMMSS.csv`) com colunas:

| Coluna | Descrição |
|--------|-----------|
| `Tipo` | Tipo de norma (Resolução, Parecer, etc.) |
| `UF` | Origem (CFM ou CRM estadual) |
| `Nº/Ano` | Número e ano da norma |
| `Situação` | Status (vigente, revogado, etc.) |
| `Ementa` | Descrição resumida |
| `Link` | URL para documento completo |

## Uso Programático

```python
import raspe

scraper = raspe.cfm()
df = scraper.raspar(texto=["doença rara", "medicamento órfão"])
```

## Fonte

Portal de busca de normas do CFM: https://portal.cfm.org.br/buscar-normas-cfm-e-crm/
