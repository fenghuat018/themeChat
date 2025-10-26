from django.apps import AppConfig
from django.conf import settings


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):  # pragma: no cover - startup side effect
        self._ensure_social_apps()

    def _ensure_social_apps(self):
        providers = getattr(settings, "SOCIALACCOUNT_PROVIDERS", {})
        site_id = getattr(settings, "SITE_ID", None)
        if not providers or not site_id:
            return

        try:
            from allauth.socialaccount.models import SocialApp
            from django.contrib.sites.models import Site
            from django.db.utils import OperationalError, ProgrammingError
        except ImportError:
            return

        try:
            site = Site.objects.get(pk=site_id)
        except (Site.DoesNotExist, OperationalError, ProgrammingError):
            return

        for provider_id, provider_config in providers.items():
            app_config = (provider_config or {}).get("APP") or {}
            client_id = app_config.get("client_id")
            secret = app_config.get("secret")
            if not client_id or not secret:
                continue

            defaults = {
                "name": app_config.get("name") or provider_id.title(),
                "client_id": client_id,
                "secret": secret,
                "key": app_config.get("key", ""),
            }

            try:
                social_app, _ = SocialApp.objects.update_or_create(
                    provider=provider_id,
                    defaults=defaults,
                )
            except (OperationalError, ProgrammingError):
                continue

            # Ensure this provider is only configured once per site.
            SocialApp.objects.filter(provider=provider_id).exclude(id=social_app.id).delete()
            social_app.sites.set([site])
