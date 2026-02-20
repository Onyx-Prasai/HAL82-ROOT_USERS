#!/usr/bin/env bash
# Dev setup for Unix-like shells (run from repository root)
# Usage:
#   cd backend
#   ./dev_setup.sh

set -euo pipefail

if [ ! -d "venv" ]; then
  echo "Creating virtualenv..."
  python3 -m venv venv
fi

echo "Activating virtualenv..."
. venv/bin/activate

echo "Upgrading pip and installing requirements..."
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "Making migrations and applying..."
python manage.py makemigrations core
python manage.py migrate

echo "Running seed_data to populate demo users, groups and points..."
python manage.py seed_data

echo "Done. You can create a superuser or run the development server:"
echo "  python manage.py createsuperuser"
echo "  python manage.py runserver"
