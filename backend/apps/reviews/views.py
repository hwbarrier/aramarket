from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer
class ReviewListCreateAPI(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    def get_permissions(self):
        return [permissions.AllowAny()] if self.request.method == 'GET' else [permissions.IsAuthenticated()]
    def get_queryset(self):
        queryset = Review.objects.all()
        target_type = self.request.query_params.get('target_type')
        target_id = self.request.query_params.get('target_id')
        if target_type: queryset = queryset.filter(target_type=target_type)
        if target_id: queryset = queryset.filter(target_id=target_id)
        return queryset
