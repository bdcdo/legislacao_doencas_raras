#!/usr/bin/env python3
"""
Scraper CONITEC - Diretrizes Metodológicas e Limiares
Baixa PDFs e busca menções a "doença rara" / "doenças raras"
"""

import os
import re
import requests
import pdfplumber
import pandas as pd
from urllib.parse import urlparse, unquote
from pathlib import Path

# Diretório de trabalho
BASE_DIR = Path(__file__).parent
PDF_DIR = BASE_DIR / "pdfs"

# URLs dos documentos - Diretrizes Metodológicas (18)
URLS_DIRETRIZES = [
    ("Qualidade de Vida em Análises Econômicas", "https://rebrats.saude.gov.br/diretrizes-metodologicas?download=133:qualidade-de-vida-em-analises-economicas-pdf"),
    ("Elaboração de Notas Técnicas de Revisão Rápida - NTRR", "https://rebrats.saude.gov.br/diretrizes-metodologicas?download=135:elaboracao-de-notas-tecnicas-de-revisao-rapida-ntrr"),
    ("Revisão Sistemática com Meta-Análise em Rede", "https://rebrats.saude.gov.br/diretrizes-metodologicas?download=134:revisao-sistematica-com-meta-analise-em-rede-de-ensaios-clinicos-randomizados"),
    ("Estudos de Microcusteio", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/20220419_diretrizes_microcusteio_15062021.pdf"),
    ("Análise de Impacto Orçamentário", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretrizes_metodologicas_analise_impacto-1.pdf"),
    ("Avaliação de Desempenho de Tecnologias em Saúde", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretriz_adts_final_isbn.pdf"),
    ("Diretriz de Avaliação Econômica - 2ª edição", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretriz-de-avaliacao-economica.pdf"),
    ("Elaboração de Diretrizes Clínicas (2016)", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretrizes_metodologicas_web.pdf"),
    ("Elaboração de Diretrizes Clínicas (2023)", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretrizes-metodologicas-elaboracao-de-diretrizes-clinicas-2020.pdf"),
    ("Elaboração de Estudos para Avaliação de Equipamentos", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretrizes_metodologicas_elaboracao_estudos.pdf"),
    ("Elaboração de Pareceres Técnico-Científicos", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretrizes_metodologicas_ptc.pdf"),
    ("Elaboração de Revisão Sistemática e Metanálise de ECR", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/diretrizes_metodologicas_elaboracao_sistematica.pdf"),
    ("Revisão Sistemática e Metanálise de Estudos de Acurácia Diagnóstica", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/revisaosistematica_metanaliseestudos.pdf"),
    ("Revisão Sistemática de Estudos Observacionais", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/estudosobservacionais.pdf"),
    ("Ferramentas para Adaptação de Diretrizes Clínicas (ADAPTE)", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/adapte.pdf"),
    ("Sistema GRADE", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/sistema-grade.pdf"),
    ("Guia de Elaboração de Escopo para PCDT", "https://www.gov.br/conitec/pt-br/midias/artigos_publicacoes/diretrizes/guia_elaboracao_escopo_final_02-05-2019-1.pdf"),
    ("Manual Metodológico para Tecnologias Novas e Emergentes", "https://www.gov.br/conitec/pt-br/midias/radar/2014/manual_metodologico_mht.pdf"),
]

# URLs dos documentos - Limiares de Custo-Efetividade (3)
URLS_LIMIARES = [
    ("Limiares de Custo-Efetividade - Recomendações Finais", "https://www.gov.br/conitec/pt-br/midias/pdf/2022/20221106_relatorio-uso-de-limiares-de-custo-efetividade-nas-decisoes-em-saude.pdf"),
    ("Limiares de Custo-Efetividade - Versão Consulta Pública", "https://www.gov.br/conitec/pt-br/midias/consultas/relatorios/2022/20220620_relatorio_oficina_limiares_2022-2.pdf"),
    ("Limiares de Custo-Efetividade - Proposta 2021", "https://www.gov.br/conitec/pt-br/midias/pdf/2021/20211202_relatorio_oficina_limiares.pdf"),
]


def get_filename_from_url(url: str, title: str) -> str:
    """Gera um nome de arquivo seguro baseado no título e URL."""
    # Limpa o título para uso como nome de arquivo
    safe_title = re.sub(r'[^\w\s\-]', '', title)
    safe_title = re.sub(r'\s+', '_', safe_title)
    safe_title = safe_title[:80]  # Limita o tamanho
    return f"{safe_title}.pdf"


def download_pdf(url: str, title: str, output_dir: Path) -> Path | None:
    """Baixa um PDF e salva localmente."""
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = get_filename_from_url(url, title)
    filepath = output_dir / filename

    if filepath.exists():
        print(f"  [SKIP] Já existe: {filename}")
        return filepath

    try:
        print(f"  [DOWN] Baixando: {title}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=60, allow_redirects=True)
        response.raise_for_status()

        # Verifica se é realmente um PDF
        content_type = response.headers.get('content-type', '').lower()
        if 'pdf' not in content_type and not response.content[:4] == b'%PDF':
            print(f"  [WARN] Não parece ser PDF: {title}")
            # Tenta salvar mesmo assim

        filepath.write_bytes(response.content)
        print(f"  [OK] Salvo: {filename}")
        return filepath

    except requests.RequestException as e:
        print(f"  [ERRO] Falha ao baixar {title}: {e}")
        return None


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extrai texto de um PDF usando pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"  [ERRO] Falha ao extrair texto de {pdf_path.name}: {e}")
    return text


def search_terms(text: str, terms: list[str] = None) -> dict:
    """
    Busca termos no texto (case-insensitive).
    Retorna contagem e trechos com contexto.
    """
    if terms is None:
        terms = ["doença rara", "doenças raras"]

    results = {
        "total_mentions": 0,
        "mentions_by_term": {},
        "excerpts": []
    }

    text_lower = text.lower()

    for term in terms:
        term_lower = term.lower()
        count = text_lower.count(term_lower)
        results["mentions_by_term"][term] = count
        results["total_mentions"] += count

        # Encontra trechos com contexto (100 chars antes e depois)
        if count > 0:
            pattern = re.compile(
                r'.{0,100}' + re.escape(term_lower) + r'.{0,100}',
                re.IGNORECASE | re.DOTALL
            )
            matches = pattern.findall(text)
            for match in matches[:5]:  # Limita a 5 trechos por termo
                # Limpa o trecho
                excerpt = re.sub(r'\s+', ' ', match).strip()
                excerpt = f"...{excerpt}..."
                results["excerpts"].append({
                    "term": term,
                    "context": excerpt
                })

    return results


def process_all_documents():
    """Processa todos os documentos: baixa, extrai texto e busca termos."""
    all_docs = [
        ("Diretrizes Metodológicas", URLS_DIRETRIZES),
        ("Limiares de Custo-Efetividade", URLS_LIMIARES),
    ]

    results = []

    for category, urls in all_docs:
        print(f"\n{'='*60}")
        print(f"Processando: {category}")
        print(f"{'='*60}")

        for title, url in urls:
            print(f"\n[{title}]")

            # Baixa o PDF
            pdf_path = download_pdf(url, title, PDF_DIR)

            if pdf_path and pdf_path.exists():
                # Extrai texto
                print(f"  [TEXT] Extraindo texto...")
                text = extract_text_from_pdf(pdf_path)

                # Busca termos
                print(f"  [SEARCH] Buscando 'doença rara' / 'doenças raras'...")
                search_results = search_terms(text)

                # Prepara resultado
                result = {
                    "categoria": category,
                    "titulo": title,
                    "url": url,
                    "arquivo": pdf_path.name,
                    "total_mencoes": search_results["total_mentions"],
                    "mencoes_doenca_rara": search_results["mentions_by_term"].get("doença rara", 0),
                    "mencoes_doencas_raras": search_results["mentions_by_term"].get("doenças raras", 0),
                    "trechos": " | ".join([e["context"] for e in search_results["excerpts"][:3]])
                }

                if search_results["total_mentions"] > 0:
                    print(f"  [FOUND] {search_results['total_mentions']} menção(ões) encontrada(s)!")
                else:
                    print(f"  [NONE] Nenhuma menção encontrada")

                results.append(result)
            else:
                results.append({
                    "categoria": category,
                    "titulo": title,
                    "url": url,
                    "arquivo": "ERRO - Não baixado",
                    "total_mencoes": -1,
                    "mencoes_doenca_rara": -1,
                    "mencoes_doencas_raras": -1,
                    "trechos": ""
                })

    return results


def save_results(results: list[dict], output_path: Path):
    """Salva os resultados em CSV."""
    df = pd.DataFrame(results)
    df.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f"\nResultados salvos em: {output_path}")
    return df


def main():
    """Função principal."""
    print("="*60)
    print("SCRAPER CONITEC - Diretrizes Metodológicas e Limiares")
    print("="*60)
    print(f"Diretório de PDFs: {PDF_DIR}")

    # Processa todos os documentos
    results = process_all_documents()

    # Salva resultados
    output_csv = BASE_DIR / "resultados_busca_doenca_rara.csv"
    df = save_results(results, output_csv)

    # Resumo
    print("\n" + "="*60)
    print("RESUMO")
    print("="*60)

    total_docs = len(results)
    docs_with_mentions = sum(1 for r in results if r["total_mencoes"] > 0)
    total_mentions = sum(r["total_mencoes"] for r in results if r["total_mencoes"] > 0)

    print(f"Total de documentos processados: {total_docs}")
    print(f"Documentos com menções: {docs_with_mentions}")
    print(f"Total de menções encontradas: {total_mentions}")

    if docs_with_mentions > 0:
        print("\nDocumentos com menções a 'doença rara' / 'doenças raras':")
        for r in results:
            if r["total_mencoes"] > 0:
                print(f"  - {r['titulo']}: {r['total_mencoes']} menção(ões)")

    print("\nProcessamento concluído!")
    return df


if __name__ == "__main__":
    main()
