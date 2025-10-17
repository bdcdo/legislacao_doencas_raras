# CNS - Conselho Nacional de Saúde

## 📚 Sobre esta Pasta

Esta pasta faz parte do projeto de pesquisa **42_Sabara_Metodologia** e documenta a metodologia de coleta e análise de resoluções do Conselho Nacional de Saúde (CNS).

## 🔗 Ferramenta Completa

O **toolkit completo** para coleta, processamento e busca de resoluções CNS está disponível em:

### 📁 [../44_cns/](../44_cns/)

O projeto `44_cns` é um sistema unificado que combina:
- **Scraper**: Coleta automatizada de resoluções do site oficial
- **Search Engine**: Sistema de busca avançado com operadores booleanos
- **Interfaces**: CLI, Web e API REST

## 🎯 Contexto Metodológico

### Objetivo

Coletar e analisar resoluções do CNS relacionadas a **doenças raras** e políticas públicas de saúde no Brasil.

### Fontes de Dados

- **Site oficial**: https://www.gov.br/conselho-nacional-de-saude/
- **Período coberto**: 1988 a 2025
- **Formato dos dados**: Metadados + PDFs + Texto extraído (OCR)

### Técnicas Utilizadas

1. **Web Scraping**: BeautifulSoup + Requests
2. **Processamento de PDFs**: pdfplumber, PyMuPDF, pytesseract (OCR)
3. **Indexação**: Índice invertido para busca eficiente
4. **Normalização**: Remoção de acentos, stopwords, tokenização

## 📊 Dados Coletados

### Metadados
- Título da resolução
- Data e hora de publicação
- Tags/categorias
- Link para PDF oficial

### Texto Completo
- Extração automática via OCR
- ~500+ resoluções indexadas
- Busca full-text com operadores booleanos

## 🚀 Como Usar na Pesquisa

### 1. Instalação

```bash
cd ../44_cns
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Coleta de Dados (primeira vez)

```bash
cd ../44_cns
python main.py full  # Pipeline completo
```

### 3. Busca por Doenças Raras

```bash
# Busca simples
python main.py search "doença rara"

# Busca avançada
python main.py search '(doença OR síndrome) AND (rara OR ultrarrara)'

# Interface web
python main.py web  # Acesse http://localhost:5000
```

### 4. Análise dos Dados

```python
import pandas as pd

# Carrega dados completos
df = pd.read_csv('../44_cns/data/cns_resolucoes_com_textos_*.csv')

# Filtra por termo
doencas_raras = df[df['texto_pdf'].str.contains('doença rara', case=False, na=False)]

# Análise temporal
doencas_raras.groupby('ano').size().plot(kind='bar')
```

## 📖 Documentação Completa

Consulte o README completo em: [../44_cns/README.md](../44_cns/README.md)

## 🔍 Operadores de Busca

- **AND**: `doença AND rara` - Ambos termos presentes
- **OR**: `doença OR síndrome` - Qualquer termo
- **NOT**: `saúde NOT privada` - Exclui termo
- **Frases**: `"doença rara"` - Busca exata
- **Parênteses**: `(A OR B) AND C` - Agrupamento

## 📝 Citação

Para citar este recurso em sua pesquisa:

```
Toolkit CNS (2025). Sistema de coleta e busca de resoluções do
Conselho Nacional de Saúde. Desenvolvido para o projeto de pesquisa
42_Sabara_Metodologia.
```

## 📞 Mais Informações

- **Toolkit completo**: [../44_cns/](../44_cns/)
- **Projeto de pesquisa**: [../42_Sabara_Metodologia/](../)
- **Outros coletores**: [../legislacao/](../legislacao/), [../ms/](../ms/), [../stj/](../stj/)

---

**Nota**: Esta é uma pasta de **documentação metodológica**. O código e ferramentas completas estão em `44_cns/`.
