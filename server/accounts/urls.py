from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    HealthzView,
    LogoutView,
    MeView,
    OAuthProviderListView,
    OAuthProviderLoginView,
    OAuthProviderCallbackProxyView,
    OAuthRedirectView,
)

urlpatterns = [
    path("auth/providers/", OAuthProviderListView.as_view(), name="api-auth-providers"),
    path("auth/<str:provider>/login/", OAuthProviderLoginView.as_view(), name="api-auth-provider-login"),
    path(
        "auth/<str:provider>/callback/",
        OAuthProviderCallbackProxyView.as_view(),
        name="api-auth-provider-callback",
    ),
    path("auth/social/redirect/", OAuthRedirectView.as_view(), name="api-auth-social-redirect"),
    path("auth/me/", MeView.as_view(), name="api-auth-me"),
    path("auth/logout/", LogoutView.as_view(), name="api-auth-logout"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="api-auth-token-refresh"),
    path("healthz/", HealthzView.as_view(), name="api-healthz"),
]
