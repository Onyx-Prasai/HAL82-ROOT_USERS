"""JWT auth middleware for WebSocket connections."""
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from jwt import decode as jwt_decode
from django.conf import settings

User = get_user_model()


class JwtAuthMiddleware:
    """Resolve user from JWT token in query string (token=xxx)."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]
        scope["user"] = await self.get_user(token)
        return await self.app(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        if not token:
            return None
        try:
            UntypedToken(token)
        except InvalidToken:
            return None
        try:
            payload = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(id=payload["user_id"])
            return user
        except (User.DoesNotExist, KeyError):
            return None
