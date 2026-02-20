from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from .models import KPISnapshot, Syndicate, ExpertProfile
from .serializers import KPISnapshotSerializer, SyndicateSerializer, ExpertProfileSerializer
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from rest_framework.views import APIView
from django.db.models import Q

User = get_user_model()

class GlobalStatsView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        total_users = User.objects.count()
        total_founders = User.objects.filter(role='FOUNDER').count()
        total_investors = User.objects.filter(role='INVESTOR').count()
        
        stats = {
            'total_startups': total_founders + 42,
            'total_investment': f"{total_investors * 0.5 + 2.5:.1f}M",
            'active_matches': total_users * 2 + 15,
            'hotspots': [
                {'province': 1, 'activity': 12},
                {'province': 2, 'activity': 8},
                {'province': 3, 'activity': 45},
                {'province': 4, 'activity': 22},
                {'province': 5, 'activity': 15},
                {'province': 6, 'activity': 5},
                {'province': 7, 'activity': 10},
            ]
        }
        return Response(stats)

class KPISnapshotViewSet(viewsets.ModelViewSet):
    serializer_class = KPISnapshotSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return KPISnapshot.objects.filter(user=self.request.user)

class SyndicateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Syndicate.objects.filter(is_active=True)
    serializer_class = SyndicateSerializer
    permission_classes = (permissions.IsAuthenticated,)

class ExpertProfileViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExpertProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = ExpertProfile.objects.all()
        
        # Filter by interest tags if provided
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            # Filter profiles where the user has at least one matching tag
            queryset = queryset.filter(user__interest_tags__overlap=tag_list) if hasattr(queryset.query, 'overlap') else queryset
            # For SQLite compatibility, we'll do a more flexible approach
            filtered_profiles = []
            for profile in queryset:
                if any(tag in profile.user.interest_tags for tag in tag_list):
                    filtered_profiles.append(profile.id)
            queryset = queryset.filter(id__in=filtered_profiles)
        
        # Search by keyword (name, specialization, bio, tags)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search) |
                Q(specialization__icontains=search) |
                Q(bio__icontains=search)
            )
            # Additional filtering for tags matching search
            search_lower = search.lower()
            filtered_profiles = []
            for profile in queryset:
                if any(search_lower in tag.lower() for tag in profile.user.interest_tags):
                    if profile.id not in filtered_profiles:
                        filtered_profiles.append(profile.id)
            if filtered_profiles:
                # Combine with existing queryset
                queryset = queryset.filter(
                    Q(user__username__icontains=search) |
                    Q(specialization__icontains=search) |
                    Q(bio__icontains=search) |
                    Q(id__in=filtered_profiles)
                )
        
        return queryset

class SmartStatuteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, syndicate_id):
        try:
            syndicate = Syndicate.objects.get(id=syndicate_id)
        except Syndicate.DoesNotExist:
            return Response({'error': 'Syndicate not found'}, status=404)

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        
        p.setFont("Helvetica-Bold", 24)
        p.drawString(100, 750, f"SANGAM: Smart-Statute")
        
        p.setFont("Helvetica", 12)
        p.drawString(100, 720, f"Syndicate: {syndicate.title}")
        p.drawString(100, 700, f"Lead Founder: {syndicate.founder.username}")
        p.drawString(100, 680, f"Funding Goal: ${syndicate.funding_goal}")
        
        p.drawString(100, 640, "Standardized Terms:")
        terms = [
            "1. Fractional commitment model applies.",
            "2. Lead founder maintains operational control.",
            "3. Investors receive quarterly pulse updates via SANGAM.",
            "4. Dispute resolution via Nepal Chamber of Commerce."
        ]
        y = 620
        for term in terms:
            p.drawString(120, y, term)
            y -= 20
            
        p.showPage()
        p.save()

        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
