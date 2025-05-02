# Windows Server Installation Script
Write-Host "PCI Vendor Management System - Windows Server Installation" -ForegroundColor Green

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
$nodeVersion = node -v 2>$null
if (-not $nodeVersion) {
    Write-Host "Node.js not found. Installing Node.js..." -ForegroundColor Yellow
    $nodeInstaller = "node-installer.msi"
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v14.21.3/node-v14.21.3-x64.msi" -OutFile $nodeInstaller
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $nodeInstaller /quiet" -Wait
    Remove-Item $nodeInstaller
    Write-Host "Node.js installed successfully" -ForegroundColor Green
}

# Check if MongoDB is installed
$mongodbService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if (-not $mongodbService) {
    Write-Host "MongoDB not found. Installing MongoDB..." -ForegroundColor Yellow
    $mongodbInstaller = "mongodb-installer.msi"
    Invoke-WebRequest -Uri "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.24-signed.msi" -OutFile $mongodbInstaller
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $mongodbInstaller /quiet" -Wait
    Remove-Item $mongodbInstaller
    Write-Host "MongoDB installed successfully" -ForegroundColor Green
}

# Create necessary directories
New-Item -ItemType Directory -Force -Path "public\uploads" | Out-Null

# Install npm dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
MONGODB_URI=mongodb://localhost:27017/pci_vendors
PORT=3000
JWT_SECRET=$(New-Guid)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "Please update the .env file with your email credentials" -ForegroundColor Yellow
}

# Start MongoDB service
Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
Start-Service -Name "MongoDB"

# Start the application
Write-Host "Starting the application..." -ForegroundColor Yellow
npm start

Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "The application is now running at http://localhost:3000" -ForegroundColor Green 