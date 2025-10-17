# Scraper SaudeLegis - Doenças Raras

## Descrição

Script automatizado para coleta e análise de dados sobre **doenças raras** no sistema [SaudeLegis](https://saudelegis.saude.gov.br/) do Ministério da Saúde do Brasil.

Este projeto foi desenvolvido para pesquisa científica sobre políticas públicas e legislação relacionadas a doenças raras no Brasil.

## Funcionalidades

O script realiza três etapas principais:

1. **Scraping com Selenium**
   - Acessa automaticamente o portal SaudeLegis
   - Realiza busca por termo específico ("doença rara")
   - Salva páginas HTML com resultados

2. **Parsing com BeautifulSoup**
   - Processa todos os arquivos HTML salvos
   - Extrai dados estruturados de cada norma

3. **Exportação**
   - Consolida dados em um único arquivo CSV
   - Formato tabular pronto para análise

## Sobre a Seleção de Palavras-chave

⚠️ **Importante**: O termo de busca utilizado (`"doença rara"`) foi selecionado após **testes manuais exaustivos** com diversas palavras-chave relacionadas.

**Somente foram incluídas no scraping as palavras-chave que retornaram resultados efetivos** no sistema SaudeLegis. Termos que não geraram resultados foram descartados.

Esta abordagem garante que o script colete apenas dados realmente disponíveis no sistema, evitando buscas desnecessárias e otimizando o tempo de execução.

## Estrutura de Dados Coletados

Cada registro extraído contém:

| Campo | Descrição |
|-------|-----------|
| `tipo_norma` | Tipo da norma (PRT, RES, LEI, etc.) |
| `numero` | Número da norma |
| `data_pub` | Data de publicação |
| `origem` | Órgão emissor |
| `ementa` | Resumo/ementa da norma |
| `link_url` | URL para texto completo |

## Requisitos

### Dependências Python

Instale as dependências com:

```bash
pip install -r requirements.txt
```

### Requisitos do Sistema

- **ChromeDriver**: O Selenium requer o ChromeDriver instalado e configurado
  - Baixe em: https://chromedriver.chromium.org/
  - Alternativamente, use `webdriver-manager`:
    ```bash
    pip install webdriver-manager
    ```
    E modifique o código para usar:
    ```python
    from webdriver_manager.chrome import ChromeDriverManager
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    ```

- **Google Chrome**: Navegador Chrome instalado

## Como Usar

### Execução Básica

```bash
python3 scraper_saudelegis.py
```

### Execução com Paginação

Para coletar páginas adicionais (atualmente desabilitada por padrão), modifique a linha 315 em `scraper_saudelegis.py`:

```python
scrape_saudelegis(use_pagination=True)  # Ativa coleta de múltiplas páginas
```

### Estrutura de Arquivos Gerados

```
ms/
├── scraper_saudelegis.py        # Script principal
├── requirements.txt              # Dependências
├── README.md                     # Esta documentação
├── saudelegis_pages/            # Diretório criado automaticamente
│   ├── search_results_initial_*.html
│   └── search_results_page_*.html
└── ms.csv                       # Arquivo final com dados consolidados
```

## Configurações

Você pode modificar as constantes no início do script:

```python
SEARCH_TERM = "doença rara"      # Termo de busca
SEARCH_URL = "https://..."       # URL do sistema
SAVE_DIR = "saudelegis_pages"    # Diretório para HTMLs
OUTPUT_CSV = "ms.csv"            # Arquivo CSV de saída
```

## Fluxo de Execução

```
┌─────────────────────────────────────────────┐
│ 1. SCRAPING (Selenium)                      │
│    • Configura Chrome WebDriver             │
│    • Acessa SaudeLegis                      │
│    • Preenche formulário de busca           │
│    • Salva HTML dos resultados              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. PARSING (BeautifulSoup)                  │
│    • Localiza arquivos HTML salvos          │
│    • Extrai dados da tabela de resultados   │
│    • Estrutura informações em lista         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. EXPORTAÇÃO (Pandas)                      │
│    • Converte lista para DataFrame          │
│    • Salva em formato CSV                   │
│    • Exibe estatísticas de coleta           │
└─────────────────────────────────────────────┘
```

## Limitações e Considerações

- **Taxa de requisições**: O script inclui delays (`time.sleep`) para evitar sobrecarga no servidor
- **Estabilidade do site**: XPaths e IDs dos elementos podem mudar se o site for atualizado
- **Paginação**: A função de paginação (`buttons()`) está implementada mas desabilitada por padrão
- **Session timeout**: Buscas muito longas podem expirar a sessão do servidor

## Solução de Problemas

### Erro: "ChromeDriver not found"
Instale o ChromeDriver ou use `webdriver-manager` (veja seção Requisitos)

### Erro: "Could not find the results table"
Verifique se o site mudou sua estrutura. Pode ser necessário atualizar os seletores CSS/XPath

### Nenhum dado coletado
Verifique se:
- O termo de busca retorna resultados no site manualmente
- Os arquivos HTML foram salvos corretamente em `saudelegis_pages/`
- Não há erros de parsing no console

## Licença

Este script foi desenvolvido para fins de pesquisa acadêmica. Respeite os termos de uso do portal SaudeLegis ao utilizar este código.

---

**Nota**: Este script é fornecido "como está" para fins educacionais e de pesquisa. Use de forma responsável e ética.
