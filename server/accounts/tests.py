from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialApp


class AuthAPITests(APITestCase):
    def setUp(self):
        site = Site.objects.get(pk=1)
        app, _ = SocialApp.objects.get_or_create(
            provider="google",
            name="Google",
            client_id="dummy",
            secret="dummysecret",
        )
        app.sites.add(site)
        self.user = User.objects.create_user(username="tester", email="tester@example.com")

    def _auth_headers(self, user):
        refresh = RefreshToken.for_user(user)
        jti = refresh.get("jti")
        return {
            "HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}",
        }, str(refresh), jti

    def test_healthz_endpoint(self):
        url = reverse("api-healthz")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get("status"), "ok")

    def test_me_requires_jwt(self):
        headers, _, _ = self._auth_headers(self.user)
        url = reverse("api-auth-me")
        response = self.client.get(url, **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["username"], "tester")

    def test_logout_blacklists_token(self):
        headers, refresh, jti = self._auth_headers(self.user)
        url = reverse("api-auth-logout")
        response = self.client.post(url, {"refresh": refresh}, format="json", **headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=jti).exists())

    def test_providers_endpoint_lists_configured_provider(self):
        url = reverse("api-auth-providers")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        providers = response.json().get("providers", [])
        self.assertTrue(any(p["id"] == "google" for p in providers))
