param(
  [Parameter(Position = 0)]
  [string]$Message = "atualização: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$insideRepo = git rev-parse --is-inside-work-tree 2>$null
if ($insideRepo -ne 'true') {
  Write-Error 'Este script precisa ser executado dentro de um repositório git.'
}

$branch = git rev-parse --abbrev-ref HEAD

function Get-SiteHost {
  $cnamePath = Join-Path $repoRoot 'CNAME'
  if (Test-Path $cnamePath) {
    $siteHost = (Get-Content -LiteralPath $cnamePath -Raw).Trim()
    if ($siteHost) {
      return $siteHost.Trim('/')
    }
  }
  return 'www.lgplacasautomotivasitajuba.com.br'
}

function Get-SitemapUrls {
  $sitemapPath = Join-Path $repoRoot 'sitemap.xml'
  if (-not (Test-Path $sitemapPath)) {
    return @()
  }

  try {
    [xml]$xml = Get-Content -LiteralPath $sitemapPath -Raw
    $nodes = $xml.SelectNodes("//*[local-name()='loc']")
    $urls = @()
    foreach ($n in $nodes) {
      $u = $n.InnerText.Trim()
      if ($u) { $urls += $u }
    }
    return $urls | Select-Object -Unique
  }
  catch {
    Write-Warning "Não foi possível ler sitemap.xml: $($_.Exception.Message)"
    return @()
  }
}

function Submit-IndexNow {
  $key = 'a7d1a2cf4e664c75b8d395f8d5d14d88'
  $keyFile = Join-Path $repoRoot "$key.txt"
  if (-not (Test-Path $keyFile)) {
    Write-Warning "Arquivo de chave IndexNow nao encontrado: $keyFile"
    return
  }

  $siteHost = Get-SiteHost
  $urls = @(Get-SitemapUrls)
  if ($urls.Count -eq 0) {
    $urls = @("https://$siteHost/")
  }

  $payload = @{
    host        = $siteHost
    key         = $key
    keyLocation = "https://$siteHost/$key.txt"
    urlList     = $urls
  } | ConvertTo-Json -Depth 5

  try {
    Invoke-RestMethod -Method Post -Uri 'https://api.indexnow.org/indexnow' -ContentType 'application/json' -Body $payload | Out-Null
    Write-Host "IndexNow enviado com $($urls.Count) URL(s)."
  }
  catch {
    Write-Warning "Falha ao enviar IndexNow: $($_.Exception.Message)"
  }
}

# Inclui arquivos novos, modificados e removidos.
git add -A

$hasChanges = (git diff --cached --name-only).Length -gt 0
if (-not $hasChanges) {
  Write-Host 'Nenhuma alteração para publicar.'
  exit 0
}

git commit -m $Message
git push origin $branch
Submit-IndexNow

Write-Host "Publicado com sucesso na branch '$branch'."
