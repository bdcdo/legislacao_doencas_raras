import requests
import re
import time
import pandas as pd
from datetime import datetime
from bs4 import BeautifulSoup as bs


def parse_article(article):
    """
    Extrai informações relevantes de um artigo do CFM
    """
    result = {}
    
    # Extrair informações do cabeçalho
    header = article.find('div', class_='card-header')
    if header:
        ul = header.find('ul')
        if ul:
            items = ul.find_all('li')
            for item in items:
                strong = item.find('strong')
                p = item.find('p')
                if strong and p:
                    key = strong.text.strip()
                    value = p.text.strip()
                    result[key] = value
    
    # Extrair ementa
    body = article.find('div', class_='card-body')
    if body:
        ementa_span = body.find('span')
        if ementa_span:
            result['Ementa'] = ementa_span.text.strip()
    
    # Extrair link para a norma
    link = body.find('a', class_='btn btn-primary') if body else None
    if link and link.get('href'):
        result['Link'] = link.get('href')
    
    return result


def extract_pagination_info(soup):
    """
    Extrai informações de paginação da página do CFM
    """
    pagination_info = {}
    
    # Buscar por links de paginação
    pagination_links = soup.find_all('a', class_='link-navigation')
    
    # Extrair números de página
    page_numbers = []
    for link in pagination_links:
        text = link.text.strip()
        if text.isdigit():
            page_numbers.append(int(text))
    
    if page_numbers:
        pagination_info['total_pages'] = max(page_numbers)
    
    # Buscar informações textuais de página
    page_info_divs = soup.find_all('div', class_='pt-3')
    for div in page_info_divs:
        text = div.text.strip()
        if 'Mostrando página' in text and 'de' in text:
            # Extrair página atual e total
            match = re.search(r'Mostrando página (\d+) de (\d+)', text)
            if match:
                pagination_info['current_page'] = int(match.group(1))
                pagination_info['total_pages'] = int(match.group(2))
    
    # Buscar total de registros
    all_text = soup.get_text()
    records_match = re.search(r'(\d+)\s+registros encontrados', all_text)
    if records_match:
        pagination_info['total_records'] = int(records_match.group(1))
    
    return pagination_info


def extract_all_articles(html_content):
    """
    Extrai informações de todos os artigos de uma página do CFM
    """
    soup = bs(html_content, 'html.parser')
    results_div = soup.find('div', attrs={'id':'resultsNormas'})
    
    if not results_div:
        return []
    
    articles = results_div.find_all('article')
    parsed_articles = []
    
    for article in articles:
        parsed_article = parse_article(article)
        if parsed_article:  # Só adiciona se conseguiu extrair algo
            parsed_articles.append(parsed_article)
    
    return parsed_articles


def search_cfm_norms(search_term="doenças raras", page=1):
    """
    Busca normas do CFM por termo de pesquisa
    """
    url = "https://portal.cfm.org.br/buscar-normas-cfm-e-crm/#resultado"
    
    querystring = {
        "tipo[0]": "R",
        "tipo[1]": "P", 
        "tipo[2]": "E",
        "tipo[3]": "N",
        "tipo[4]": "D",
        "uf": "",
        "revogada": "",
        "numero": "",
        "ano": "",
        "ta": "OU",
        "assunto[0]": "",
        "texto": search_term,
        "pagina": str(page)
    }
    
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "pt-BR,en-US;q=0.7,en;q=0.3",
        "Connection": "keep-alive",
        "DNT": "1",
        "Priority": "u=0, i",
        "Referer": "https://portal.cfm.org.br/buscar-normas-cfm-e-crm",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Sec-GPC": "1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:141.0) Gecko/20100101 Firefox/141.0"
    }
    
    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        return response
    except requests.RequestException as e:
        print(f"Erro na requisição: {e}")
        return None


def search_all_terms():
    """
    Busca normas do CFM para todos os termos relacionados a doenças raras
    """
    search_terms = [
        'doença rara',
        'doença ultrarrara', 
        'doenças raras',
        'doenças ultrarraras',
        'medicamento órfão',
        'medicamentos órfãos',
        'patologia rara',
        'patologia ultrarrara',
        'patologias raras',
        'patologias ultrarraras',
        'síndrome rara',
        'síndrome ultrarrara',
        'síndromes raras',
        'síndromes ultrarraras',
        'terapia órfã',
        'terapias órfãs'
    ]
    
    all_results = []
    
    for term in search_terms:
        print(f"\n{'='*60}")
        print(f"Buscando termo: '{term}'")
        print(f"{'='*60}")
        
        # Fazer requisição para primeira página
        response = search_cfm_norms(term, page=1)
        
        if not response:
            print(f"Falha na requisição para termo '{term}'")
            continue
        
        # Parse do HTML
        soup = bs(response.content, 'html.parser')
        
        # Extrair informações de paginação
        pagination_info = extract_pagination_info(soup)
        
        print(f"Termo: {term}")
        if pagination_info:
            print(f"Total de registros: {pagination_info.get('total_records', 'N/A')}")
            print(f"Total de páginas: {pagination_info.get('total_pages', 'N/A')}")
        
        # Se não há registros, continua para próximo termo
        if not pagination_info.get('total_records', 0):
            print("Nenhum registro encontrado")
            continue
            
        # Extrair artigos de todas as páginas
        term_articles = []
        total_pages = pagination_info.get('total_pages', 1)
        
        for page in range(1, total_pages + 1):
            print(f"Processando página {page}/{total_pages}...")
            
            if page > 1:  # Já fizemos a primeira página
                response = search_cfm_norms(term, page=page)
                if not response:
                    print(f"Falha na requisição página {page}")
                    continue
            
            # Extrair artigos da página atual
            page_articles = extract_all_articles(response.content)
            
            # Adicionar termo de busca aos artigos
            for article in page_articles:
                article['termo_busca'] = term
                article['pagina'] = page
            
            term_articles.extend(page_articles)
            
            # Delay entre requisições para não sobrecarregar o servidor
            if page < total_pages:
                time.sleep(1)
        
        print(f"Total de artigos coletados para '{term}': {len(term_articles)}")
        all_results.extend(term_articles)
        
        # Delay entre termos de busca
        time.sleep(2)
    
    return all_results


def clean_and_filter_cfm(articles):
    """
    Limpa os dados removendo duplicatas e filtra apenas normas do CFM
    """
    if not articles:
        print("❌ Nenhum artigo para limpar")
        return []

    # Converter para DataFrame
    df = pd.DataFrame(articles)

    print(f"\n{'='*60}")
    print(f"LIMPEZA E FILTRAGEM DOS DADOS")
    print(f"{'='*60}")
    print(f"📊 Dados originais: {len(df)} registros")

    # Remover colunas de metadados da busca
    columns_to_remove = ['termo_busca', 'pagina']
    df_clean = df.drop(columns=[col for col in columns_to_remove if col in df.columns])

    # Remover duplicatas
    duplicates_before = df_clean.duplicated().sum()
    df_clean = df_clean.drop_duplicates()
    print(f"🔍 Duplicatas removidas: {duplicates_before}")
    print(f"✅ Após remoção de duplicatas: {len(df_clean)} registros")

    # Filtrar apenas CFM
    if 'UF' in df_clean.columns:
        df_cfm = df_clean[df_clean['UF'] == 'CFM'].copy()
        print(f"🎯 Filtrado apenas CFM: {len(df_cfm)} registros")
        print(f"🗑️  Registros de outros CRMs removidos: {len(df_clean) - len(df_cfm)}")
    else:
        df_cfm = df_clean
        print("⚠️  Coluna 'UF' não encontrada, mantendo todos os registros")

    return df_cfm


def save_to_csv(df, filename=None):
    """
    Salva o DataFrame limpo em um arquivo CSV
    """
    if df is None or len(df) == 0:
        print("❌ Nenhum dado para salvar")
        return None

    # Gerar nome do arquivo se não fornecido
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"cfm_normas_doencas_raras_{timestamp}.csv"

    # Reordenar colunas para melhor visualização
    column_order = ['Tipo', 'UF', 'Nº/Ano', 'Situação', 'Ementa', 'Link']

    # Manter apenas colunas que existem
    existing_columns = [col for col in column_order if col in df.columns]
    remaining_columns = [col for col in df.columns if col not in column_order]
    final_columns = existing_columns + remaining_columns

    df = df[final_columns]

    # Salvar CSV
    try:
        df.to_csv(filename, index=False, encoding='utf-8')
        print(f"\n✅ Dados salvos em: {filename}")
        print(f"📊 Total de registros: {len(df)}")
        print(f"📋 Colunas: {list(df.columns)}")
        return filename
    except Exception as e:
        print(f"❌ Erro ao salvar CSV: {e}")
        return None


def generate_summary_report(df):
    """
    Gera relatório resumido dos resultados (aceita DataFrame ou lista)
    """
    if df is None or len(df) == 0:
        return

    # Se for lista, converter para DataFrame
    if isinstance(df, list):
        df = pd.DataFrame(df)

    from collections import Counter

    # Estatísticas gerais
    print(f"\n{'='*60}")
    print(f"RELATÓRIO RESUMIDO - NORMAS CFM")
    print(f"{'='*60}")
    print(f"📊 Total de normas CFM: {len(df)}")

    # Distribuição por tipo
    if 'Tipo' in df.columns:
        tipo_counts = df['Tipo'].value_counts()
        print("\n📋 Distribuição por tipo de norma:")
        for tipo, count in tipo_counts.items():
            print(f"  • {tipo}: {count} normas")

    # Distribuição por situação
    if 'Situação' in df.columns:
        situacao_counts = df['Situação'].value_counts()
        print("\n⚖️  Distribuição por situação:")
        for situacao, count in situacao_counts.items():
            print(f"  • {situacao}: {count} normas")

    # Anos mais recentes
    if 'Nº/Ano' in df.columns:
        anos = df['Nº/Ano'].str.extract(r'/(\d{4})$', expand=False).dropna()
        if len(anos) > 0:
            ano_counts = anos.value_counts().head(5)
            print("\n📅 Anos com mais normas (Top 5):")
            for ano, count in ano_counts.items():
                print(f"  • {ano}: {count} normas")


def main():
    """
    Função principal para executar a busca e parsing
    """
    print("Iniciando busca completa de normas do CFM sobre doenças raras...")

    # Buscar todos os termos
    all_articles = search_all_terms()

    if not all_articles:
        print("❌ Nenhum artigo foi coletado")
        return

    # Limpar dados, remover duplicatas e filtrar apenas CFM
    df_cfm = clean_and_filter_cfm(all_articles)

    if df_cfm is None or len(df_cfm) == 0:
        print("❌ Nenhum dado após limpeza e filtragem")
        return

    # Gerar relatório resumido
    generate_summary_report(df_cfm)

    # Salvar em CSV
    csv_filename = save_to_csv(df_cfm)

    # Mostrar algumas normas de exemplo
    print(f"\n{'='*60}")
    print("PRIMEIRAS 3 NORMAS CFM:")
    print(f"{'='*60}")

    for i in range(min(3, len(df_cfm))):
        row = df_cfm.iloc[i]
        print(f"\nNORMA {i+1}:")
        print("-" * 50)
        for col in df_cfm.columns:
            value = row[col]
            if col == 'Ementa' and isinstance(value, str) and len(value) > 100:
                print(f"{col}: {value[:100]}...")
            else:
                print(f"{col}: {value}")

    if csv_filename:
        print(f"\n🎯 Processo concluído! Dados salvos em: {csv_filename}")


if __name__ == "__main__":
    main()