#!/usr/bin/env bash
# Create the PRIVATE repo `ethio-h` and push this project to it.
#
#   1. Make a fine-grained token at github.com/settings/tokens?type=beta
#      Repository access: All repositories
#      Permissions: Administration → Read and write   (plus Contents → Read and write)
#   2. Run:  GH_TOKEN=github_pat_xxx GH_USER=your-username ./setup-github.sh
#
set -euo pipefail

: "${GH_TOKEN:?set GH_TOKEN to a GitHub token with Administration + Contents write}"
: "${GH_USER:?set GH_USER to your GitHub username}"
REPO="${REPO:-ethio-h}"

echo "→ creating private repo $GH_USER/$REPO"
curl -sS -o /tmp/gh.json -w '%{http_code}' \
  -X POST https://api.github.com/user/repos \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d "{\"name\":\"$REPO\",\"private\":true,\"description\":\"Ethio H — cleaning service site\",\"has_issues\":true,\"has_wiki\":false}" \
  | grep -qE '^(200|201)$' || { echo "GitHub said:"; cat /tmp/gh.json; exit 1; }

echo "→ pushing main"
git remote remove origin 2>/dev/null || true
git remote add origin "https://x-access-token:$GH_TOKEN@github.com/$GH_USER/$REPO.git"
git push -u origin main
git remote set-url origin "https://github.com/$GH_USER/$REPO.git"   # drop the token from .git/config

echo "✓ https://github.com/$GH_USER/$REPO  (private)"
