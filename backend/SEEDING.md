# Seeding and Development Users

This repository includes a management command to seed development data so collaborators can work with the same users and credentials.

Location
- Seeder: `backend/core/management/commands/seed_data.py`

How to run
1. Activate your virtualenv in the `backend` folder:

```powershell
.\\venv\\Scripts\\activate
```

2. Run migrations and seed:

```powershell
python manage.py migrate
python manage.py seed_data
```

What it creates
- Multiple seeded users (founders, experts, investors) with populated profile fields including `province`, `phone_number`, `role`, `persona`, `bio` and `startup_stage`.
- Expert profiles are created under `core.models.ExpertProfile` for expert users.
- Syndicates and KPI snapshots for demo data.
- Admin user `admin` with password `adminpass123` (development only).
- Superuser `peepal` with password `1234` (development only).

Common seeded credentials (case-sensitive):
- `peepal` / `1234`  (superuser)
- `admin` / `adminpass123` (superuser)
- Sample users: `anish_dev`, `sita_design`, `dev_dorje` — password: `pass123`

Notes
- The seeder uses `update_or_create` and `set_password()` to ensure passwords are hashed and the command is idempotent.
- These credentials are for local development only. Remove or change these accounts before publishing or deploying to production.

Groups & Points
- The seeder now creates three helpful Groups for development to manage permissions from the admin UI:
	- `Points Managers`: add/change/view `Points` records
	- `User Details`: view/change `User` records
	- `All Details`: combined development-level permissions for example core models
- A small `Points` model is included (attach points to users). After running migrations and `seed_data` you will see sample `Points` records in the admin.

- New profile models:
	- `FounderProfile`: company_name, founded_date, team_size, traction, website
	- `InvestorProfile`: firm_name, investment_stage, available_capital, focus_areas
	These are populated by the seeder for created founders and investors.

If you'd prefer fixtures instead of running the seeder, I can add a JSON fixture (`loaddata`) as an alternative.
