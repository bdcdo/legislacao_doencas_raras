#!/usr/bin/env python3
"""
Parser de Jurisprudência do STJ sobre Doenças Raras

Este script lê o arquivo HTML salvo do portal de jurisprudência do STJ
e extrai informações estruturadas dos documentos, salvando em formato CSV.
"""

from bs4 import BeautifulSoup
import pandas as pd
import re
import os


def ler_html(caminho_arquivo):
    """
    Lê o arquivo HTML tentando diferentes encodings

    Args:
        caminho_arquivo: Caminho para o arquivo HTML

    Returns:
        str: Conteúdo do arquivo HTML
    """
    # Tenta diferentes encodings
    encodings = ['utf-8', 'latin-1', 'cp1252']

    for encoding in encodings:
        try:
            with open(caminho_arquivo, 'r', encoding=encoding) as file:
                html_content = file.read()
            print(f"Arquivo lido com encoding {encoding}")
            return html_content
        except UnicodeDecodeError:
            continue

    raise ValueError(f"Não foi possível ler o arquivo {caminho_arquivo} com nenhum dos encodings testados")


def parse_documento(doc):
    """
    Extrai informações estruturadas de um documento STJ

    Args:
        doc: Elemento BeautifulSoup representando um documento

    Returns:
        dict: Dicionário com os dados extraídos do documento
    """
    dados = {}

    try:
        # Extrai o número do processo (RESP)
        identificacao = doc.find('div', class_='clsIdentificacaoDocumento')
        if identificacao:
            dados['processo'] = identificacao.get_text().strip()

        # Extrai dados do processo (número completo)
        processo_info = doc.find('div', class_='docTitulo', string='Processo')
        if processo_info:
            processo_texto = processo_info.find_next_sibling('div', class_='docTexto')
            if processo_texto:
                linhas = processo_texto.get_text().strip().split('\n')
                dados['numero_processo'] = linhas[0] if linhas else ''
                dados['tipo_recurso'] = linhas[1] if len(linhas) > 1 else ''
                dados['codigo_processo'] = linhas[2] if len(linhas) > 2 else ''

        # Extrai relator
        relator_info = doc.find('div', class_='docTitulo', string='Relator')
        if relator_info:
            relator_texto = relator_info.find_next_sibling('div', class_='docTexto')
            if relator_texto:
                dados['relator'] = relator_texto.get_text().strip()

        # Extrai órgão julgador
        orgao_info = doc.find('div', class_='docTitulo', string='Órgão Julgador')
        if orgao_info:
            orgao_texto = orgao_info.find_next_sibling('div', class_='docTexto')
            if orgao_texto:
                dados['orgao_julgador'] = orgao_texto.get_text().strip()

        # Extrai data de julgamento
        data_julg_info = doc.find('div', class_='docTitulo', string='Data do Julgamento')
        if data_julg_info:
            data_julg_texto = data_julg_info.find_next_sibling('div', class_='docTexto')
            if data_julg_texto:
                dados['data_julgamento'] = data_julg_texto.get_text().strip()

        # Extrai data de publicação
        data_pub_info = doc.find('div', class_='docTitulo', string='Data da Publicação/Fonte')
        if data_pub_info:
            data_pub_texto = data_pub_info.find_next_sibling('div', class_='docTexto')
            if data_pub_texto:
                dados['data_publicacao'] = data_pub_texto.get_text().strip()

        # Extrai ementa
        ementa_info = doc.find('div', class_='docTitulo', string='Ementa')
        if ementa_info:
            ementa_texto = ementa_info.find_next_sibling('div', class_='docTexto')
            if ementa_texto:
                # Remove tags HTML e limpa o texto
                ementa_limpa = re.sub(r'<[^>]+>', '', str(ementa_texto))
                ementa_limpa = re.sub(r'\s+', ' ', ementa_limpa).strip()
                dados['ementa'] = ementa_limpa

        # Extrai ementa sem formatação (do textarea)
        textarea = doc.find('textarea', class_='textareaSemformatacao')
        if textarea:
            dados['ementa_sem_formatacao'] = textarea.get_text().strip()

        # Extrai acórdão
        acordao_info = doc.find('div', class_='docTitulo', string='Acórdão')
        if acordao_info:
            acordao_texto = acordao_info.find_next_sibling('div', class_='docTexto')
            if acordao_texto:
                acordao_limpo = re.sub(r'<[^>]+>', '', str(acordao_texto))
                acordao_limpo = re.sub(r'\s+', ' ', acordao_limpo).strip()
                dados['acordao'] = acordao_limpo

        # Extrai notas
        notas_info = doc.find('div', class_='docTitulo', string=re.compile(r'Notas'))
        if notas_info:
            notas_texto = notas_info.find_next_sibling('div', class_='docTexto')
            if notas_texto:
                notas_limpo = re.sub(r'<[^>]+>', '', str(notas_texto))
                notas_limpo = re.sub(r'\s+', ' ', notas_limpo).strip()
                dados['notas'] = notas_limpo

        # Extrai informações complementares à ementa
        info_comp_info = doc.find('div', class_='docTitulo', string=re.compile(r'Informações Complementares'))
        if info_comp_info:
            info_comp_texto = info_comp_info.find_next_sibling('div', class_='docTexto')
            if info_comp_texto:
                info_comp_limpo = re.sub(r'<[^>]+>', '', str(info_comp_texto))
                info_comp_limpo = re.sub(r'\s+', ' ', info_comp_limpo).strip()
                dados['informacoes_complementares'] = info_comp_limpo

        # Extrai referência legislativa
        ref_leg_info = doc.find('div', class_='docTitulo', string=re.compile(r'Referência.*Legislativa'))
        if ref_leg_info:
            ref_leg_texto = ref_leg_info.find_next_sibling('div', class_='docTexto')
            if ref_leg_texto:
                ref_leg_limpo = re.sub(r'<[^>]+>', '', str(ref_leg_texto))
                ref_leg_limpo = re.sub(r'\s+', ' ', ref_leg_limpo).strip()
                dados['referencia_legislativa'] = ref_leg_limpo

        # Extrai jurisprudência citada
        jurisp_info = doc.find('div', class_='docTitulo', string=re.compile(r'Jurisprudência.*Citada'))
        if jurisp_info:
            jurisp_texto = jurisp_info.find_next_sibling('div', class_='docTexto')
            if jurisp_texto:
                jurisp_limpo = re.sub(r'<[^>]+>', '', str(jurisp_texto))
                jurisp_limpo = re.sub(r'\s+', ' ', jurisp_limpo).strip()
                dados['jurisprudencia_citada'] = jurisp_limpo

        # Extrai link para inteiro teor do acórdão
        link_inteiro_teor = doc.find('a', href=re.compile(r'inteiro_teor'))
        if link_inteiro_teor:
            href = link_inteiro_teor.get('href')
            # Extrai a URL do JavaScript
            if href and 'javascript:inteiro_teor(' in href:
                # Remove javascript:inteiro_teor(' e ')
                url_path = href.replace("javascript:inteiro_teor('", "").replace("')", "")
                # Constrói URL completa
                dados['link_inteiro_teor'] = f"https://scon.stj.jus.br{url_path}"

    except Exception as e:
        print(f"Erro ao processar documento: {e}")
        dados['erro'] = str(e)

    return dados


def main():
    """
    Função principal que coordena o parsing do HTML e salvamento dos dados
    """
    # Define caminhos
    caminho_html = 'STJ - Jurisprudência do STJ.html'
    nome_arquivo_saida = 'documentos_stj_doencas_raras.csv'

    # Verifica se arquivo HTML existe
    if not os.path.exists(caminho_html):
        print(f"ERRO: Arquivo '{caminho_html}' não encontrado!")
        print(f"Certifique-se de que o arquivo está no mesmo diretório que este script.")
        return

    # Lê o arquivo HTML
    print("Carregando arquivo HTML...")
    html_content = ler_html(caminho_html)
    print(f"Arquivo carregado com {len(html_content)} caracteres")

    # Cria o objeto BeautifulSoup
    print("Parseando HTML com BeautifulSoup...")
    soup = BeautifulSoup(html_content, 'html.parser')

    # Busca por div com class='listadocumentos'
    lista_container = soup.find('div', class_='listadocumentos')
    if not lista_container:
        print("ERRO: Não foi encontrado o elemento 'listadocumentos' no HTML!")
        return

    lista_documentos = lista_container.find_all('div', class_='documento')
    print(f"Encontrados {len(lista_documentos)} documentos")

    # Processa todos os documentos
    print(f"\nProcessando {len(lista_documentos)} documentos...")
    todos_documentos = []

    for i, doc in enumerate(lista_documentos):
        print(f"Processando documento {i+1}/{len(lista_documentos)}")
        dados_doc = parse_documento(doc)
        dados_doc['indice'] = i + 1
        todos_documentos.append(dados_doc)

    print(f"Processamento concluído. {len(todos_documentos)} documentos processados.")

    # Cria DataFrame e salva em CSV
    print("\nCriando DataFrame...")
    df = pd.DataFrame(todos_documentos)

    # Reorganiza as colunas para ter uma ordem mais lógica
    colunas_ordenadas = [
        'indice', 'processo', 'numero_processo', 'tipo_recurso', 'codigo_processo',
        'relator', 'orgao_julgador', 'data_julgamento', 'data_publicacao',
        'ementa', 'ementa_sem_formatacao', 'acordao', 'notas',
        'informacoes_complementares', 'referencia_legislativa',
        'jurisprudencia_citada', 'link_inteiro_teor'
    ]

    # Reorganiza apenas as colunas que existem
    colunas_existentes = [col for col in colunas_ordenadas if col in df.columns]
    df = df[colunas_existentes]

    # Salva o CSV
    df.to_csv(nome_arquivo_saida, index=False, encoding='utf-8')

    print(f"\nDados salvos em '{nome_arquivo_saida}'")
    print(f"DataFrame criado com {len(df)} linhas e {len(df.columns)} colunas")
    print(f"Colunas: {list(df.columns)}")

    # Mostra uma preview dos primeiros dados
    print("\nPreview dos primeiros 3 documentos:")
    print(df.head(3))


if __name__ == "__main__":
    main()
