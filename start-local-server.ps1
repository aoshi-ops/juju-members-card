$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$BundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$Node = if (Test-Path $BundledNode) { $BundledNode } else { "node" }

Set-Location -LiteralPath $Root
Write-Host "Starting JUJU members local server..."
Write-Host "Working directory: $Root"
Write-Host "Node: $Node"
Write-Host ""
& $Node server.js
