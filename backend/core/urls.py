from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GlobalStatsView, KPISnapshotViewSet, SyndicateViewSet, ExpertProfileViewSet, SmartStatuteView
from core.chat_views import ChatHistoryView, MarkAsReadView, UnreadCountView

router = DefaultRouter()
router.register(r'snapshots', KPISnapshotViewSet, basename='snapshot')
router.register(r'syndicates', SyndicateViewSet, basename='syndicate')
router.register(r'experts', ExpertProfileViewSet, basename='expert')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', GlobalStatsView.as_view(), name='global_stats'),
    path('statutes/<int:syndicate_id>/', SmartStatuteView.as_view(), name='smart_statute'),
    path('chat/history/<int:receiver_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('chat/mark-as-read/<int:receiver_id>/', MarkAsReadView.as_view(), name='chat-mark-as-read'),
    path('chat/unread-count/', UnreadCountView.as_view(), name='chat-unread-count'),
]
