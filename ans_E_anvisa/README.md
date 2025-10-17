# Coleta de Dados ANS e ANVISA - Pesquisa Sabarรก (Doenças Raras)

## 📋 Descrição do Projeto

Este diretório contém scripts Python para coleta de dados legislativos sobre **doenças raras** e **medicamentos órfãos** dos portais:

- **ANS** (Agência Nacional de Saúde Suplementar): `coletar_ans.py`
- **ANVISA** (Agência Nacional de Vigilância Sanitária): `coletar_anvisa.py`

Os scripts foram desenvolvidos durante a pesquisa do Hospital Sabará sobre legislação relacionada a doenças raras no Brasil.

---

## ⚠️ LIMITAÇÕES IMPORTANTES

### ❌ Por que estes scripts NÃO funcionam de forma repetível?

Estes scripts **não são reproduzíveis** e funcionam apenas **temporariamente** após a captura manual dos cookies. As razões são:

#### 1. **Proteção Cloudflare (cf_clearance)**

Ambos os portais (ANSLegis e ANVISALegis) utilizam **Cloudflare** como proteção anti-bot. O Cloudflare:

- Apresenta um "desafio" JavaScript ao navegador
- Valida se o cliente é um navegador real (não um bot)
- Gera um cookie `cf_clearance` após validação bem-sucedida
- Este cookie tem **tempo de expiração curto** (minutos a horas)

**O que acontece:**
```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  Navegador  │──────>│  Cloudflare  │──────>│   Servidor  │
│   (humano)  │<──────│  (desafio JS)│<──────│  ANS/ANVISA │
└─────────────┘       └──────────────┘       └─────────────┘
       │                      │
       │  Resolve desafio     │
       │  ✓ Humano validado   │
       │<─────────────────────┘
       │  Cookie: cf_clearance=xyz123...
       │
┌─────────────┐
│   Script    │──────> ❌ BLOQUEADO (sem cf_clearance válido)
│   Python    │        ❌ Cookie expirado
└─────────────┘        ❌ Desafio JS não resolvido
```

**Por que expira:**
- Segurança: prevenir uso prolongado de cookies roubados
- Anti-automação: dificultar scraping automatizado
- Rotação: o Cloudflare renova periodicamente os desafios

#### 2. **Cookies de Sessão PHP (PHPSESSID)**

Os portais utilizam sessões PHP para gerenciar estado do usuário:

```
PHPSESSID=vtejuu54eoffmncb284aab9km8
```

**Características:**
- Armazenado no servidor (apenas ID é enviado ao cliente)
- Expira após período de inatividade (configurável, geralmente 15-30 minutos)
- Pode ser invalidado quando servidor reinicia
- Pode estar vinculado a endereço IP do cliente

**Ciclo de vida:**
```
Acesso inicial → Servidor cria sessão → PHPSESSID gerado
       ↓
Cada requisição renova tempo de vida
       ↓
30 minutos sem atividade → Sessão expira
       ↓
Próxima requisição → ❌ 401 Unauthorized
```

#### 3. **Validações Adicionais**

Os servidores podem validar:

- **User-Agent**: Verificar se é um navegador conhecido
- **Endereço IP**: Cookie pode ser vinculado ao IP de origem
- **Referer**: Verificar origem da requisição
- **Cabeçalhos de segurança**: Sec-Fetch-*, DNT, etc.
- **Fingerprinting**: Combinação única de headers que identifica o cliente

---

## 🔍 Como os Scripts Foram Criados

### Processo de Captura Manual

1. **Abertura do navegador** (Firefox Developer Tools)
2. **Acesso aos portais** ANSLegis e ANVISALegis
3. **Resolução manual** do desafio Cloudflare (aguardar 5 segundos)
4. **Realização de busca** pelos termos: doenças raras, medicamentos órfãos, etc.
5. **Inspeção de requisições** AJAX na aba Network
6. **Cópia de cookies e headers** da requisição bem-sucedida
7. **Incorporação no código** Python

### Query de Busca Utilizada

```
Termos de busca (codificados em URL):
- (doença OU síndrome OU patologia) E (rara OU ultrarrara)
- (doenças OU síndromes OU patologias) E (raras OU ultrarraras)
- medicamento E órfão
- medicamentos E órfãos
- terapia E órfã
- terapias E órfãs
```

---

## 💻 Como Usar (com limitações)

### Requisitos

```bash
pip install requests beautifulsoup4 pandas
```

### Execução

```bash
# ANS
python3 coletar_ans.py

# ANVISA
python3 coletar_anvisa.py
```

### ⏱️ Janela de Funcionamento

Os scripts funcionam apenas:
- ✅ **Imediatamente após** a captura dos cookies (minutos)
- ❌ **Não funcionam** após cookies expirarem (horas/dias)
- ❌ **Não funcionam** em máquina/IP diferente

### Sintomas de Falha

Quando os cookies expiram, você verá:

```
❌ HTTP 403 Forbidden
❌ HTTP 401 Unauthorized
❌ Resposta HTML do Cloudflare challenge
❌ JSON vazio ou erro de parsing
```

---

## 📊 Dados Coletados

Cada script salva um CSV com as colunas:

| Coluna | Descrição |
|--------|-----------|
| `url` | Link para o ato normativo completo |
| `titulo` | Tipo e número do ato (ex: "RDC nº 205/2017") |
| `descricao` | Ementa/descrição do ato |
| `situacao` | Status (vigente, revogado, etc.) |

### Exemplo de Registro

```csv
url,titulo,descricao,situacao
https://anslegis.../RDC205,"Resolução RDC nº 205/2017","Estabelece procedimento especial para registro de medicamentos para doenças raras",
```

---

## 🔧 Soluções Alternativas (não implementadas)

Para criar uma solução reproduzível, seria necessário:

### Opção 1: Selenium/Playwright

```python
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

options = Options()
options.add_argument('--headless')
driver = webdriver.Firefox(options=options)

# Navegador real resolve Cloudflare automaticamente
driver.get('https://anslegis.datalegis.net/...')
# ... aguardar página carregar ...
cookies = driver.get_cookies()
```

**Vantagens:**
- ✅ Resolve Cloudflare automaticamente
- ✅ Mantém sessão viva
- ✅ Comportamento idêntico a usuário real

**Desvantagens:**
- ❌ Mais lento (navegador completo)
- ❌ Requer binários (geckodriver/chromedriver)
- ❌ Consumo maior de recursos

### Opção 2: cloudscraper

```python
import cloudscraper

scraper = cloudscraper.create_scraper()
response = scraper.post(url, data=payload, headers=headers)
```

**Vantagens:**
- ✅ Resolve alguns desafios Cloudflare
- ✅ Mais leve que Selenium
- ✅ API similar a `requests`

**Desvantagens:**
- ❌ Não funciona com desafios mais avançados
- ❌ Cloudflare atualiza constantemente proteções

### Opção 3: API Oficial

Contatar ANS/ANVISA para:
- Acesso via API oficial
- Credenciais de acesso programático
- Download em lote de dados abertos

**Vantagens:**
- ✅ Solução oficial e legal
- ✅ Dados estruturados
- ✅ Sem limitações de rate

**Desvantagens:**
- ❌ Pode não existir
- ❌ Processo burocrático
- ❌ Possível custo

---

## 📝 Notas Metodológicas para Pesquisa

### Reprodutibilidade

**Estes scripts NÃO são reproduzíveis** no sentido científico tradicional porque:

1. Dependem de cookies capturados manualmente em momento específico
2. Cookies expiram em tempo indeterminado (horas a dias)
3. Proteções anti-bot podem mudar sem aviso

### Documentação para Paper

Ao documentar a metodologia de coleta em artigo científico, sugerimos:

> "Os dados foram coletados manualmente através dos portais ANSLegis e ANVISALegis
> utilizando requisições HTTP autenticadas. Devido às proteções anti-automação
> (Cloudflare) implementadas pelos portais, a coleta foi realizada em [DATA]
> utilizando cookies de sessão com validade temporária. Os scripts utilizados
> estão disponíveis no repositório de pesquisa para fins de documentação, porém
> não são diretamente reproduzíveis devido às limitações de segurança dos portais."

### Timestamp da Coleta

**IMPORTANTE:** Documentar:
- Data e hora da coleta
- Número de registros obtidos
- Versão dos portais (se disponível)
- Critérios de busca exatos

### Arquivamento de Dados

Recomendações:
- ✅ Salvar CSVs coletados com timestamp
- ✅ Fazer backup dos dados brutos
- ✅ Documentar qualquer filtragem/limpeza posterior
- ✅ Manter cópia dos HTMLs originais (se possível)

---

## 🐛 Troubleshooting

### "403 Forbidden" ou "401 Unauthorized"

**Causa:** Cookies expiraram
**Solução:** Capturar novos cookies manualmente

### "JSON Decode Error"

**Causa:** Resposta não é JSON (provavelmente HTML do Cloudflare)
**Solução:** Verificar se cookies ainda são válidos

### "Empty DataFrame"

**Causa:** HTML retornado não contém dados esperados
**Solução:** Verificar se estrutura do portal mudou ou cookies inválidos

### "Connection timeout"

**Causa:** Portal fora do ar ou bloqueio de IP
**Solução:** Aguardar e tentar novamente, verificar conectividade