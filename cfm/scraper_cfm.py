"""
Scraper CFM - Conselho Federal de Medicina
Coleta normas relacionadas a doenças raras usando a biblioteca raspe.
"""

import raspe
import pandas as pd
from datetime import datetime


def main():
    """
    Função principal para coleta de normas do CFM sobre doenças raras.

    A biblioteca raspe.cfm() já implementa:
    - Busca por termos com suporte a operadores booleanos (E, OU)
    - Paginação automática
    - Filtro apenas CFM (ignora CRMs estaduais)
    """
    print("="*60)
    print("SCRAPER CFM - Normas sobre Doenças Raras")
    print("="*60)

    # Termos de busca para doenças raras
    # Usando operadores booleanos para reduzir número de consultas
    termos = [
        "(doença OR síndrome OR patologia) E (rara OR ultrarrara)",
        "(doenças OR síndromes OR patologias) E (raras OR ultrarraras)",
        "medicamento E órfão",
        "medicamentos E órfãos",
        "terapia E órfã",
        "terapias E órfãs"
    ]

    print(f"\n📋 Termos de busca: {len(termos)}")
    for i, termo in enumerate(termos, 1):
        print(f"  {i}. {termo}")

    # Inicializar scraper
    print("\n🔄 Iniciando coleta...")
    scraper = raspe.cfm()

    # Coletar dados para todos os termos
    df = scraper.raspar(texto=termos)

    if df is None or len(df) == 0:
        print("❌ Nenhum dado coletado")
        return

    print(f"\n📊 Registros coletados: {len(df)}")

    # Remover duplicatas
    df_original_len = len(df)
    df = raspe.remove_duplicates(df)
    duplicatas_removidas = df_original_len - len(df)

    print(f"🔍 Duplicatas removidas: {duplicatas_removidas}")
    print(f"✅ Registros únicos: {len(df)}")

    # Gerar nome do arquivo com timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"cfm_normas_doencas_raras_{timestamp}.csv"

    # Salvar CSV
    df.to_csv(filename, index=False, encoding='utf-8')
    print(f"\n💾 Dados salvos em: {filename}")

    # Relatório resumido
    print(f"\n{'='*60}")
    print("RELATÓRIO RESUMIDO")
    print(f"{'='*60}")

    if 'Tipo' in df.columns:
        print("\n📋 Distribuição por tipo:")
        for tipo, count in df['Tipo'].value_counts().items():
            print(f"  • {tipo}: {count}")

    if 'Situação' in df.columns:
        print("\n⚖️  Distribuição por situação:")
        for situacao, count in df['Situação'].value_counts().items():
            print(f"  • {situacao}: {count}")

    print(f"\n🎯 Processo concluído! Total: {len(df)} normas CFM")

    return df


if __name__ == "__main__":
    main()
