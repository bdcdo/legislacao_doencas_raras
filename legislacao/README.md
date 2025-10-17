# Scraper de Legislação Federal sobre Doenças Raras

Script Python para coleta automatizada de legislação federal brasileira relacionada a doenças raras.

## Instalação

```bash
# Criar ambiente virtual
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou .venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt
```

## Uso

```bash
python3 legislacao_federal_scraper.py
```

O script irá:
1. Buscar legislação usando termos relacionados a doenças raras
2. Remover duplicatas
3. Extrair conteúdo dos links e fichas legislativas
4. Contar ocorrências de termos-chave
5. Filtrar documentos candidatos

## Arquivos Gerados

O script gera 5 arquivos CSV na pasta `output/`, numerados sequencialmente para facilitar o acompanhamento do pipeline:

1. **`01_legislacao_federal_bruto.csv`**
   - Dados brutos coletados do scraping inicial
   - Contém todos os documentos encontrados antes da deduplicação

2. **`02_legislacao_sem_duplicatas_com_conteudo_links.csv`**
   - Após remoção de duplicatas
   - Inclui conteúdo extraído dos links legislativos

3. **`03_legislacao_completa_links_e_fichas.csv`**
   - Conteúdo completo: links + fichas legislativas
   - Base para análise de termos

4. **`04_legislacao_com_contagem_termos.csv`**
   - Inclui contagem de ocorrências de cada termo-chave
   - Colunas adicionais com contadores para cada palavra relevante

5. **`05_legislacao_candidatos_revisao_manual.csv`** ⚠️ **ARQUIVO FINAL**
   - Documentos filtrados que atendem aos critérios de busca
   - **Requer revisão manual** para validação final

## Importante

Este script realiza uma **triagem inicial automatizada**. Os resultados em `05_legislacao_candidatos_revisao_manual.csv` devem ser **revisados manualmente** para validação final, conforme descrito na metodologia do estudo.

## Dependências

- Python 3.8+
- pandas
- raspe (https://github.com/bdcdo/RasPe)
