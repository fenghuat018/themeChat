from urllib.parse import urlencode

from allauth.socialaccount.models import SocialApp
from allauth.socialaccount.providers import registry
from django.conf import settings
from django.contrib.auth import logout as django_logout
from django.db.utils import OperationalError, ProgrammingError
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect
from django.urls import NoReverseMatch, reverse
from django.utils import timezone
from django.views import View
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserPublicSerializer


def _provider_active(provider_id: str) -> bool:
    try:
        SocialApp.objects.get(provider=provider_id, sites=settings.SITE_ID)
        return True
    except SocialApp.DoesNotExist:
        return False
    except (OperationalError, ProgrammingError):
        return False


class OAuthProviderListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        providers = []
        for provider_cls in registry.get_class_list():
            provider_id = provider_cls.id
            if not _provider_active(provider_id):
                continue
            login_url = request.build_absolute_uri(
                reverse("api-auth-provider-login", args=[provider_id])
            )
            providers.append(
                {
                    "id": provider_id,
                    "name": provider_cls.name,
                    "login_url": login_url,
                }
            )
        return Response({"providers": providers})


class OAuthProviderLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, provider: str):
        if not _provider_active(provider):
            return Response(
                {"detail": "OAuth provider not configured."},
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            login_url = reverse("socialaccount_login", kwargs={"provider": provider})
        except NoReverseMatch:
            try:
                login_url = reverse(f"{provider}_login")
            except NoReverseMatch:
                return Response(
                    {"detail": "Unsupported provider."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        params = {"process": "login"}
        next_url = request.query_params.get("next") or settings.OAUTH_REDIRECT_URI
        if next_url:
            params["next"] = next_url
        redirect_url = f"{login_url}?{urlencode(params)}"
        return redirect(redirect_url)


class OAuthProviderCallbackProxyView(View):
    def get(self, request, provider: str, *args, **kwargs):
        if not _provider_active(provider):
            return HttpResponseBadRequest("Provider not configured.")
        try:
            callback_url = reverse(f"{provider}_callback")
        except NoReverseMatch:
            return HttpResponseBadRequest("Unsupported provider callback.")

        query_string = request.META.get("QUERY_STRING", "")
        target = f"{callback_url}?{query_string}" if query_string else callback_url
        return redirect(target)


class OAuthRedirectView(View):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            error_url = f"{settings.OAUTH_FRONTEND_CALLBACK}?error=unauthorized"
            return redirect(error_url)

        refresh = RefreshToken.for_user(request.user)
        access_token = refresh.access_token

        query = urlencode(
            {
                "access": str(access_token),
                "refresh": str(refresh),
                "issued": int(timezone.now().timestamp()),
            }
        )
        redirect_url = f"{settings.OAUTH_FRONTEND_CALLBACK}?{query}"

        response = redirect(redirect_url)
        if settings.DEBUG:
            # Helpful for local development; production should rely on secure storage client-side.
            response.set_cookie(
                "refresh_token",
                str(refresh),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=int(refresh.lifetime.total_seconds()),
            )

        django_logout(request)
        return response


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserPublicSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token_value = request.data.get("refresh")
        if not refresh_token_value:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token_value)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        django_logout(request)
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie("refresh_token")
        return response


class HealthzView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, _request):
        return Response({"status": "ok"})
