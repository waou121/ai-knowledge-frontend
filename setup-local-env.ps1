$apiKey = Read-Host "Enter LLM API Key"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
  Write-Host "No API Key entered. Canceled."
  exit 1
}

$baseUrlInput = Read-Host "Enter API Base URL, press Enter for https://api.deepseek.com"
$modelInput = Read-Host "Enter model name, press Enter for deepseek-chat"

if ([string]::IsNullOrWhiteSpace($baseUrlInput)) {
  $baseUrl = "https://api.deepseek.com"
} else {
  $baseUrl = $baseUrlInput.Trim()
}

if ([string]::IsNullOrWhiteSpace($modelInput)) {
  $model = "deepseek-chat"
} else {
  $model = $modelInput.Trim()
}

$serverEnv = @(
  "LLM_API_KEY=$apiKey",
  "LLM_BASE_URL=$baseUrl",
  "LLM_MODEL=$model",
  "LLM_PROXY_PORT=8787"
)

$clientEnv = @(
  "VITE_USE_MOCK=false",
  "VITE_API_BASE_URL=http://127.0.0.1:8787/api"
)

$serverEnv | Set-Content -LiteralPath ".env" -Encoding UTF8
$clientEnv | Set-Content -LiteralPath ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "Created local .env and .env.local."
Write-Host "These files are ignored by git. Do not commit them."
Write-Host ""
Write-Host "Next, start two terminals:"
Write-Host "npm run server"
Write-Host "npm run dev"
