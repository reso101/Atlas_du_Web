#!/usr/bin/env python3
"""
WEBCLAIR — Préparation du prochain lot (WEBCLAIR_modele.xlsx)
================================================================

But : générer un petit fichier "modèle" contenant uniquement le prochain
lot de définitions à traiter (par défaut 65), pris dans le pool
"X - À voir plus tard" du fichier maître WEBCLAIR_definitions.xlsx.

Ce fichier modèle est volontairement léger : c'est la seule chose que
l'historien (Claude) doit remplir à chaque session, ce qui garde les
conversations courtes même quand le registre complet dépasse 4000 lignes.

Usage :
    python3 pick_next_batch.py [taille_du_lot]

Entrée  : WEBCLAIR_definitions.xlsx (fichier maître, inchangé en sortie)
Sortie  : WEBCLAIR_modele.xlsx (écrasé avec le nouveau lot)
          + les lignes sélectionnées passent de "X - À voir plus tard"
            à "⬜ À faire" dans le fichier maître, pour réserver le lot.
"""

import sys
import openpyxl
from pathlib import Path
from copy import copy

MASTER_PATH = "WEBCLAIR_definitions.xlsx"
MODELE_PATH = "WEBCLAIR_modele.xlsx"
SHEET_NAME = "Définitions WEBCLAIR"
STATUT_POOL = "X - À voir plus tard"
STATUT_TODO = "⬜ À faire"

DEFAULT_BATCH_SIZE = 65
N_EXAMPLES = 10  # nb de lignes déjà "Fait" recopiées en tête du modèle, comme référence de style


def main():
    batch_size = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_BATCH_SIZE

    if not Path(MASTER_PATH).exists():
        raise FileNotFoundError(f"{MASTER_PATH} introuvable dans le dossier courant.")

    wb = openpyxl.load_workbook(MASTER_PATH)
    ws = wb[SHEET_NAME]

    header = [c.value for c in ws[1]]

    examples = []
    pool_rows = []  # (row_index_1based, values)
    for i, row in enumerate(ws.iter_rows(min_row=2), start=2):
        values = [c.value for c in row]
        statut = values[5]
        if statut == "✅ Fait" and len(examples) < N_EXAMPLES:
            examples.append(values)
        elif statut == STATUT_POOL and len(pool_rows) < batch_size:
            pool_rows.append((i, values))

    if len(pool_rows) < batch_size:
        print(f"⚠️  Seulement {len(pool_rows)} lignes disponibles dans le pool "
              f"'{STATUT_POOL}' (demandé : {batch_size}).")

    # Réserver le lot dans le fichier maître : X -> À faire
    for row_idx, _ in pool_rows:
        ws.cell(row=row_idx, column=6, value=STATUT_TODO)  # colonne F = Statut
    wb.save(MASTER_PATH)

    # Construire le fichier modèle
    wb_out = openpyxl.Workbook()
    ws_out = wb_out.active
    ws_out.title = "Feuil1"
    ws_out.append(header)

    for values in examples:
        ws_out.append(values)
    for _, values in pool_rows:
        # on force le statut à "À faire" aussi dans le modèle (cohérence visuelle)
        values = list(values)
        values[5] = STATUT_TODO
        ws_out.append(values)

    wb_out.save(MODELE_PATH)

    print("=== Lot préparé ===")
    print(f"  Exemples recopiés (Fait) : {len(examples)}")
    print(f"  Nouvelles lignes du lot  : {len(pool_rows)}")
    print(f"  -> {MODELE_PATH} prêt à être rempli par l'historien.")
    print(f"  -> {MASTER_PATH} : ces {len(pool_rows)} lignes sont réservées "
          f"(statut '{STATUT_TODO}').")


if __name__ == "__main__":
    main()
