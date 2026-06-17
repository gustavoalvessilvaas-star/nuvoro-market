$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$workspaceRoot = Split-Path -Parent (Split-Path -Parent $repoRoot)
$nodeDir = Join-Path $workspaceRoot "work\tools\node-v20.19.3-win-x64"

if (-not (Test-Path (Join-Path $nodeDir "node.exe"))) {
  Write-Host "Portable Node was not found at $nodeDir"
  Write-Host "Install Node.js 20 LTS from https://nodejs.org or ask Codex to download the portable runtime again."
  exit 1
}

$env:PATH = "$nodeDir;$env:PATH"
Set-Location $repoRoot

if (-not (Test-Path "node_modules")) {
  npm install --no-audit --no-fund
}

npm run dev
