#!/usr/bin/env bash
# Print the resume PDFs into public/ from the A4 print pages (src/pages/resume/print.astro and its French twin).
# Uses the swiss-print-docs kit: its pinned WeasyPrint and its TTF fonts. Run it after changing the resume, then commit
# the PDFs.
set -euo pipefail

command -v swiss-doc >/dev/null || {
	echo "resume-pdf: swiss-doc not found on PATH (see the swiss-print-docs README)" >&2
	exit 1
}
KIT_DIR="$(cd "$(dirname "$(readlink -f "$(command -v swiss-doc)")")/.." && pwd)"
readonly KIT_DIR

cd "$(dirname "$0")/.."
npx astro build >/dev/null

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
fonts="$tmp/fonts.css"
face() { # family weight style file
	printf "@font-face { font-family: '%s'; font-weight: %s; font-style: %s; src: url('file://%s/fonts/%s'); }\n" \
		"$1" "$2" "$3" "$KIT_DIR" "$4" >>"$fonts"
}
face 'Archivo' 900 normal archivo-latin-900-normal.ttf
face 'Atkinson Hyperlegible Next' 400 normal atkinson-hyperlegible-next-latin-400-normal.ttf
face 'Atkinson Hyperlegible Next' 600 normal atkinson-hyperlegible-next-latin-600-normal.ttf
face 'JetBrains Mono' 400 normal jetbrains-mono-latin-400-normal.ttf

for prefix in "" "fr/"; do
	out="public/${prefix}resume/raphael-lemaitre.pdf"
	mkdir -p "$(dirname "$out")"
	mise exec --cd "$KIT_DIR" -- weasyprint --stylesheet "$fonts" \
		"$PWD/dist/${prefix}resume/print/index.html" "$PWD/$out"
	echo "$out"
done
