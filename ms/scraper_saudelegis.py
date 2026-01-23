#!/usr/bin/env python3
"""
Script para coleta de dados sobre doenças raras no sistema SaudeLegis
usando a biblioteca raspe.

Este script usa raspe.saudelegis() que já inclui:
- Selenium com ChromeDriver automático
- Modo headless por padrão
- Deduplicação automática
- Consolidação de resultados
"""

from pathlib import Path
from datetime import datetime

import raspe
import pandas as pd


# Termos de busca
SEARCH_TERMS = ["doença rara", "doenças raras"]

# Diretório de saída
OUTPUT_DIR = Path(__file__).parent


def main():
    """Executa a coleta de dados do SaudeLegis."""

    print("=" * 80)
    print("SCRAPER SAUDELEGIS (via raspe)")
    print("=" * 80)

    all_results = []

    for idx, term in enumerate(SEARCH_TERMS, 1):
        print(f"\n[{idx}/{len(SEARCH_TERMS)}] Buscando: '{term}'")
        print("-" * 60)

        try:
            # Criar scraper com headless=True (padrão)
            scraper = raspe.saudelegis(headless=True, debug=True)

            # Executar a raspagem
            df = scraper.raspar(assunto=term)

            if df is not None and not df.empty:
                # Adicionar coluna de termo de busca
                df['termo_busca'] = term
                all_results.append(df)
                print(f"   ✅ Coletados: {len(df)} registros")
            else:
                print(f"   ⚠️ Nenhum resultado para '{term}'")

        except Exception as e:
            print(f"   ❌ Erro ao buscar '{term}': {e}")

    if not all_results:
        print("\n❌ Nenhum dado coletado!")
        return

    # Consolidar resultados
    print(f"\n{'=' * 80}")
    print("CONSOLIDAÇÃO")
    print("=" * 80)

    df_all = pd.concat(all_results, ignore_index=True)
    print(f"Total bruto: {len(df_all)} registros")

    # Remover duplicatas
    df_unique = raspe.remove_duplicates(df_all)
    duplicates_removed = len(df_all) - len(df_unique)
    print(f"Duplicatas removidas: {duplicates_removed}")
    print(f"Total único: {len(df_unique)} registros")

    # Salvar resultados
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = OUTPUT_DIR / f"ms_consolidated_{timestamp}.csv"

    df_unique.to_csv(output_file, index=False)
    print(f"\n✅ Dados salvos em: {output_file}")

    # Também salvar no arquivo padrão (para compatibilidade)
    default_output = OUTPUT_DIR / "ms_consolidated.csv"
    df_unique.to_csv(default_output, index=False)
    print(f"✅ Dados também salvos em: {default_output}")

    # Resumo
    print(f"\n{'=' * 80}")
    print("RESUMO")
    print("=" * 80)
    print(f"Termos pesquisados: {len(SEARCH_TERMS)}")
    print(f"Total de registros únicos: {len(df_unique)}")

    if 'tipo_norma' in df_unique.columns:
        print("\nDistribuição por tipo de norma:")
        for tipo, count in df_unique['tipo_norma'].value_counts().head(5).items():
            print(f"  • {tipo}: {count}")


if __name__ == "__main__":
    main()
