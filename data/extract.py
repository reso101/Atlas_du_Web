import re
import json
import os

script_path = "script.js"
output_path = "data/atlas.json"

with open(script_path, "r", encoding="utf-8") as f:
    content = f.read()

# Helper to find matching bracket matching
def get_array_content(content, start_token):
    start_idx = content.find(start_token)
    if start_idx == -1:
        raise ValueError(f"Token {start_token} not found")
    
    array_start = start_idx + len(start_token) - 1 # starts at '['
    bracket_count = 0
    current_idx = array_start
    while current_idx < len(content):
        char = content[current_idx]
        if char == '[':
            bracket_count += 1
        elif char == ']':
            bracket_count -= 1
            if bracket_count == 0:
                break
        current_idx += 1
    
    return content[array_start:current_idx + 1]

# Convert JS array/object syntax to standard JSON
def js_to_json(js_str):
    js_str = re.sub(r'//.*?\n', '\n', js_str)
    js_str = re.sub(r'/\*.*?\*/', '', js_str, flags=re.DOTALL)
    
    keys = ["id", "nom", "annee", "categorie", "importance", "description_courte", "description_longue", "sources",
            "titre", "type", "probabilite", "horizon", "signal_nodes", "signal_types", "description", "statut", "date_prediction"]
    
    for key in keys:
        js_str = re.sub(r'\b' + key + r'\s*:', f'"{key}":', js_str)
        
    js_str = re.sub(r"'([^']*)'", r'"\1"', js_str)
    js_str = re.sub(r',\s*\]', ']', js_str)
    js_str = re.sub(r',\s*\}', '}', js_str)
    
    return json.loads(js_str)

try:
    nodes = js_to_json(get_array_content(content, "const NODES = ["))
    edges_raw = js_to_json(get_array_content(content, "const EDGES = ["))
    edges = [{"s": item[0], "t": item[1], "type": item[2]} for item in edges_raw]
    prospective = js_to_json(get_array_content(content, "const PROSPECTIVE = ["))

    output_data = {
        "nodes": nodes,
        "edges": edges,
        "prospective": prospective
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"Success! Extracted {len(nodes)} nodes, {len(edges)} edges, {len(prospective)} prospective.")
except Exception as e:
    print("Error:", e)
    import sys
    sys.exit(1)
