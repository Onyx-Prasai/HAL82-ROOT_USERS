"""
ASGI config for sangam project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sangam.settings')

from channels.routing import ProtocolTypeRouter, URLRouter
from core.chat_routing import websocket_urlpatterns
from core.middleware import JwtAuthMiddleware
from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
	"http": django_asgi_app,
	"websocket": JwtAuthMiddleware(URLRouter(websocket_urlpatterns)),
})
