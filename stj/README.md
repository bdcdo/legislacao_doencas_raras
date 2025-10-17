# Parser de Jurisprudência STJ - Pesquisa Sabarรก (Doenças Raras)

## 📋 Descrição do Projeto

Este diretório contém um script Python para **parsing de dados estruturados** de documentos jurisprudenciais do **STJ (Superior Tribunal de Justiça)** relacionados a **doenças raras** e **medicamentos órfãos**.

O script `parser_stj.py` processa um arquivo HTML previamente baixado do portal de jurisprudência do STJ e extrai informações estruturadas, salvando-as em formato CSV.

Desenvolvido durante a pesquisa do Hospital Sabará sobre legislação e jurisprudência relacionada a doenças raras no Brasil.

---

## 🔍 Metodologia de Coleta

### Etapa 1: Captura Manual do HTML

O arquivo HTML (`STJ - Jurisprudência do STJ.html`) foi obtido através de:

1. **Acesso ao portal**: https://scon.stj.jus.br/
2. **Busca por termos específicos**:
   - Doenças raras
   - Síndromes raras
   - Medicamentos órfãos
   - Terapias órfãs
3. **Salvamento da página**: HTML completo salvo via navegador

### Etapa 2: Processamento Automatizado

O script Python realiza:

```
HTML salvo → BeautifulSoup → Parsing estruturado → CSV
```

**Vantagens desta abordagem:**
- ✅ Reproduzível: Trabalha com arquivo local
- ✅ Sem limitações de rate limiting
- ✅ Sem dependência de cookies ou autenticação
- ✅ Processamento rápido e determinístico

**Limitações:**
- ⚠️ Requer download manual prévio do HTML
- ⚠️ Snapshot em um momento específico (dados podem estar desatualizados)
- ⚠️ Limitado aos resultados da busca inicial

---

## 💻 Como Usar

### Pré-requisitos

```bash
pip install -r requirements.txt
```

### Estrutura de Arquivos Necessária

O script espera encontrar no mesmo diretório:

```
stj/
├── parser_stj.py                         # Script de parsing
├── STJ - Jurisprudência do STJ.html     # HTML baixado (necessário!)
├── README.md                             # Este arquivo
└── requirements.txt                      # Dependências
```

### Execução

```bash
cd /caminho/para/42_Sabara_Metodologia/stj
python3 parser_stj.py
```

### Saída Esperada

```
Carregando arquivo HTML...
Arquivo lido com encoding latin-1
Arquivo carregado com 1438175 caracteres
Parseando HTML com BeautifulSoup...
Encontrados 44 documentos

Processando 44 documentos...
Processando documento 1/44
Processando documento 2/44
...
Processamento concluído. 44 documentos processados.

Criando DataFrame...
Dados salvos em 'documentos_stj_doencas_raras.csv'
DataFrame criado com 44 linhas e 13 colunas
```

**Arquivo gerado:**
- `documentos_stj_doencas_raras.csv`: Dados estruturados extraídos

---

## 📊 Estrutura dos Dados Extraídos

O CSV gerado contém as seguintes colunas:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| `indice` | Número sequencial do documento | 1, 2, 3... |
| `processo` | Identificação curta do processo | RESP 1885384 |
| `numero_processo` | Número completo do processo | REsp 1885384 / RJ |
| `tipo_recurso` | Tipo de recurso interposto | RECURSO ESPECIAL |
| `codigo_processo` | Código único do processo | 2020/0180226-3 |
| `relator` | Ministro relator | Ministro PAULO DE TARSO SANSEVERINO |
| `orgao_julgador` | Órgão que julgou | T3 - TERCEIRA TURMA |
| `data_julgamento` | Data do julgamento | 18/05/2021 |
| `data_publicacao` | Data de publicação | DJe 24/05/2021 |
| `ementa` | Texto da ementa (com formatação) | RECURSO ESPECIAL. CONSUMIDOR... |
| `ementa_sem_formatacao` | Ementa em texto puro | RECURSO ESPECIAL. CONSUMIDOR... |
| `acordao` | Texto do acórdão | Vistos e relatados estes autos... |
| `link_inteiro_teor` | URL para inteiro teor do acórdão | https://scon.stj.jus.br/SCON/... |

### Exemplo de Registro

```csv
indice,processo,numero_processo,relator,orgao_julgador,data_julgamento,data_publicacao,ementa,link_inteiro_teor
1,RESP 1885384,REsp 1885384 / RJ,Ministro PAULO DE TARSO SANSEVERINO,T3 - TERCEIRA TURMA,18/05/2021,DJe 24/05/2021,"RECURSO ESPECIAL. CONSUMIDOR. PLANO DE SAÚDE...",https://scon.stj.jus.br/SCON/GetInteiroTeorDoAcordao?num_registro=202001802263...
```

---

## 🔧 Detalhes Técnicos

### Função `ler_html()`

Tenta ler o arquivo HTML com diferentes encodings:

1. UTF-8 (padrão moderno)
2. Latin-1 (comum em sistemas brasileiros)
3. CP1252 (Windows)

```python
encodings = ['utf-8', 'latin-1', 'cp1252']
```

**Por que múltiplos encodings?**
- HTMLs antigos podem usar encodings legados
- Evita erros de `UnicodeDecodeError`
- Garante leitura correta de caracteres especiais (ã, ç, etc.)

### Função `parse_documento()`

Extrai informações estruturadas usando seletores CSS e regex:

```python
# Exemplo: Extração do relator
relator_info = doc.find('div', class_='docTitulo', string='Relator')
if relator_info:
    relator_texto = relator_info.find_next_sibling('div', class_='docTexto')
    if relator_texto:
        dados['relator'] = relator_texto.get_text().strip()
```

**Técnicas utilizadas:**
- **BeautifulSoup selectors**: Busca por classes CSS específicas
- **find_next_sibling()**: Navega pela estrutura HTML
- **Regex para limpeza**: Remove tags HTML e espaços extras
- **Tratamento de exceções**: Continua mesmo se algum campo faltar

### Extração de Links

Links para inteiro teor são extraídos de JavaScript:

```javascript
javascript:inteiro_teor('/SCON/GetInteiroTeorDoAcordao?num_registro=...')
```

Convertido para:

```python
url_path = href.replace("javascript:inteiro_teor('", "").replace("')", "")
dados['link_inteiro_teor'] = f"https://scon.stj.jus.br{url_path}"
```

---

## 📝 Notas Metodológicas para Pesquisa

### Reprodutibilidade

✅ **Este script É reproduzível** porque:

1. Trabalha com arquivo HTML salvo localmente
2. Não depende de autenticação ou cookies
3. Parsing é determinístico (mesmo input → mesmo output)
4. Dependências são fixadas no `requirements.txt`

### Timestamp da Coleta

**IMPORTANTE:** Ao usar estes dados em pesquisa, documentar:

- **Data do download do HTML**: [Inserir data]
- **Termos de busca utilizados**: Doenças raras, medicamentos órfãos, etc.
- **Número de documentos encontrados**: 44
- **Versão do portal**: STJ Jurisprudência (https://scon.stj.jus.br/)
- **Data de execução do script**: [Timestamp de quando rodou]

### Documentação para Artigo Científico

Sugestão de texto metodológico:

> "Os dados de jurisprudência do STJ foram coletados através de busca manual no portal
> SCON (https://scon.stj.jus.br/) utilizando os termos 'doenças raras', 'medicamentos órfãos',
> 'terapias órfãs' e variações. A página de resultados foi salva em formato HTML em [DATA]
> e processada através de script Python utilizando a biblioteca BeautifulSoup 4.12 para
> extração estruturada de metadados dos acórdãos. Foram identificados 44 documentos
> relevantes, cujas ementas, acórdãos e referências legislativas foram extraídos e
> organizados em formato tabular para análise."

### Limitações Conhecidas

1. **Snapshot temporal**: Dados refletem resultados disponíveis no momento da coleta
2. **Completude da busca**: Limitado aos termos de busca utilizados
3. **Campos opcionais**: Nem todos os documentos possuem todos os campos
4. **Estrutura do HTML**: Script quebra se STJ mudar estrutura do portal

---

## 🐛 Troubleshooting

### "Arquivo 'STJ - Jurisprudência do STJ.html' não encontrado"

**Causa:** HTML não está no diretório correto
**Solução:**
```bash
# Verificar se arquivo existe
ls -la "STJ - Jurisprudência do STJ.html"

# Executar script do mesmo diretório do HTML
cd /caminho/para/stj
python3 parser_stj.py
```

### "Não foi encontrado o elemento 'listadocumentos'"

**Causa:** Estrutura do HTML mudou ou arquivo corrompido
**Solução:**
- Verificar se HTML foi baixado completamente
- Fazer novo download do portal STJ
- Verificar se página contém resultados de busca

### "UnicodeDecodeError"

**Causa:** Encoding não suportado
**Solução:** Script já tenta utf-8, latin-1 e cp1252. Se persistir:
```python
# Adicionar novo encoding à lista
encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
```

### "Empty DataFrame" ou "0 documentos processados"

**Causa:** HTML não contém documentos ou estrutura mudou
**Solução:**
1. Abrir HTML no navegador e verificar conteúdo
2. Inspecionar elemento para confirmar classes CSS
3. Atualizar seletores no script se necessário

---

## 🔄 Atualizando os Dados

Para obter dados atualizados:

1. **Acesse o portal STJ**: https://scon.stj.jus.br/
2. **Faça nova busca** com os termos desejados
3. **Salve a página completa** (Ctrl+S / Cmd+S)
4. **Substitua o arquivo HTML** antigo
5. **Execute o script** novamente

```bash
# Renomear arquivo antigo (backup)
mv "STJ - Jurisprudência do STJ.html" "STJ - Jurisprudência do STJ_backup_$(date +%Y%m%d).html"

# Copiar novo HTML
cp ~/Downloads/"STJ - Jurisprudência do STJ.html" .

# Executar parser
python3 parser_stj.py
```

---

## 📚 Dependências

Veja `requirements.txt` para lista completa. Principais:

- **BeautifulSoup4**: Parsing de HTML
- **pandas**: Manipulação e exportação de dados
- **lxml**: Parser HTML rápido (backend do BeautifulSoup)

---

## 📄 Licença e Uso

Este script foi desenvolvido para fins de pesquisa acadêmica. Os dados extraídos são de domínio público (jurisprudência do STJ), mas devem ser citados adequadamente em publicações.

**Citação sugerida:**
> Dados extraídos do portal de jurisprudência do Superior Tribunal de Justiça (STJ)
> através de busca realizada em [DATA]. Disponível em: https://scon.stj.jus.br/
