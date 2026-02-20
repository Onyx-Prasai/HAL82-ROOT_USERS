from django.apps import AppConfig


class CoreConfig(AppConfig):
    name = 'core'

    def ready(self):
        # Automatically seed demo data after migrations in development.
        # This ensures seeded users have correct hashed passwords so
        # collaborators can log in immediately after `migrate`.
        try:
            from django.conf import settings
            if settings.DEBUG:
                from django.db.models.signals import post_migrate
                from django.core.management import call_command

                def _seed(sender, **kwargs):
                    try:
                        call_command('seed_data', verbosity=0)
                    except Exception:
                        # Don't block startup if seeding fails; log silently.
                        pass

                post_migrate.connect(_seed, dispatch_uid='core.seed_data')
        except Exception:
            # If imports fail outside Django runtime (e.g., linters), ignore.
            pass
