from rest_framework import serializers
from .models import Booking
from buses.serializers import BusSerializer
from accounts.serializers import UserProfileSerializer

class BookingSerializer(serializers.ModelSerializer):
    passenger_details = UserProfileSerializer(source='passenger', read_only=True)
    bus_details = BusSerializer(source='bus', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    is_paid = serializers.ReadOnlyField()
    is_pending = serializers.ReadOnlyField()
    is_cancelled = serializers.ReadOnlyField()
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id', 'booking_reference', 'total_price', 'created_at', 'updated_at')

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('bus', 'travel_date', 'seats_booked')
    
    def validate(self, attrs):
        bus = attrs.get('bus')
        travel_date = attrs.get('travel_date')
        seats_booked = attrs.get('seats_booked')
        
        # Check if bus is available
        if not bus.is_available:
            raise serializers.ValidationError("Bus is not available for booking.")
        
        # Check if bus operates on the travel date
        if not bus.operates_on_date(travel_date):
            raise serializers.ValidationError(f"Bus does not operate on {travel_date}.")
        
        # Check if enough seats are available
        if seats_booked > bus.available_seats:
            raise serializers.ValidationError(f"Only {bus.available_seats} seats available.")
        
        # Check if travel date is in the future
        from django.utils import timezone
        if travel_date < timezone.now().date():
            raise serializers.ValidationError("Travel date cannot be in the past.")
        
        return attrs
    
    def create(self, validated_data):
        user = self.context['request'].user
        bus = validated_data['bus']
        seats_booked = validated_data['seats_booked']
        
        # Create booking
        booking = Booking.objects.create(
            passenger=user,
            bus=bus,
            travel_date=validated_data['travel_date'],
            seats_booked=seats_booked,
            total_price=bus.price_per_seat * seats_booked,
            payment_status='paid'  # Auto-mark as paid for demo
        )
        
        # Update bus available seats
        bus.update_available_seats(seats_booked)
        
        # Generate ticket automatically
        from tickets.models import Ticket
        ticket, created = Ticket.objects.get_or_create(booking=booking)
        
        # Mark ticket as generated
        if not booking.ticket_generated:
            booking.ticket_generated = True
            booking.save()
        
        return booking
