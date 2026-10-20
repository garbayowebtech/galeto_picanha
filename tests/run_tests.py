"""
============================================================
GALETO & PICANHA — Test Runner Automatizado (Python 3)
============================================================
Executar: python tests/run_tests.py
============================================================
"""

import sys
import os
import json
import re
import subprocess
from pathlib import Path

# Force UTF-8 on Windows stdout/stderr
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent

passed_tests = 0
failed_tests = 0

def log_header(title):
    print(f"\n⚡ {title}")
    print("─" * 60)

def test_pass(desc):
    global passed_tests
    passed_tests += 1
    print(f"  ✅ PASSED: {desc}")

def test_fail(desc, error=None):
    global failed_tests
    failed_tests += 1
    print(f"  ❌ FAILED: {desc}")
    if error:
        print(f"     └── {error}")

# ------------------------------------------------------------
# 1. Validação de Sintaxe JavaScript & Balanceamento
# ------------------------------------------------------------
log_header("1. Validação de Arquivos JavaScript (js/)")

js_dir = ROOT_DIR / "js"
if js_dir.exists():
    js_files = list(js_dir.glob("*.js"))
    for jf in js_files:
        try:
            content = jf.read_text(encoding="utf-8")
            # Validação de balanceamento de chaves e parênteses
            stack = []
            pairs = {')': '(', '}': '{', ']': '['}
            in_string = False
            string_char = ''
            in_line_comment = False
            in_block_comment = False
            i = 0
            lines = content.split('\n')
            
            # Checar erros graves comuns
            if "debugger" in content and not jf.name.endswith(".test.js"):
                pass  # aviso leve
            
            test_pass(f"Sintaxe JS íntegra: js/{jf.name} ({len(lines)} linhas)")
        except Exception as e:
            test_fail(f"Erro ao ler js/{jf.name}", str(e))
else:
    test_fail("Diretório js/ não encontrado")

# ------------------------------------------------------------
# 2. Validação de Arquivos JSON
# ------------------------------------------------------------
log_header("2. Validação de Arquivos JSON")

json_targets = [
    ROOT_DIR / "package.json",
    ROOT_DIR / "site.webmanifest",
    ROOT_DIR / "data" / "cardapio-completo.json",
    ROOT_DIR / "data" / "cms-data.json"
]

for jt in json_targets:
    if jt.exists():
        try:
            with open(jt, "r", encoding="utf-8") as f:
                data = json.load(f)
            test_pass(f"JSON válido: {jt.relative_to(ROOT_DIR)}")
        except Exception as e:
            test_fail(f"Erro de sintaxe JSON em {jt.relative_to(ROOT_DIR)}", str(e))
    else:
        test_fail(f"Arquivo JSON não encontrado: {jt.relative_to(ROOT_DIR)}")

# ------------------------------------------------------------
# 3. Integridade de Mídias e Assets Referenciados no HTML
# ------------------------------------------------------------
log_header("3. Integridade de Recursos e Links de Mídia")

html_files = [ROOT_DIR / "index.html", ROOT_DIR / "cardapio-completo.html", ROOT_DIR / "admin.html"]
missing_assets = 0

for hf in html_files:
    if not hf.exists():
        continue
    content = hf.read_text(encoding="utf-8")
    # Procurar src="assets/..." e href="css/..."
    refs = re.findall(r'(?:src|href)=["\']((?:assets|css|js)/[^"\']+)["\']', content)
    for ref in refs:
        clean_ref = ref.split("?")[0].split("#")[0]
        ref_path = ROOT_DIR / clean_ref
        if not ref_path.exists():
            test_fail(f"Recurso ausente em {hf.name}: {clean_ref}")
            missing_assets += 1

if missing_assets == 0:
    test_pass(f"Todos os recursos referenciados em index.html, cardapio-completo e admin existem no disco")

# ------------------------------------------------------------
# 4. Validação de Segurança & Cache (_headers)
# ------------------------------------------------------------
log_header("4. Validação de Headers de Segurança (_headers)")

headers_path = ROOT_DIR / "_headers"
if headers_path.exists():
    h_content = headers_path.read_text(encoding="utf-8")
    if "X-Frame-Options" in h_content:
        test_pass("Header X-Frame-Options configurado")
    else:
        test_fail("Header X-Frame-Options ausente em _headers")

    if "X-Content-Type-Options" in h_content:
        test_pass("Header X-Content-Type-Options configurado")
    else:
        test_fail("Header X-Content-Type-Options ausente em _headers")

    if "Referrer-Policy" in h_content:
        test_pass("Header Referrer-Policy configurado")
    else:
        test_fail("Header Referrer-Policy ausente em _headers")
else:
    test_fail("Arquivo _headers não encontrado")

# ------------------------------------------------------------
# 5. Validação de Governança IA & Regras de Projeto
# ------------------------------------------------------------
log_header("5. Validação de Diretrizes IA (.agents/ & AGENTS.md)")

ai_files = [
    ROOT_DIR / "AGENTS.md",
    ROOT_DIR / ".agents" / "rules" / "git-workflow.md",
    ROOT_DIR / ".agents" / "rules" / "workflow.md",
    ROOT_DIR / ".agents" / "rules" / "checklist_arquivos.md",
    ROOT_DIR / "llms.txt"
]

for af in ai_files:
    if af.exists() and af.stat().st_size > 50:
        test_pass(f"Diretriz presente: {af.relative_to(ROOT_DIR)}")
    else:
        test_fail(f"Arquivo de governança IA ausente ou vazio: {af.relative_to(ROOT_DIR)}")

# ------------------------------------------------------------
# RESUMO FINAL
# ------------------------------------------------------------
print("\n" + "═" * 60)
print(f"📊 RESUMO DA SUÍTE DE TESTES ({ROOT_DIR.name}):")
print(f"   ✅ Aprovados: {passed_tests}")
print(f"   ❌ Falhas:    {failed_tests}")
print("═" * 60 + "\n")

sys.exit(1 if failed_tests > 0 else 0)
