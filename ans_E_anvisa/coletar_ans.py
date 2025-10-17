"""
Script para coleta de dados legislativos da ANS (Agência Nacional de Saúde Suplementar)

Este script realiza scraping do portal ANSLegis para coletar atos normativos
relacionados a doenças raras e medicamentos órfãos.

IMPORTANTE:
- Este script utiliza cookies de sessão que EXPIRAM.
- A ordem de coleta (página 2 → página 1) é mantida para reproduzir CSV original.
- Ver README.md para entender as limitações de execução.

Autor: Pesquisa Sabará - Doenças Raras
Data: 2024
"""

import json
import pandas as pd
from bs4 import BeautifulSoup
import requests


def fazer_requisicao(pagina: int) -> dict:
    """
    Faz requisição POST para o portal ANSLegis.

    ATENÇÃO: Os cookies hardcoded nesta função EXPIRAM.
    Este código funciona apenas temporariamente após a captura dos cookies.

    Args:
        pagina: Número da página a ser requisitada

    Returns:
        Dicionário com resposta JSON da API
    """
    url = "https://anslegis.datalegis.net/action/ActionDatalegis.php"

    querystring = {
        "acao": "abrirPagina",
        "pagina": str(pagina),
        "legisjuris": "L"
    }

    # Query de busca: doenças raras, medicamentos órfãos, terapias órfãs
    payload = (
        "intitulolegislacao=&cod_modulo=575&cod_menu=8325&tituloPagina=&"
        "redirect_consultaato=apresentarAtos&cod_local=&co_tematica=&"
        "in_pesquisa_avancada=N&qtd_pagina=10&ordenacao=&inApsModuloBase=S&"
        "ind_legis_juris=L&usuario=146838&"
        "sgl_tipo=%2CDEC%2CDLG%2CDEL%2CLCP%2CLEI%2CCON%2CDLB%2CDEP%2CDPS%2CITR%2C"
        "%2CINM%2CINC%2CISV%2CNED%2CNTC%2COFC%2CORT%2CPOR%2CPCJ%2CPIM%2CPNT%2CPDP%2C"
        "RES%2CRAM%2CRSC%2CRHO%2CREN%2CROP%2CARO%2CATO%2CAUD%2CBIB%2CACM%2CCOM%2C"
        "CPB%2CEXC%2CETE%2CETA%2CEXL%2CDCS%2CEXD%2CEDT%2CEXM%2CISC%2CECO%2CCES%2C"
        "COV%2CEXS%2CEIT%2CMSA%2CTCM%2CCOR%2CEDL%2CIXL%2CPRG%2CERP%2CMAN%2CAFU%2C"
        "APE%2CITM%2CAFA%2CAPO%2CAPT%2CADR%2CCMS%2CCNC%2CDCP%2CDES%2CDIS%2CEXO%2C"
        "GRT%2CGDT%2CLIC%2CNOM%2CPEN%2CREC%2CRQS%2CRSO%2CREV%2CVAC%2CPDS%2CRCO%2C"
        "REP%2CRNC%2CRGM%2CRDC%2CTMS%2CVTO%2CACO%2CPAO&"
        "txt_texto=(%20((doen%5Cxe7a%20OU%20s%5Cxedndrome%20OU%20patologia)%20E%20"
        "(rara%20OU%20ultrarrara))%20OU%20((doen%5Cxe7as%20OU%20s%5Cxedndromes%20OU%20"
        "patologias)%20E%20((raras%20OU%20ultrarraras)))%20OU%20%20(medicamento%20E%20"
        "%5Cxf3rf%5Cxe3o)%20OU%20(medicamentos%20E%20%5Cxf3rf%5Cxe3os)%20OU%20"
        "(terapia%20E%20%5Cxf3rf%5Cxe3)%20OU%20(terapias%20E%20%5Cxf3rf%5Cxe3s)%20)&"
        "busca_expressao=1&num_ato=&ckGrupoTipoAto%5B%5D=&vlr_ano=&vlr_ano_final=&"
        "dta_promulgacao=&dta_promulgacao_final=&des_titulo=%5E&txt_ementa="
    )

    # ATENÇÃO: Estes cookies EXPIRAM!
    # cf_clearance = Cloudflare anti-bot challenge (expira em minutos/horas)
    # PHPSESSID = Sessão PHP (expira conforme configuração do servidor)
    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "pt-BR,en-US;q=0.7,en;q=0.3",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": (
            "cf_clearance=yCimSCoKQrfj6OvGiYP7VrFoVGQ5IcvE2R.e8Q9V5VA-1748907175-"
            "1.2.1.1-7qRthWSvyiXogLLkRVEIleoSVNeIz9gFIbpXO.G05EFnomjQZPIhAjHCa2EoHk17"
            "U0roSCLfgldArp8Vza_w46NkGrsBtKsC.2Co19i.KuB_gNrxHU2FiCyHo1YXqCBlagYOv5lt"
            "pte9Pey3mRhdDZ6pi8vrprvjqPDRN8oj1ynpvy315uNQGaNsu3HogV6pNBk6PxzPIyTGjDT1"
            "9RQRrowVwK36rFM5aJ1881U6wtTFKOG_YsqYake_RFlyj5ZpUCcAw5YZbSo1PBub1qApEBdo"
            "3NF6LmSp1EPmr2vxUxJ0ON3pZC7L9v8DDeqf4kxsTZCYYhgjhgIrZb9di9F52tA3NjPuP_qn"
            "b2L3yrTZ_gA; PHPSESSID=p9kvqkrhlqsg3jp0vg3jlvafqj"
        ),
        "DNT": "1",
        "Origin": "https://anslegis.datalegis.net",
        "Priority": "u=0",
        "Referer": (
            "https://anslegis.datalegis.net/action/ActionDatalegis.php?"
            "acao=consultarAtosInicial^&cod_modulo=575^&cod_menu=8325"
        ),
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-GPC": "1",
        "TE": "trailers",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:141.0) Gecko/20100101 Firefox/141.0",
        "X-Requested-With": "XMLHttpRequest"
    }

    response = requests.post(url, data=payload, headers=headers, params=querystring)
    return response.json()


def extrair_atos_do_html(html: str) -> list:
    """
    Parseia o HTML retornado pela API e extrai informações dos atos.

    Args:
        html: String HTML contendo os atos normativos

    Returns:
        Lista de dicionários com informações dos atos
    """
    soup = BeautifulSoup(html, 'html.parser')
    atos = soup.find_all('div', class_='ato')
    registros = []

    for ato in atos:
        conteudo = ato.find('a')
        if not conteudo:
            continue

        url = 'https://anslegis.datalegis.net' + conteudo['href']

        # Extrair elemento strong
        strong_element = conteudo.find('strong')
        if not strong_element:
            continue

        # Extrair situação (se houver span com status)
        situacao = None
        span_element = strong_element.find('span')
        if span_element:
            situacao = span_element.text.strip()
            span_element.extract()  # Remove do DOM para obter texto limpo

        titulo = strong_element.get_text().strip()

        # Extrair descrição
        descricao = None
        p_element = conteudo.find('p')
        if p_element:
            descricao = p_element.text.strip()

        registros.append({
            'url': url,
            'titulo': titulo,
            'descricao': descricao,
            'situacao': situacao
        })

    return registros


def main():
    """
    Função principal: coleta dados e salva em CSV.

    ORDEM IMPORTANTE: Coleta página 2 primeiro, depois página 1.
    Isso mantém a ordem exata do notebook original para reprodutibilidade.
    """
    print("=== Coleta de Dados ANS ===\n")
    print("ATENÇÃO: Este script usa cookies que expiram!")
    print("Se houver erro 403/401, os cookies precisam ser atualizados.\n")

    # Coletar dados NA ORDEM DO NOTEBOOK: página 2 → página 1
    # IMPORTANTE: Manter essa ordem para reproduzir CSV idêntico ao original
    todos_registros = []

    for pagina in [2, 1]:  # Ordem exata do notebook original
        print(f"Coletando página {pagina}...")

        try:
            data = fazer_requisicao(pagina)
            html = data.get('resultado', '')
            registros = extrair_atos_do_html(html)
            todos_registros.extend(registros)
            print(f"  → {len(registros)} atos encontrados")

        except Exception as e:
            print(f"  → Erro ao coletar página {pagina}: {e}")
            break

    df = pd.DataFrame(todos_registros)

    # Salvar resultados (SEM index=False para manter compatibilidade com notebook)
    output_file = 'ans.csv'
    df.to_csv(output_file)

    print(f"\n✓ Coleta concluída!")
    print(f"✓ {len(df)} registros salvos em '{output_file}'")
    print(f"\nColunas: {list(df.columns)}")
    print(f"Primeiros registros:\n{df.head()}")


if __name__ == "__main__":
    main()
