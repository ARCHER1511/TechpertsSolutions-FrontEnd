# PowerShell script to fix all git conflicts by accepting incoming changes
Write-Host "Fixing all git conflicts by accepting incoming changes..." -ForegroundColor Green

# Find all files with conflict markers
$conflictFiles = Get-ChildItem -Path "src" -Recurse -File | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match "<<<<<<< HEAD"
}

Write-Host "Found $($conflictFiles.Count) files with conflicts" -ForegroundColor Yellow

foreach ($file in $conflictFiles) {
    Write-Host "Fixing conflicts in: $($file.FullName)" -ForegroundColor Cyan
    
    # Read file content
    $content = Get-Content $file.FullName -Raw
    
    # Remove all conflict markers and keep incoming changes (after =======)
    $fixedContent = $content -replace '<<<<<<< HEAD.*?=======\s*', '' -replace '>>>>>>> [a-f0-9]+\s*', ''
    
    # Write fixed content back
    Set-Content -Path $file.FullName -Value $fixedContent -NoNewline
}

Write-Host "All conflicts resolved!" -ForegroundColor Green 