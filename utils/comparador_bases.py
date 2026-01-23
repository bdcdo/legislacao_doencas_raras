"""
Utilitário para comparação de bases de dados CSV.

Compara uma base antiga com uma nova e identifica:
- Registros NOVOS (presentes só na nova)
- Registros REMOVIDOS (presentes só na antiga)
- Registros MODIFICADOS (mesmo ID, dados diferentes)

Uso:
    from utils.comparador_bases import comparar_bases

    diff = comparar_bases(
        base_antiga="cfm/base_anterior.csv",
        base_nova="cfm/base_nova.csv",
        colunas_chave=["Tipo", "Nº/Ano"],
        output_diff="cfm/diff_2025_01_14.csv"
    )
"""

import pandas as pd
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict, Any


def comparar_bases(
    base_antiga: str,
    base_nova: str,
    colunas_chave: List[str],
    output_diff: Optional[str] = None,
    colunas_comparar: Optional[List[str]] = None
) -> pd.DataFrame:
    """
    Compara duas bases CSV e gera um relatório de diferenças.

    Args:
        base_antiga: Caminho para o CSV da base anterior
        base_nova: Caminho para o CSV da nova base
        colunas_chave: Lista de colunas que formam a chave única
        output_diff: Caminho opcional para salvar o diff (CSV)
        colunas_comparar: Colunas específicas para detectar modificações
                         (se None, compara todas exceto as chaves)

    Returns:
        DataFrame com as diferenças, incluindo coluna 'status':
        - NOVO: registro presente só na nova base
        - REMOVIDO: registro presente só na base antiga
        - MODIFICADO: mesmo ID mas dados diferentes
    """

    # Carregar bases
    df_antiga = pd.read_csv(base_antiga)
    df_nova = pd.read_csv(base_nova)

    print(f"📊 Base antiga: {len(df_antiga)} registros")
    print(f"📊 Base nova: {len(df_nova)} registros")

    # Verificar se as colunas chave existem
    for col in colunas_chave:
        if col not in df_antiga.columns:
            raise ValueError(f"Coluna chave '{col}' não encontrada na base antiga")
        if col not in df_nova.columns:
            raise ValueError(f"Coluna chave '{col}' não encontrada na base nova")

    # Criar chave composta
    df_antiga['_chave'] = df_antiga[colunas_chave].astype(str).agg('|'.join, axis=1)
    df_nova['_chave'] = df_nova[colunas_chave].astype(str).agg('|'.join, axis=1)

    # Conjuntos de chaves
    chaves_antiga = set(df_antiga['_chave'])
    chaves_nova = set(df_nova['_chave'])

    # Identificar diferenças
    chaves_novas = chaves_nova - chaves_antiga
    chaves_removidas = chaves_antiga - chaves_nova
    chaves_comuns = chaves_antiga & chaves_nova

    print(f"\n🔍 Análise de diferenças:")
    print(f"   ✅ Novos: {len(chaves_novas)}")
    print(f"   ❌ Removidos: {len(chaves_removidas)}")
    print(f"   🔄 Em comum: {len(chaves_comuns)}")

    # Preparar DataFrames de diferenças
    diffs = []

    # Registros NOVOS
    if chaves_novas:
        df_novos = df_nova[df_nova['_chave'].isin(chaves_novas)].copy()
        df_novos['status'] = 'NOVO'
        df_novos['campo_modificado'] = ''
        df_novos['valor_anterior'] = ''
        df_novos['valor_novo'] = ''
        diffs.append(df_novos)

    # Registros REMOVIDOS
    if chaves_removidas:
        df_removidos = df_antiga[df_antiga['_chave'].isin(chaves_removidas)].copy()
        df_removidos['status'] = 'REMOVIDO'
        df_removidos['campo_modificado'] = ''
        df_removidos['valor_anterior'] = ''
        df_removidos['valor_novo'] = ''
        diffs.append(df_removidos)

    # Verificar MODIFICADOS (registros com mesma chave mas dados diferentes)
    if chaves_comuns and colunas_comparar is None:
        # Se não especificou colunas, comparar todas exceto chave e colunas auxiliares
        colunas_comparar = [c for c in df_nova.columns
                          if c not in colunas_chave + ['_chave']]

    modificados = []
    if chaves_comuns and colunas_comparar:
        df_antiga_comum = df_antiga[df_antiga['_chave'].isin(chaves_comuns)].set_index('_chave')
        df_nova_comum = df_nova[df_nova['_chave'].isin(chaves_comuns)].set_index('_chave')

        for chave in chaves_comuns:
            row_antiga = df_antiga_comum.loc[chave]
            row_nova = df_nova_comum.loc[chave]

            campos_diferentes = []
            for col in colunas_comparar:
                if col in row_antiga.index and col in row_nova.index:
                    val_antiga = str(row_antiga[col]) if pd.notna(row_antiga[col]) else ''
                    val_nova = str(row_nova[col]) if pd.notna(row_nova[col]) else ''
                    if val_antiga != val_nova:
                        campos_diferentes.append({
                            'campo': col,
                            'anterior': val_antiga,
                            'novo': val_nova
                        })

            if campos_diferentes:
                row_mod = row_nova.to_dict()
                row_mod['_chave'] = chave
                row_mod['status'] = 'MODIFICADO'
                row_mod['campo_modificado'] = '; '.join([d['campo'] for d in campos_diferentes])
                row_mod['valor_anterior'] = '; '.join([d['anterior'][:50] for d in campos_diferentes])
                row_mod['valor_novo'] = '; '.join([d['novo'][:50] for d in campos_diferentes])
                modificados.append(row_mod)

    if modificados:
        df_modificados = pd.DataFrame(modificados)
        diffs.append(df_modificados)
        print(f"   📝 Modificados: {len(modificados)}")
    else:
        print(f"   📝 Modificados: 0")

    # Combinar todos os diffs
    if diffs:
        df_diff = pd.concat(diffs, ignore_index=True)

        # Remover coluna auxiliar
        if '_chave' in df_diff.columns:
            df_diff = df_diff.drop(columns=['_chave'])

        # Reordenar colunas para colocar status no início
        cols = ['status', 'campo_modificado', 'valor_anterior', 'valor_novo'] + \
               [c for c in df_diff.columns if c not in ['status', 'campo_modificado', 'valor_anterior', 'valor_novo']]
        df_diff = df_diff[cols]

        # Salvar se especificado
        if output_diff:
            Path(output_diff).parent.mkdir(parents=True, exist_ok=True)
            df_diff.to_csv(output_diff, index=False)
            print(f"\n💾 Diff salvo em: {output_diff}")

        return df_diff
    else:
        print("\n✨ Nenhuma diferença encontrada!")
        return pd.DataFrame()


def gerar_resumo_diff(df_diff: pd.DataFrame) -> Dict[str, Any]:
    """
    Gera um resumo estatístico do diff.

    Args:
        df_diff: DataFrame com as diferenças

    Returns:
        Dicionário com estatísticas
    """
    if df_diff.empty:
        return {'total': 0, 'novos': 0, 'removidos': 0, 'modificados': 0}

    resumo = {
        'total': len(df_diff),
        'novos': len(df_diff[df_diff['status'] == 'NOVO']),
        'removidos': len(df_diff[df_diff['status'] == 'REMOVIDO']),
        'modificados': len(df_diff[df_diff['status'] == 'MODIFICADO'])
    }

    return resumo


# Configurações pré-definidas para cada fonte de dados
CONFIGS = {
    'cfm': {
        'colunas_chave': ['Tipo', 'Nº/Ano'],
        'colunas_comparar': ['Situação', 'Ementa', 'Link']
    },
    'legislacao': {
        'colunas_chave': ['nome', 'link'],
        'colunas_comparar': ['revogacao', 'descricao']
    },
    'ms': {
        'colunas_chave': ['tipo_norma', 'numero', 'data_pub'],
        'colunas_comparar': ['ementa', 'link_url']
    },
    'ans': {
        'colunas_chave': ['url'],
        'colunas_comparar': ['titulo', 'descricao', 'situacao']
    },
    'anvisa': {
        'colunas_chave': ['url'],
        'colunas_comparar': ['titulo', 'descricao', 'situacao']
    }
}


def comparar_fonte(
    fonte: str,
    base_antiga: str,
    base_nova: str,
    output_diff: Optional[str] = None
) -> pd.DataFrame:
    """
    Compara bases usando configuração pré-definida para a fonte.

    Args:
        fonte: Nome da fonte ('cfm', 'legislacao', 'ms', 'ans', 'anvisa')
        base_antiga: Caminho para a base anterior
        base_nova: Caminho para a nova base
        output_diff: Caminho opcional para salvar o diff

    Returns:
        DataFrame com as diferenças
    """
    if fonte not in CONFIGS:
        raise ValueError(f"Fonte '{fonte}' não reconhecida. Opções: {list(CONFIGS.keys())}")

    config = CONFIGS[fonte]

    print(f"\n{'='*60}")
    print(f"📁 Comparando {fonte.upper()}")
    print(f"{'='*60}")

    return comparar_bases(
        base_antiga=base_antiga,
        base_nova=base_nova,
        colunas_chave=config['colunas_chave'],
        colunas_comparar=config['colunas_comparar'],
        output_diff=output_diff
    )


if __name__ == "__main__":
    # Exemplo de uso
    import argparse

    parser = argparse.ArgumentParser(description="Comparador de bases de dados CSV")
    parser.add_argument("fonte", choices=list(CONFIGS.keys()), help="Fonte de dados")
    parser.add_argument("base_antiga", help="Caminho para a base anterior")
    parser.add_argument("base_nova", help="Caminho para a nova base")
    parser.add_argument("-o", "--output", help="Caminho para salvar o diff")

    args = parser.parse_args()

    df_diff = comparar_fonte(
        fonte=args.fonte,
        base_antiga=args.base_antiga,
        base_nova=args.base_nova,
        output_diff=args.output
    )

    if not df_diff.empty:
        resumo = gerar_resumo_diff(df_diff)
        print(f"\n📊 Resumo: {resumo['novos']} novos, {resumo['removidos']} removidos, {resumo['modificados']} modificados")
