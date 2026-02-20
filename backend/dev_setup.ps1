# Dev setup for Windows PowerShell (run from repository root)
# Usage: Open PowerShell, then:
#    cd <repo-root>\backend
#    ./dev_setup.ps1

param()

$ErrorActionPreference = 'Stop'

# Create venv if missing
if (-not (Test-Path -Path ".\venv")) {
    Write-Host "Creating virtualenv..."
    python -m venv .\venv
}

Write-Host "Activating virtualenv..."
.\venv\Scripts\Activate.ps1

Write-Host "Upgrading pip and installing requirements..."
python -m pip install --upgrade pip
pip install -r requirements.txt

Write-Host "Making migrations and applying..."
python manage.py makemigrations core
python manage.py migrate

Write-Host "Running seed_data to populate demo users, groups and points..."
python manage.py seed_data

Write-Host "Done. You can create a superuser or run the development server:"
Write-Host "  python manage.py createsuperuser"
Write-Host "  python manage.py runserver"
