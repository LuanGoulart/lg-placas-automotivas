param(
  [Parameter(Position = 0)]
  [string]$Message = "atualizacao: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$insideRepo = git rev-parse --is-inside-work-tree 2>$null
if ($insideRepo -ne 'true') {
  Write-Error 'Este script precisa ser executado dentro de um repositorio git.'
}

$branch = git rev-parse --abbrev-ref HEAD

# Inclui arquivos novos, modificados e removidos.
git add -A

$hasChanges = (git diff --cached --name-only).Length -gt 0
if (-not $hasChanges) {
  Write-Host 'Nenhuma alteracao para publicar.'
  exit 0
}

git commit -m $Message
git push origin $branch

Write-Host "Publicado com sucesso na branch '$branch'."
