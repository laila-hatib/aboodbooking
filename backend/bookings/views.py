from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.contrib.auth import get_user_model
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer
from buses.models import Bus

User = get_user_model()

class IsAdminUser(BasePermission):
    """Custom permission to only allow admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    """Create a new booking"""
    serializer = BookingCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        booking = serializer.save()
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    """Get current user's bookings"""
    bookings = Booking.objects.filter(passenger=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_detail(request, pk):
    """Get booking details"""
    try:
        if request.user.is_admin:
            booking = Booking.objects.get(pk=pk)
        else:
            booking = Booking.objects.get(pk=pk, passenger=request.user)
        
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request, pk):
    """Confirm payment for booking (admin only)"""
    if not request.user.is_admin:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        booking = Booking.objects.get(pk=pk)
        if booking.payment_status == 'paid':
            return Response({'message': 'Payment already confirmed'}, status=status.HTTP_200_OK)
        
        booking.payment_status = 'paid'
        booking.save()
        
        # Generate ticket
        from tickets.models import Ticket
        ticket, created = Ticket.objects.get_or_create(booking=booking)
        
        return Response({
            'message': 'Payment confirmed successfully',
            'booking': BookingSerializer(booking).data
        }, status=status.HTTP_200_OK)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, pk):
    """Cancel a booking"""
    try:
        if request.user.is_admin:
            booking = Booking.objects.get(pk=pk)
        else:
            booking = Booking.objects.get(pk=pk, passenger=request.user)
        
        if booking.payment_status == 'paid':
            return Response({'error': 'Cannot cancel paid booking'}, status=status.HTTP_400_BAD_REQUEST)
        
        if booking.payment_status == 'cancelled':
            return Response({'message': 'Booking already cancelled'}, status=status.HTTP_200_OK)
        
        # Refund seats to bus
        bus = booking.bus
        bus.available_seats += booking.seats_booked
        bus.save()
        
        # Cancel booking
        booking.payment_status = 'cancelled'
        booking.save()
        
        return Response({'message': 'Booking cancelled successfully'}, status=status.HTTP_200_OK)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_bookings(request):
    """Get all bookings (admin only)"""
    bookings = Booking.objects.all()
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)
