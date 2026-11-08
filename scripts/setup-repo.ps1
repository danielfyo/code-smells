<#
.SYNOPSIS
  Applies the repository settings that cannot be stored in files: description and topics, merge
  strategy, security features, Actions token permissions, and rulesets protecting main and release tags.

.DESCRIPTION
  Requirements: GitHub CLI (https://cli.github.com) authenticated as a repository admin (`gh auth login`).
  The script is idempotent: run it again at any time to re-apply the settings.

.EXAMPLE
  .\scripts\setup-repo.ps1
  .\scripts\setup-repo.ps1 -Repo danielfyo/code-smells
#>
param(
  [string]$Repo = 'danielfyo/code-smells'
)

$ErrorActionPreference = 'Stop'
$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = $Utf8NoBom

function Step([string]$Message) { Write-Host "`n==> $Message" -ForegroundColor Cyan }

# Sends a REST call through gh. The JSON body goes through a temporary UTF-8 (no BOM) file,
# which avoids quoting and encoding problems with Windows PowerShell pipes.
function Invoke-GitHub {
  param([string]$Method, [string]$Path, $Body = $null, [switch]$AllowFailure)
  $arguments = @('api', '--silent', '-X', $Method, '-H', 'Accept: application/vnd.github+json',
                 '-H', 'X-GitHub-Api-Version: 2022-11-28', $Path)
  $file = $null
  if ($null -ne $Body) {
    $file = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($file, ($Body | ConvertTo-Json -Depth 20), $Utf8NoBom)
    $arguments += @('--input', $file)
  }
  try {
    & gh @arguments
    if ($LASTEXITCODE -ne 0 -and -not $AllowFailure) { throw "gh api $Method $Path failed ($LASTEXITCODE)" }
    return ($LASTEXITCODE -eq 0)
  } finally {
    if ($file) { Remove-Item $file -ErrorAction SilentlyContinue }
  }
}

# Creates or updates a ruleset by name so the script can be re-run safely.
function Set-Ruleset([hashtable]$Ruleset) {
  $id = gh api "repos/$Repo/rulesets" --jq ".[] | select(.name == `"$($Ruleset.name)`") | .id"
  if ($id) { Invoke-GitHub PUT "repos/$Repo/rulesets/$id" $Ruleset | Out-Null }
  else     { Invoke-GitHub POST "repos/$Repo/rulesets" $Ruleset | Out-Null }
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw 'GitHub CLI (gh) is required: https://cli.github.com'
}
gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Run "gh auth login" first.' }

Step 'General settings and merge strategy'
Invoke-GitHub PATCH "repos/$Repo" @{
  description                 = 'A hands-on catalog of 176 code smells: explained, implemented smelly vs. refactored, and tested in Python, C#/.NET, React + TypeScript and Go.'
  has_wiki                    = $false
  has_projects                = $false
  allow_merge_commit          = $true
  allow_squash_merge          = $true
  allow_rebase_merge          = $false
  squash_merge_commit_title   = 'PR_TITLE'
  squash_merge_commit_message = 'PR_BODY'
  delete_branch_on_merge      = $true
  allow_update_branch         = $true
} | Out-Null

Step 'Topics'
Invoke-GitHub PUT "repos/$Repo/topics" @{
  names = @('code-smells', 'refactoring', 'clean-code', 'software-design', 'code-quality', 'best-practices',
            'anti-patterns', 'testing', 'python', 'csharp', 'dotnet', 'typescript', 'react', 'golang', 'education')
} | Out-Null

Step 'Security features'
Invoke-GitHub PUT "repos/$Repo/vulnerability-alerts" | Out-Null
Invoke-GitHub PUT "repos/$Repo/automated-security-fixes" | Out-Null
Invoke-GitHub PUT "repos/$Repo/private-vulnerability-reporting" | Out-Null
Invoke-GitHub PATCH "repos/$Repo" @{
  security_and_analysis = @{
    secret_scanning                 = @{ status = 'enabled' }
    secret_scanning_push_protection = @{ status = 'enabled' }
  }
} | Out-Null

Step 'GitHub Actions: read-only token by default, approval for outside contributors'
# "can_approve_pull_request_reviews" also lets Actions *create* pull requests, which release-please
# needs to open its release PR; approvals still require a code owner because of the ruleset below.
Invoke-GitHub PUT "repos/$Repo/actions/permissions/workflow" @{
  default_workflow_permissions     = 'read'
  can_approve_pull_request_reviews = $true
} | Out-Null
$ok = Invoke-GitHub PUT "repos/$Repo/actions/permissions/fork-pr-contributor-approval" @{
  approval_policy = 'all_external_contributors'
} -AllowFailure
if (-not $ok) { Write-Host '   (set it in Settings -> Actions -> General -> Fork pull request workflows)' }

Step 'Ruleset: protect main'
Set-Ruleset @{
  name        = 'Protect main'
  target      = 'branch'
  enforcement = 'active'
  conditions  = @{ ref_name = @{ include = @('~DEFAULT_BRANCH'); exclude = @() } }
  rules       = @(
    @{ type = 'deletion' },
    @{ type = 'non_fast_forward' },
    @{ type = 'required_signatures' },
    @{ type = 'pull_request'; parameters = @{
        required_approving_review_count   = 0
        require_code_owner_review         = $true
        dismiss_stale_reviews_on_push     = $true
        require_last_push_approval        = $false
        required_review_thread_resolution = $true
        allowed_merge_methods             = @('merge', 'squash') } },
    @{ type = 'required_status_checks'; parameters = @{
        strict_required_status_checks_policy = $false
        required_status_checks = @('catalog', 'python', 'csharp', 'react-ts', 'go', 'conventional-commits') |
          ForEach-Object { @{ context = $_ } } } },
    @{ type = 'code_scanning'; parameters = @{
        code_scanning_tools = @(@{ tool = 'CodeQL'; security_alerts_threshold = 'high_or_higher'; alerts_threshold = 'errors' }) } }
  )
  bypass_actors = @()
}

Step 'Ruleset: protect release tags'
Set-Ruleset @{
  name        = 'Protect release tags'
  target      = 'tag'
  enforcement = 'active'
  conditions  = @{ ref_name = @{ include = @('refs/tags/v*'); exclude = @() } }
  rules       = @(@{ type = 'deletion' }, @{ type = 'non_fast_forward' }, @{ type = 'update' })
  bypass_actors = @(@{ actor_id = 5; actor_type = 'RepositoryRole'; bypass_mode = 'always' })
}

Write-Host @'

Done. Two settings can only be changed in the web UI:
  1. Settings -> General -> Social preview: upload .github/assets/social-preview.png
  2. Settings -> Actions -> General -> "Allow actions": restrict to actions pinned to a full commit SHA
     (optional, every workflow in this repository already pins SHAs).
'@
