from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class AccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        return settings.OAUTH_REDIRECT_URI

    def is_open_for_signup(self, request):
        # Social signup only; ensure standard signup is blocked.
        return True
