import sys
import openpyxl
import os
import subprocess

MASTER_PATH = "data/WEBCLAIR_definitions.xlsx"
JSON_PATH = "data/atlas.json"

def apply_batch(batch_data):
    if not os.path.exists(MASTER_PATH):
        print(f"Error: {MASTER_PATH} not found.")
        return False

    try:
        wb = openpyxl.load_workbook(MASTER_PATH)
        ws = wb["Définitions WEBCLAIR"]
    except PermissionError:
        print(f"⚠️ PERMISSION DENIED: {MASTER_PATH} is opened in Excel. Please close Excel.")
        return False
    except Exception as e:
        print(f"Error loading workbook: {e}")
        return False

    updated_count = 0
    for row in ws.iter_rows(min_row=2):
        rid = row[0].value
        if rid in batch_data:
            d = batch_data[rid]
            row[3].value = d.get('annee')
            row[4].value = d.get('importance', 2)
            row[5].value = "✅ Fait"
            row[6].value = d.get('desc_courte')
            row[7].value = d.get('desc_longue')
            row[8].value = d.get('sources')
            row[9].value = d.get('relations')
            updated_count += 1

    try:
        temp_path = "data/WEBCLAIR_definitions_tmp.xlsx"
        wb.save(temp_path)
        wb.close()
        os.replace(temp_path, MASTER_PATH)
        print(f"✅ Successfully updated {updated_count} definitions in {MASTER_PATH}")
        return True
    except PermissionError:
        print(f"⚠️ PERMISSION DENIED: Could not overwrite {MASTER_PATH}. Please close Excel.")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return False

if __name__ == "__main__":
    print("Helper script ready.")
