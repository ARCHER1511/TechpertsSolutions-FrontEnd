# Improved PowerShell script to fix all git conflicts by accepting incoming changes
Write-Host "Fixing all git conflicts by accepting incoming changes..." -ForegroundColor Green

# Find all files with conflict markers
$conflictFiles = Get-ChildItem -Path "src" -Recurse -File | Where-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    $content -and $content -match "<<<<<<< HEAD"
}

Write-Host "Found $($conflictFiles.Count) files with conflicts" -ForegroundColor Yellow

foreach ($file in $conflictFiles) {
    Write-Host "Fixing conflicts in: $($file.Name)" -ForegroundColor Cyan
    
    try {
        # Read file content
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # More comprehensive conflict resolution
        # Remove everything between <<<<<<< HEAD and =======
        $step1 = $content -replace '<<<<<<< HEAD[\s\S]*?=======\s*', ''
        
        # Remove the >>>>>>> commit-hash line
        $step2 = $step1 -replace '>>>>>>> [a-f0-9]+\s*', ''
        
        # Write fixed content back
        Set-Content -Path $file.FullName -Value $step2 -Encoding UTF8 -NoNewline
        
        Write-Host "  Fixed" -ForegroundColor Green
    }
    catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "All conflicts resolved!" -ForegroundColor Green 