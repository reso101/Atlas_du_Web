#!/usr/bin/env python3
"""
WEBCLAIR — Conversion Excel -> atlas.json
==========================================

Usage :
    python3 excel_to_json.py

Ce script lit WEBCLAIR_definitions.xlsx, ne prend que les lignes marquées
"✅ Fait", et met à jour atlas.json (nodes + edges) en conséquence.
Il ne touche jamais aux entrées "prospective".

Placer les 3 fichiers dans le même dossier avant de lancer :
    - atlas.json
    - WEBCLAIR_definitions.xlsx
    - excel_to_json.py
"""

import json
import openpyxl
from pathlib import Path

EXCEL_PATH = "WEBCLAIR_definitions.xlsx"
JSON_PATH = "atlas.json"
SHEET_NAME = "Définitions WEBCLAIR"

VALID_RELATION_TYPES = {
    "DEPENDS_ON", "INFLUENCE", "EVOLVES_INTO",
    "REPLACED_BY", "STANDARDISATION", "CONCURRENCE"
}


def parse_relations(raw, source_id):
    """'DEPENDS_ON:tcpip ; INFLUENCE:http2' -> [{'s':..,'t':..,'type':..}, ...]"""
    if not raw:
        return []
    result = []
    for chunk in str(raw).split(";"):
        chunk = chunk.strip()
        if not chunk or ":" not in chunk:
            continue
        rel_type, target = chunk.split(":", 1)
        rel_type = rel_type.strip().upper()
        target = target.strip()
        if rel_type not in VALID_RELATION_TYPES:
            print(f"  ⚠️  Type de relation inconnu ignoré : '{rel_type}' (ligne {source_id})")
            continue
        if not target:
            continue
        result.append({"s": source_id, "t": target, "type": rel_type})
    return result


def parse_sources(raw):
    if not raw:
        return []
    return [s.strip() for s in str(raw).split(";") if s.strip()]


def main():
    if not Path(JSON_PATH).exists():
        raise FileNotFoundError(f"{JSON_PATH} introuvable dans le dossier courant.")
    if not Path(EXCEL_PATH).exists():
        raise FileNotFoundError(f"{EXCEL_PATH} introuvable dans le dossier courant.")

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    nodes_by_id = {n["id"]: n for n in data["nodes"]}
    existing_edges = {(e["s"], e["t"], e["type"]) for e in data["edges"]}
    all_valid_ids = set(nodes_by_id.keys())  # pour vérifier les cibles de relations plus tard

    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    ws = wb[SHEET_NAME]

    rows = list(ws.iter_rows(min_row=2, values_only=True))

    added, updated, skipped_not_done, skipped_incomplete = 0, 0, 0, 0
    new_edges = []
    pending_relations = []  # (raw_relations, id) à traiter après ajout de tous les nodes

    for row in rows:
        (rid, nom, categorie, annee, importance, statut,
         desc_courte, desc_longue, sources, relations, notes) = row

        if statut != "✅ Fait":
            skipped_not_done += 1
            continue

        if not desc_courte or not desc_longue:
            print(f"  ⚠️  '{nom}' marqué Fait mais description manquante -> ignoré")
            skipped_incomplete += 1
            continue

        node = {
            "id": rid,
            "nom": nom,
            "annee": int(annee) if annee else None,
            "categorie": categorie,
            "importance": int(importance) if importance else 2,
            "description_courte": str(desc_courte).strip(),
            "description_longue": str(desc_longue).strip(),
            "sources": parse_sources(sources),
        }

        if rid in nodes_by_id:
            nodes_by_id[rid].update(node)
            updated += 1
        else:
            nodes_by_id[rid] = node
            added += 1

        all_valid_ids.add(rid)
        pending_relations.append((relations, rid))

    # Traiter les relations maintenant que tous les nouveaux IDs sont connus
    for raw_relations, rid in pending_relations:
        for edge in parse_relations(raw_relations, rid):
            if edge["t"] not in all_valid_ids:
                print(f"  ⚠️  Relation ignorée : cible '{edge['t']}' inconnue (depuis '{rid}')")
                continue
            key = (edge["s"], edge["t"], edge["type"])
            if key not in existing_edges:
                new_edges.append(edge)
                existing_edges.add(key)

    data["nodes"] = list(nodes_by_id.values())
    data["edges"].extend(new_edges)

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print()
    print("=== Résumé ===")
    print(f"  Nodes ajoutés      : {added}")
    print(f"  Nodes mis à jour   : {updated}")
    print(f"  Nouvelles relations: {len(new_edges)}")
    print(f"  Lignes non 'Fait'  : {skipped_not_done}")
    print(f"  Lignes incomplètes : {skipped_incomplete}")
    print(f"  Total nodes finaux : {len(data['nodes'])}")
    print(f"  Total edges finaux : {len(data['edges'])}")
    print()
    print(f"✅ {JSON_PATH} mis à jour.")


if __name__ == "__main__":
    main()
