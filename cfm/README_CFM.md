# Scripts para Busca de Normas do CFM sobre Doenças Raras

Este diretório contém scripts para buscar normas do Conselho Federal de Medicina (CFM) relacionadas a doenças raras, utilizando a biblioteca **RasPe**.

## Arquivos

### Scripts Principais

- **`buscar_cfm_doencas_raras.py`** - Script principal que busca normas do CFM
  - Busca 16 termos relacionados a doenças raras
  - Gera relatórios estatísticos detalhados
  - Salva dados brutos e limpos em CSV
  - Remove duplicatas automaticamente

- **`test_buscar_cfm.py`** - Script de teste rápido
  - Busca apenas 2 termos para validação rápida
  - Limita a 2 páginas por termo

### Scripts Originais (Referência)

- **`cfm_scraper.py`** - Versão original sem usar RasPe
- **`cfm_teste.ipynb`** - Notebook de exploração
- **`clean_csv.py`** - Script original de limpeza de dados

## Como Usar

### 1. Busca Completa (todos os termos)

```bash
# Ativar ambiente virtual
source .venv/bin/activate

# Executar busca completa (pode demorar ~30-60 minutos)
python3 dev/buscar_cfm_doencas_raras.py
```

### 2. Teste Rápido

```bash
# Ativar ambiente virtual
source .venv/bin/activate

# Executar teste rápido (poucos minutos)
python3 dev/test_buscar_cfm.py
```

## Saída

O script principal gera 2 arquivos CSV:

1. **`cfm_normas_doencas_raras_YYYYMMDD_HHMMSS.csv`** - Dados brutos
   - Contém todas as normas coletadas
   - Inclui coluna `termo_busca` para rastreabilidade
   - Pode conter duplicatas

2. **`cfm_normas_doencas_raras_YYYYMMDD_HHMMSS_clean.csv`** - Dados limpos
   - Remove coluna `termo_busca`
   - Remove duplicatas
   - Pronto para análise

## Estrutura dos Dados

Colunas do CSV limpo:

| Coluna | Descrição |
|--------|-----------|
| `Tipo` | Tipo da norma (Resolução, Parecer, Emenda, etc.) |
| `UF` | Unidade federativa (CFM ou estado do CRM) |
| `Nº/Ano` | Número e ano da norma |
| `Situação` | Status da norma (Em vigor, Revogada, etc.) |
| `Ementa` | Resumo do conteúdo da norma |
| `Link` | URL para acessar a norma completa |

## Termos de Busca

O script busca as seguintes variações relacionadas a doenças raras:

1. doença rara
2. doença ultrarrara
3. doenças raras
4. doenças ultrarraras
5. medicamento órfão
6. medicamentos órfãos
7. patologia rara
8. patologia ultrarrara
9. patologias raras
10. patologias ultrarraras
11. síndrome rara
12. síndrome ultrarrara
13. síndromes raras
14. síndromes ultrarraras
15. terapia órfã
16. terapias órfãs

## Relatórios Gerados

Durante a execução, o script gera:

- **Relatório resumido** com distribuições por:
  - Termo de busca
  - Tipo de norma
  - UF
  - Situação

- **Exemplos de resultados** (3 primeiras normas)

- **Estatísticas de limpeza**:
  - Duplicatas removidas
  - Total de registros finais

## Vantagens da Nova Versão (com RasPe)

Comparado ao script original (`cfm_scraper.py`):

✅ **Código mais simples** - ~150 linhas vs ~370 linhas
✅ **Infraestrutura robusta** - retry automático, timeout, logging
✅ **Gerenciamento automático** - sessão HTTP, paginação, duplicatas
✅ **Mais rápido** - otimizações internas do RasPe
✅ **Manutenível** - usa biblioteca padrão, menos código custom
✅ **Testado** - aproveita testes do pacote RasPe

## Exemplo de Uso Programático

```python
import raspe

# Buscar normas sobre doenças raras
scraper = raspe.cfm()

# Busca simples
df = scraper.raspar(texto="doença rara")

# Buscar múltiplos termos (adiciona coluna 'termo_busca' automaticamente)
termos = ["doença rara", "medicamento órfão"]
df = scraper.raspar(texto=termos)

# Com filtros adicionais
df = scraper.raspar(
    texto="saúde",
    ano="2020",
    uf="SP"
)

# Limitar páginas (para testes rápidos)
df = scraper.raspar(
    texto="doença rara",
    paginas=range(1, 3)  # Apenas páginas 1 e 2
)
```

## Requisitos

- Python 3.11+
- Biblioteca RasPe instalada (`pip install -e .`)
- Dependências: pandas, requests, beautifulsoup4, tqdm

## Notas

- O script respeita o servidor do CFM com delays entre requisições
- Logs detalhados são gerados durante a execução
- Em caso de erro, o script tenta novamente automaticamente
- Arquivos temporários são limpos automaticamente
