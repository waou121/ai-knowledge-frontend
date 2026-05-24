$ruleName = "Vite Dev Server 5173"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

if ($existing) {
  Write-Host "Firewall rule already exists: $ruleName"
} else {
  New-NetFirewallRule `
    -DisplayName $ruleName `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 5173 `
    -Profile Private,Domain
  Write-Host "Firewall rule added: $ruleName"
}

Write-Host ""
Write-Host "Network URL: http://10.130.223.6:5173/"
Read-Host "Press Enter to close"
