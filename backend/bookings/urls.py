from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_booking, name='create_booking'),
    path('my/', views.my_bookings, name='my_bookings'),
    path('<int:pk>/', views.booking_detail, name='booking_detail'),
    path('<int:pk>/confirm-payment/', views.confirm_payment, name='confirm_payment'),
    path('<int:pk>/cancel/', views.cancel_booking, name='cancel_booking'),
    path('all/', views.all_bookings, name='all_bookings'),
]
