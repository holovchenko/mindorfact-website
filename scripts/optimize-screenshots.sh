#!/usr/bin/env bash
# Generate .webp variants for hero screenshots in public/screenshots/.
# Re-run after replacing or adding any solo-quiz-*.png.
#
# Requires: cwebp (brew install webp).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DIR="${ROOT}/public/screenshots"
QUALITY="${WEBP_QUALITY:-80}"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "error: cwebp not installed. Run 'brew install webp'." >&2
  exit 1
fi

shopt -s nullglob
count=0
for png in "${DIR}"/solo-quiz-*.png; do
  webp="${png%.png}.webp"
  cwebp -quiet -q "${QUALITY}" "${png}" -o "${webp}"
  png_kb=$(( $(stat -f%z "${png}") / 1024 ))
  webp_kb=$(( $(stat -f%z "${webp}") / 1024 ))
  printf '  %-40s %5d KB  ->  %5d KB  (-%2d%%)\n' \
    "$(basename "${png}")" "${png_kb}" "${webp_kb}" \
    "$(( 100 - (webp_kb * 100 / png_kb) ))"
  count=$(( count + 1 ))
done

echo "regenerated ${count} webp file(s) at quality=${QUALITY}"
