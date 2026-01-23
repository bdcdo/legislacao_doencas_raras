"""
Scraper ANS usando biblioteca raspe (com bypass automático de Cloudflare)

Este script utiliza a biblioteca raspe que implementa Playwright + stealth
para bypass automático da proteção Cloudflare do portal ANSLegis.

Autor: Pesquisa Sabará - Doenças Raras
Data: Janeiro 2026
"""

import raspe
from raspe.utils import expand
import pandas as pd
from datetime import datetime


# Query booleana original (idêntica ao script anterior)
# NOTA: A partir de jan/2026, o portal ANS foi reestruturado e pode retornar
# menos resultados que antes (anteriormente incluía atos da ANVISA misturados)
QUERY_BOOLEANA = """
(((doença OU síndrome OU patologia) E (rara OU ultrarrara))
OU ((doenças OU síndromes OU patologias) E (raras OU ultrarraras))
OU (medicamento E órfão)
OU (medicamentos E órfãos)
OU (terapia E órfã)
OU (terapias E órfãs))
"""

# Expandir query booleana em lista de termos simples
TERMOS_BUSCA = expand(QUERY_BOOLEANA)


def main():
    print("=" * 60)
    print("SCRAPER ANS - Usando biblioteca raspe")
    print("=" * 60)
    print(f"\nTermos de busca: {len(TERMOS_BUSCA)}")
    for termo in TERMOS_BUSCA:
        print(f"  • {termo}")
    print()

    # Lista para acumular resultados
    todos_resultados = []

    # Executar busca para cada termo individualmente
    for i, termo in enumerate(TERMOS_BUSCA, 1):
        print(f"\n[{i}/{len(TERMOS_BUSCA)}] Buscando: '{termo}'")

        # Criar nova instância do scraper para cada busca
        scraper = raspe.ans(headless=True, debug=False)

        try:
            df = scraper.raspar(termo=termo)
            if df is not None and not df.empty:
                df['termo_busca'] = termo
                todos_resultados.append(df)
                print(f"    → {len(df)} resultados encontrados")
            else:
                print(f"    → Nenhum resultado")
        except Exception as e:
            print(f"    → Erro: {e}")

    if not todos_resultados:
        print("\n⚠️ Nenhum resultado encontrado em nenhum termo!")
        return

    # Concatenar todos os resultados
    df = pd.concat(todos_resultados, ignore_index=True)
    print(f"\nResultados brutos: {len(df)} registros")

    # Remover duplicatas baseado na URL
    df_unique = df.drop_duplicates(subset=['url'], keep='first')
    print(f"Após deduplicação: {len(df_unique)} registros únicos")

    # Salvar com timestamp
    timestamp = datetime.now().strftime("%Y_%m_%d")
    output_file = f"ans_{timestamp}.csv"
    df_unique.to_csv(output_file, index=False)

    print(f"\n✅ Dados salvos em: {output_file}")
    print(f"\nColunas: {list(df_unique.columns)}")
    print(f"\nDistribuição por situação:")
    print(df_unique['situacao'].value_counts(dropna=False))

    print(f"\nPrimeiros registros:")
    print(df_unique[['titulo', 'situacao']].head(10))


if __name__ == "__main__":
    main()
