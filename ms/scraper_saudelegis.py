#!/usr/bin/env python3
"""
Script para coleta e análise de dados sobre doenças raras no sistema SaudeLegis
do Ministério da Saúde.

Este script realiza:
1. Busca automatizada no portal SaudeLegis usando Selenium
2. Salvamento das páginas HTML com resultados
3. Parsing dos resultados e extração de dados estruturados
4. Exportação para CSV

Desenvolvido para pesquisa científica sobre doenças raras.
"""

import os
import glob
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd


# ============================================================================
# CONFIGURAÇÕES
# ============================================================================

SEARCH_TERMS = ["doença rara", "doenças raras"]
SEARCH_URL = "https://saudelegis.saude.gov.br/saudelegis/secure/norma/listPublic.xhtml"
BASE_SAVE_DIR = "saudelegis_pages"
FINAL_OUTPUT_CSV = "ms_consolidated.csv"
DUPLICATES_CSV = "ms_duplicates.csv"


# ============================================================================
# FUNÇÕES DE SCRAPING (SELENIUM)
# ============================================================================

def setup_driver():
    """Configura o Chrome WebDriver com opções básicas"""
    chrome_options = Options()

    # Adiciona opções úteis
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)

    # Inicializa o driver
    driver = webdriver.Chrome(options=chrome_options)

    # Define espera implícita
    driver.implicitly_wait(10)

    return driver


def save_html_page(driver, filename, save_dir):
    """Salva o HTML da página atual em um arquivo local"""
    try:
        # Cria diretório para páginas salvas se não existir
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        # Obtém o código-fonte da página
        page_source = driver.page_source

        # Cria caminho completo do arquivo
        file_path = os.path.join(save_dir, filename)

        # Salva no arquivo
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(page_source)

        print(f"HTML salvo em: {file_path}")
        return file_path

    except Exception as e:
        print(f"Erro ao salvar HTML: {str(e)}")
        return None


def buttons(driver, timestamp, save_dir, max_pages=10):
    """
    Clica nos botões de paginação numérica para coletar todos os resultados disponíveis.

    Args:
        driver: WebDriver do Selenium
        timestamp: Timestamp para nomenclatura dos arquivos
        save_dir: Diretório para salvar os HTMLs
        max_pages: Número máximo de páginas a coletar (proteção contra loops infinitos)
    """
    page_num = 2  # Começamos da página 2 (página 1 já foi salva)

    while page_num <= max_pages:
        try:
            print(f"\n--- Página {page_num} ---")

            # Tenta encontrar o link numérico da próxima página
            # Os links estão dentro da tabela form:grid como: <a>2</a>, <a>3</a>, etc.
            print(f"Procurando link para página {page_num}...")

            page_link = None
            try:
                # Tenta encontrar o link numérico exato
                # XPath: //a[text()='2' or text()='3' etc] que está dentro da área de paginação
                page_link = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, f"//a[text()='{page_num}' and contains(@id, 'form:')]"))
                )
                print(f"✅ Link para página {page_num} encontrado: ID={page_link.get_attribute('id')}")
            except:
                print(f"❌ Link para página {page_num} não encontrado. Fim da paginação.")
                break

            # Clica no link da página
            print(f"Clicando no link da página {page_num}...")
            driver.execute_script("arguments[0].click();", page_link)  # Usa JavaScript para garantir o clique

            # Aguarda o carregamento da página após o clique
            print("Aguardando carregamento da página após o clique...")
            time.sleep(5)

            # Salva o HTML após este clique
            print(f"Salvando HTML da página {page_num}...")
            save_html_page(driver, f"search_results_page_{page_num}_{timestamp}.html", save_dir)

            print(f"✅ Página {page_num} concluída com sucesso!")
            page_num += 1

        except Exception as e:
            print(f"❌ Erro ao processar página {page_num}: {str(e)}")
            print("Encerrando paginação.")
            break

    total_pages_collected = page_num - 2  # -1 para a última tentativa, -1 porque começamos da página 2
    print(f"\n✅ Paginação concluída. Total de páginas adicionais coletadas: {total_pages_collected}")


def scrape_saudelegis(search_term, save_dir, use_pagination=False):
    """
    Função principal para acessar o site SaudeLegis e coletar dados.

    Args:
        search_term (str): Termo de busca a ser usado
        save_dir (str): Diretório onde salvar os HTMLs
        use_pagination (bool): Se True, tenta coletar páginas adicionais usando paginação
    """
    driver = None

    try:
        # Configura o driver
        print("Configurando Chrome WebDriver...")
        driver = setup_driver()

        # Navega para o site
        print(f"Acessando: {SEARCH_URL}")
        driver.get(SEARCH_URL)

        # Aguarda o carregamento da página
        print("Aguardando carregamento da página...")
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )

        # Imprime informações básicas da página
        print(f"Título da página: {driver.title}")
        print(f"URL atual: {driver.current_url}")
        print("Página carregada com sucesso!")

        # Aguarda o campo de formulário estar presente e interagível
        print("Procurando pelo campo de formulário 'assunto'...")
        assunto_field = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="form:assunto"]'))
        )

        # Limpa o campo e insere o termo de busca
        print(f"Inserindo '{search_term}' no campo de formulário...")
        assunto_field.clear()
        assunto_field.send_keys(search_term)
        print("Texto inserido com sucesso!")

        # Aguarda um momento para ver o texto inserido
        time.sleep(2)

        # Aguarda o botão de busca ficar clicável e clica nele
        print("Procurando pelo botão de busca...")
        search_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/form/fieldset/div[7]/div/div/input[1]'))
        )

        print("Clicando no botão de busca...")
        search_button.click()
        print("Botão clicado com sucesso!")

        # Aguarda os resultados carregarem
        print("Aguardando resultados da busca...")
        time.sleep(5)

        # Imprime a nova URL após a busca
        print(f"URL atual após a busca: {driver.current_url}")

        # Salva a página inicial de resultados
        print("Salvando página inicial de resultados...")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_html_page(driver, f"search_results_initial_{timestamp}.html", save_dir)

        # Opcionalmente, coleta páginas adicionais através de paginação
        if use_pagination:
            print("\nColetando páginas adicionais através de paginação...")
            buttons(driver, timestamp, save_dir)

        # Mantém o navegador aberto por um tempo para visualizar os resultados finais
        print("\nTodas as iterações concluídas! Mantendo navegador aberto por 10 segundos para visualizar resultados finais...")
        time.sleep(10)

    except Exception as e:
        print(f"Ocorreu um erro: {str(e)}")

    finally:
        # Fecha o navegador
        if driver:
            print("Fechando navegador...")
            driver.quit()


# ============================================================================
# FUNÇÕES DE PARSING (BEAUTIFULSOUP)
# ============================================================================

def parse_html_files(directory=None):
    """
    Processa todos os arquivos HTML salvos e extrai dados estruturados.

    Args:
        directory (str): Diretório contendo os arquivos HTML

    Returns:
        list: Lista de listas contendo os dados extraídos
    """
    # Obtém todos os arquivos HTML do diretório
    html_files = glob.glob(os.path.join(directory, '*.html'))
    print(f"Encontrados {len(html_files)} arquivos HTML para processar:")
    for file in html_files:
        print(f"  - {os.path.basename(file)}")

    # Inicializa lista para armazenar todas as informações extraídas
    all_infos = []

    # Processa cada arquivo HTML
    for html_file in html_files:
        print(f"\nProcessando: {os.path.basename(html_file)}")

        # Lê o arquivo HTML
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()

        # Faz parsing com BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')

        # Encontra a tabela de resultados
        results_table = soup.find('table', id='form:grid')

        if not results_table:
            print(f"❌ Não foi possível encontrar a tabela de resultados em {os.path.basename(html_file)}")
            continue

        # Encontra todas as linhas da tabela no tbody
        tbody = results_table.find('tbody')
        if not tbody:
            print(f"❌ Não foi possível encontrar tbody em {os.path.basename(html_file)}")
            continue

        rows = tbody.find_all('tr')
        print(f"Encontrados {len(rows)} resultados neste arquivo")

        # Extrai dados de cada linha
        for i, row in enumerate(rows):
            cells = row.find_all('td')
            if len(cells) < 8:  # Garante que a linha tem colunas suficientes
                continue

            num_ident = cells[0].text.strip()
            numero = cells[1].text.strip()
            origem = cells[2].text.strip()
            tipo_norma = cells[3].text.strip()
            data_pub = cells[4].text.strip()
            ementa = cells[5].text.strip()
            link_tag = cells[7].find('a', {'title': 'Texto Completo'})
            link_url = link_tag['href'] if link_tag else 'N/A'

            all_infos.append([tipo_norma, numero, data_pub, origem, ementa, link_url])

    print(f"\n✅ Processamento completo! Total de registros coletados: {len(all_infos)}")

    if len(all_infos) > 0:
        print(f"Registros de exemplo:")
        for i, info in enumerate(all_infos[:3]):  # Mostra os primeiros 3 registros
            print(f"  {i+1}. {info[0]} - {info[1]} ({info[2]})")

    return all_infos


def save_to_csv(data, output_file="output.csv"):
    """
    Salva os dados extraídos em um arquivo CSV.

    Args:
        data (list): Lista de listas com os dados
        output_file (str): Nome do arquivo de saída
    """
    df = pd.DataFrame(data, columns=['tipo_norma', 'numero', 'data_pub', 'origem', 'ementa', 'link_url'])
    df.to_csv(output_file, index=False)
    print(f"\n✅ Dados salvos em: {output_file}")
    print(f"Total de linhas: {len(df)}")

    return df


# ============================================================================
# FUNÇÃO PRINCIPAL
# ============================================================================

def consolidate_csvs(csv_files):
    """
    Consolida múltiplos CSVs, remove duplicatas e salva arquivos consolidados.

    Args:
        csv_files (list): Lista de caminhos dos arquivos CSV a consolidar

    Returns:
        tuple: (DataFrame consolidado, DataFrame de duplicatas)
    """
    print("\n[CONSOLIDAÇÃO] Consolidando CSVs e removendo duplicatas...")
    print("-"*80)

    # Lê todos os CSVs
    all_dfs = []
    for csv_file in csv_files:
        if os.path.exists(csv_file):
            df = pd.read_csv(csv_file)
            print(f"  - {csv_file}: {len(df)} registros")
            all_dfs.append(df)
        else:
            print(f"  ⚠️ Arquivo não encontrado: {csv_file}")

    if not all_dfs:
        print("  ❌ Nenhum CSV válido encontrado para consolidar")
        return None, None

    # Concatena todos os DataFrames
    combined_df = pd.concat(all_dfs, ignore_index=True)
    print(f"\nTotal de registros antes de remover duplicatas: {len(combined_df)}")

    # Identifica duplicatas baseado em todas as colunas exceto link_url
    # (dois registros são duplicados se tiverem mesmo tipo_norma, numero, data_pub, origem e ementa)
    duplicate_cols = ['tipo_norma', 'numero', 'data_pub', 'origem', 'ementa']

    # Encontra duplicatas
    duplicates_mask = combined_df.duplicated(subset=duplicate_cols, keep='first')
    duplicates_df = combined_df[duplicates_mask].copy()

    # Remove duplicatas
    consolidated_df = combined_df.drop_duplicates(subset=duplicate_cols, keep='first')

    print(f"Total de registros após remover duplicatas: {len(consolidated_df)}")
    print(f"Total de duplicatas removidas: {len(duplicates_df)}")

    # Salva o CSV consolidado
    consolidated_df.to_csv(FINAL_OUTPUT_CSV, index=False)
    print(f"\n✅ CSV consolidado salvo em: {FINAL_OUTPUT_CSV}")

    # Salva duplicatas se houver
    if len(duplicates_df) > 0:
        duplicates_df.to_csv(DUPLICATES_CSV, index=False)
        print(f"✅ Duplicatas salvas em: {DUPLICATES_CSV}")

    return consolidated_df, duplicates_df


def main():
    """
    Executa o pipeline completo de coleta e processamento de dados para múltiplos termos de busca.
    """
    print("="*80)
    print("SCRAPER SAUDELEGIS - Coleta de Dados sobre Doenças Raras")
    print("="*80)

    csv_files = []

    # Processa cada termo de busca
    for idx, search_term in enumerate(SEARCH_TERMS, 1):
        print(f"\n{'='*80}")
        print(f"PROCESSANDO TERMO {idx}/{len(SEARCH_TERMS)}: '{search_term}'")
        print(f"{'='*80}")

        # Define diretórios e arquivos específicos para este termo
        # Normaliza o termo para usar como nome de diretório/arquivo
        term_slug = search_term.replace(' ', '_').replace('ã', 'a').replace('ç', 'c')
        save_dir = f"{BASE_SAVE_DIR}_{term_slug}"
        output_csv = f"ms_{term_slug}.csv"

        # Etapa 1: Scraping
        print(f"\n[ETAPA 1] Iniciando coleta de dados via Selenium...")
        print("-"*80)
        scrape_saudelegis(search_term=search_term, save_dir=save_dir, use_pagination=True)

        # Etapa 2: Parsing
        print(f"\n[ETAPA 2] Processando arquivos HTML coletados...")
        print("-"*80)
        data = parse_html_files(directory=save_dir)

        # Etapa 3: Salvamento
        if data:
            print(f"\n[ETAPA 3] Salvando dados em CSV...")
            print("-"*80)
            df = save_to_csv(data, output_file=output_csv)
            csv_files.append(output_csv)
        else:
            print(f"\n⚠️ AVISO: Nenhum dado foi coletado para o termo '{search_term}'")

    # Etapa 4: Consolidação
    if csv_files:
        print(f"\n{'='*80}")
        print(f"CONSOLIDAÇÃO FINAL")
        print(f"{'='*80}")
        consolidated_df, duplicates_df = consolidate_csvs(csv_files)

        if consolidated_df is not None:
            print("\n" + "="*80)
            print("PROCESSAMENTO CONCLUÍDO COM SUCESSO!")
            print("="*80)
            print(f"\nResumo:")
            print(f"  - Termos pesquisados: {len(SEARCH_TERMS)}")
            print(f"  - CSVs individuais gerados: {len(csv_files)}")
            print(f"  - Total de registros únicos: {len(consolidated_df)}")
            print(f"  - Total de duplicatas: {len(duplicates_df) if duplicates_df is not None else 0}")
        else:
            print("\n" + "="*80)
            print("AVISO: Erro durante a consolidação dos dados.")
            print("="*80)
    else:
        print("\n" + "="*80)
        print("AVISO: Nenhum dado foi coletado em nenhuma das buscas.")
        print("="*80)


if __name__ == "__main__":
    main()
