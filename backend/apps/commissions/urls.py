from django.urls import path
from .views import CommissionListAPI, CommissionTotalsAPI
urlpatterns = [path('totals/', CommissionTotalsAPI.as_view()), path('', CommissionListAPI.as_view())]
