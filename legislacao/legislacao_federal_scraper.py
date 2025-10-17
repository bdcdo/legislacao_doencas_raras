"""
Script para coleta e processamento de legislação federal sobre doenças raras.

Este script realiza uma TRIAGEM INICIAL automatizada de legislação.
Os resultados devem ser revisados manualmente para validação final.

Fluxo:
1. Busca legislação usando termos relacionados a doenças raras
2. Remove duplicatas
3. Extrai conteúdo de links e fichas
4. Verifica ocorrências de termos (contagem)
5. Filtra documentos candidatos (critério: pelo menos 1 ocorrência)

"""

import re
from pathlib import Path

import raspe
import pandas as pd


# Termos de busca
QUERY_BUSCA = """
(
((doença OU síndrome OU patologia) E (rara OU ultrarrara)) OU
((doenças OU síndromes OU patologias) E ((raras OU ultrarraras))) OU
(medicamento E órfão) OU
(medicamentos E órfãos) OU
(terapia E órfã) OU
(terapias E órfãs)
)
"""

# Critérios de filtragem
SUBSTANTIVOS = ['medicamento', 'medicamentos', 'terapia', 'terapias',
               'patologia', 'patologias', 'síndrome', 'síndromes',
               'doença', 'doenças']

QUALIFICADORES = ['órfãs', 'rara', 'raras', 'ultrarraras']


def verificar_ocorrencias_termos(df: pd.DataFrame, content_column: str = 'infos_completas') -> pd.DataFrame:
    """
    Conta ocorrências de cada termo de busca no conteúdo.

    Args:
        df: DataFrame com conteúdo a ser analisado
        content_column: Nome da coluna com conteúdo

    Returns:
        DataFrame com colunas adicionais de contagem por termo
    """
    df_count = df.copy()

    # Extrai termos únicos de todos os termos de busca
    set_of_words = set(' '.join(df_count.termo_busca.unique()).split())

    for word in set_of_words:
        # Regex para palavra completa
        pattern = r'(?<!\w)' + re.escape(word) + r'(?!\w)'
        df_count[word] = df_count.apply(
            lambda row: len(re.findall(pattern, str(row[content_column]).lower()))
            if pd.notna(row[content_column]) else 0,
            axis=1
        )

    return df_count


def filtrar_relevantes(df: pd.DataFrame) -> pd.DataFrame:
    """
    Filtra registros relevantes baseado em ocorrências de termos.

    Critério: deve ter pelo menos uma ocorrência de um substantivo
    E pelo menos uma ocorrência de um qualificador.

    Args:
        df: DataFrame com contagens de termos

    Returns:
        DataFrame filtrado
    """
    # Condição: pelo menos um substantivo com 1+ ocorrências
    substantivo_presente = df[SUBSTANTIVOS].ge(1).any(axis=1)

    # Condição: pelo menos um qualificador com 1+ ocorrências
    qualificador_presente = df[QUALIFICADORES].ge(1).any(axis=1)

    return df[substantivo_presente & qualificador_presente]


def processar_legislacao(output_dir: Path, save_intermediates: bool = True) -> pd.DataFrame:
    """
    Executa pipeline completo de coleta e processamento.

    Args:
        output_dir: Diretório para salvar arquivos
        save_intermediates: Se True, salva arquivos intermediários

    Returns:
        DataFrame com legislação filtrada
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print("1. Construindo query de busca...")
    termos = raspe.expand(QUERY_BUSCA)
    print(f"   Termos expandidos: {len(termos)}")

    print("\n2. Realizando scraping...")
    scraper = raspe.presidencia()
    dados = scraper.scrape(pesquisa=termos, debug=True)
    print(f"   Registros coletados: {len(dados)}")

    if save_intermediates:
        dados.to_csv(output_dir / '01_legislacao_federal_bruto.csv', index=False)

    print("\n3. Removendo duplicatas...")
    dados = raspe.remove_duplicates(dados)
    print(f"   Registros únicos: {len(dados)}")

    print("\n4. Extraindo conteúdo dos links...")
    dados = raspe.extract(dados, 'link')

    if save_intermediates:
        dados.to_csv(output_dir / '02_legislacao_sem_duplicatas_com_conteudo_links.csv', index=False)

    print("\n5. Extraindo conteúdo das fichas...")
    dados = raspe.extract(dados, 'ficha')

    if save_intermediates:
        dados.to_csv(output_dir / '03_legislacao_completa_links_e_fichas.csv', index=False)

    print("\n6. Combinando informações...")
    dados['infos_completas'] = dados['ficha_content'] + dados['link_content']

    print("\n7. Verificando ocorrências de termos...")
    dados = verificar_ocorrencias_termos(dados)
    dados.drop(['Unnamed: 0'], axis=1, errors='ignore', inplace=True)
    dados.to_csv(output_dir / '04_legislacao_com_contagem_termos.csv', index=False)
    print(f"   Termos verificados e contados")

    print("\n8. Filtrando registros relevantes...")
    dados_filtrados = filtrar_relevantes(dados)
    print(f"   Registros filtrados: {len(dados_filtrados)}")

    dados_filtrados.to_csv(output_dir / '05_legislacao_candidatos_revisao_manual.csv', index=False)

    print("\n✓ Pipeline concluído!")
    print(f"  Arquivo final: {output_dir / '05_legislacao_candidatos_revisao_manual.csv'}")

    return dados_filtrados


def main():
    """Função principal."""
    output_dir = Path(__file__).parent / 'output'

    resultado = processar_legislacao(output_dir, save_intermediates=True)

    print(f"\nResumo final:")
    print(f"  Total de registros relevantes: {len(resultado)}")
    print(f"  Arquivos salvos em: {output_dir}")


if __name__ == '__main__':
    main()
