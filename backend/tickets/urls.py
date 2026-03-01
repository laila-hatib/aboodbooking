from django.urls import path
from . import views

urlpatterns = [
    path('my/', views.my_tickets, name='my_tickets'),
    path('<int:pk>/', views.ticket_detail, name='ticket_detail'),
    path('<int:pk>/download/', views.download_ticket_pdf, name='download_ticket_pdf'),
    path('all/', views.all_tickets, name='all_tickets'),
]
