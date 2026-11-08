#!/usr/bin/env bash
# Applies the repository settings that cannot be stored in files: description and topics, merge
# strategy, security features, Actions token permissions, and rulesets protecting main and release tags.
#
# Requirements: GitHub CLI authenticated as a repository admin (`gh auth login`).
# Usage:        scripts/setup-repo.sh [owner/repo]        (default: danielfyo/code-smells)
# The script is idempotent: run it again at any time to re-apply the settings.
set -euo pipefail

REPO="${1:-danielfyo/code-smells}"
api() { gh api --silent -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" "$@"; }
step() { printf '\n==> %s\n' "$1"; }

command -v gh >/dev/null || { echo "GitHub CLI (gh) is required: https://cli.github.com" >&2; exit 1; }
gh auth status >/dev/null

step "General settings and merge strategy"
api -X PATCH "repos/$REPO" --input - <<'JSON'
{
  "description": "A hands-on catalog of 176 code smells: explained, implemented smelly vs. refactored, and tested in Python, C#/.NET, React + TypeScript and Go.",
  "has_wiki": false,
  "has_projects": false,
  "allow_merge_commit": true,
  "allow_squash_merge": true,
  "allow_rebase_merge": false,
  "squash_merge_commit_title": "PR_TITLE",
  "squash_merge_commit_message": "PR_BODY",
  "delete_branch_on_merge": true,
  "allow_update_branch": true,
  "web_commit_signoff_required": false
}
JSON

step "Topics"
api -X PUT "repos/$REPO/topics" --input - <<'JSON'
{ "names": ["code-smells", "refactoring", "clean-code", "software-design", "code-quality", "best-practices",
            "anti-patterns", "testing", "python", "csharp", "dotnet", "typescript", "react", "golang", "education"] }
JSON

step "Security features"
api -X PUT "repos/$REPO/vulnerability-alerts"
api -X PUT "repos/$REPO/automated-security-fixes"
api -X PUT "repos/$REPO/private-vulnerability-reporting"
api -X PATCH "repos/$REPO" --input - <<'JSON'
{ "security_and_analysis": {
    "secret_scanning": { "status": "enabled" },
    "secret_scanning_push_protection": { "status": "enabled" } } }
JSON

step "GitHub Actions: read-only token by default, approval for outside contributors"
# Workflows get a read-only token unless they ask for more. "can_approve_pull_request_reviews" also
# lets Actions *create* pull requests, which release-please needs to open its release PR; approvals
# still require a code owner because of the "Protect main" ruleset.
api -X PUT "repos/$REPO/actions/permissions/workflow" --input - <<'JSON'
{ "default_workflow_permissions": "read", "can_approve_pull_request_reviews": true }
JSON
api -X PUT "repos/$REPO/actions/permissions/fork-pr-contributor-approval" --input - <<'JSON' \
  || echo "   (fork approval policy endpoint not available; set it in Settings → Actions → General)"
{ "approval_policy": "all_external_contributors" }
JSON

# Creates or updates a ruleset by name so the script can be re-run safely.
upsert_ruleset() {
  local name="$1" payload="$2" id
  id="$(gh api "repos/$REPO/rulesets" --jq ".[] | select(.name == \"$name\") | .id" || true)"
  if [[ -n "$id" ]]; then
    api -X PUT "repos/$REPO/rulesets/$id" --input - <<<"$payload"
  else
    api -X POST "repos/$REPO/rulesets" --input - <<<"$payload"
  fi
}

step "Ruleset: protect main"
upsert_ruleset "Protect main" '{
  "name": "Protect main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_signatures" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "require_code_owner_review": true,
        "dismiss_stale_reviews_on_push": true,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true,
        "allowed_merge_methods": ["merge", "squash"] } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [
          { "context": "catalog" }, { "context": "python" }, { "context": "csharp" },
          { "context": "react-ts" }, { "context": "go" }, { "context": "conventional-commits" } ] } },
    { "type": "code_scanning", "parameters": {
        "code_scanning_tools": [
          { "tool": "CodeQL", "security_alerts_threshold": "high_or_higher", "alerts_threshold": "errors" } ] } }
  ],
  "bypass_actors": []
}'

step "Ruleset: protect release tags"
upsert_ruleset "Protect release tags" '{
  "name": "Protect release tags",
  "target": "tag",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["refs/tags/v*"], "exclude": [] } },
  "rules": [ { "type": "deletion" }, { "type": "non_fast_forward" }, { "type": "update" } ],
  "bypass_actors": [ { "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" } ]
}'

cat <<'TXT'

Done. Two settings can only be changed in the web UI:
  1. Settings → General → Social preview: upload .github/assets/social-preview.png
  2. Settings → Actions → General → "Allow actions": restrict to actions pinned to a full commit SHA
     (optional, every workflow in this repository already pins SHAs).
TXT
