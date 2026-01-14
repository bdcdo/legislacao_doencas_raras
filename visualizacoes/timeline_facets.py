import csv
import os
from collections import OrderedDict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, List

MPL_CACHE_DIR = Path(__file__).resolve().parent / ".mpl-cache"
os.environ.setdefault("MPLCONFIGDIR", str(MPL_CACHE_DIR))
MPL_CACHE_DIR.mkdir(parents=True, exist_ok=True)

import matplotlib.dates as mdates
import matplotlib.pyplot as plt


@dataclass
class NormEntry:
    institution: str
    date: datetime
    tipo: str
    numero: str
    classificacao: str


def load_norms(csv_path: str) -> List[NormEntry]:
    entries: List[NormEntry] = []
    with open(csv_path, newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            institution = (row.get("Instituição geradora") or "").strip()
            date_str = (row.get("Data") or "").strip()
            if not institution or not date_str:
                continue
            try:
                date = datetime.strptime(date_str, "%d/%m/%Y")
            except ValueError:
                continue

            entries.append(
                NormEntry(
                    institution=institution,
                    date=date,
                    tipo=(row.get("Tipo") or "").strip(),
                    numero=(row.get("Número") or "").strip(),
                    classificacao=(row.get("Classificação") or "").strip(),
                )
            )
    return sorted(entries, key=lambda item: item.date)


def unique_order(values: Iterable[str]) -> List[str]:
    return list(OrderedDict.fromkeys(values))


CLASSIFICACAO_CORES = {
    "Reconhecimento": "#2ecc71",
    "Flexibilização regulatória": "#3498db",
    "Institucionalização": "#9b59b6",
    "Priorização": "#e74c3c",
    "Representação": "#f39c12",
    "Fomento ao investimento público em pesquisa/cuidados": "#1abc9c",
    "Fomento ao investimento privado em pesquisa/cuidados": "#e67e22",
    "": "#bdc3c7",  # Sem classificação
}


def build_faceted_timeline(csv_path: str, output_path: str) -> None:
    entries = load_norms(csv_path)
    if not entries:
        raise ValueError("Nenhum registro válido encontrado na planilha.")

    global_min_date = min(entry.date for entry in entries)
    global_max_date = max(entry.date for entry in entries)

    institutions = unique_order(entry.institution for entry in entries)
    num_inst = len(institutions)
    y_positions = {inst: idx for idx, inst in enumerate(reversed(institutions))}

    fig_height = max(4, 0.8 * num_inst)
    fig, ax = plt.subplots(figsize=(14, fig_height))

    for inst in institutions:
        subset = [entry for entry in entries if entry.institution == inst]
        if not subset:
            continue

        y = y_positions[inst]
        ax.hlines(
            y,
            global_min_date,
            global_max_date,
            color="#E0E0E0",
            linewidth=1,
            zorder=0,
        )
        for entry in subset:
            color = CLASSIFICACAO_CORES.get(entry.classificacao, "#bdc3c7")
            ax.scatter(
                entry.date,
                y,
                color=color,
                edgecolor="white",
                linewidth=0.8,
                s=80,
                zorder=1,
            )

    # Legenda por classificação temática
    legend_handles = []
    for classif, cor in CLASSIFICACAO_CORES.items():
        label = classif if classif else "Sem classificação"
        handle = ax.scatter([], [], color=cor, edgecolor="white", linewidth=0.8, s=80, label=label)
        legend_handles.append(handle)

    ax.legend(
        handles=legend_handles,
        loc="upper left",
        bbox_to_anchor=(1.02, 1),
        title="Classificação Temática",
        fontsize=8,
        title_fontsize=9,
    )

    ax.set_yticks(list(y_positions.values()))
    ax.set_yticklabels(list(y_positions.keys()))
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
    ax.grid(axis="x", linestyle="--", alpha=0.4)
    ax.set_title("Linha do tempo por órgão (cores por classificação temática)")
    ax.set_xlabel("Ano")
    ax.set_ylabel("Órgão")
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right")
    fig.tight_layout()

    output_path = Path(output_path)
    fig.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    build_faceted_timeline(
        "Normas sobre doenças raras - base completa - Página1.csv",
        "timeline_por_orgao.png",
    )
