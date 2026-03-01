from rest_framework import serializers
from .models import Ticket
from bookings.serializers import BookingSerializer

class TicketSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)
    passenger_name = serializers.ReadOnlyField()
    bus_title = serializers.ReadOnlyField()
    route = serializers.ReadOnlyField()
    travel_date = serializers.ReadOnlyField()
    departure_time = serializers.ReadOnlyField()
    seat_count = serializers.ReadOnlyField()
    total_paid = serializers.ReadOnlyField()
    
    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ('id', 'ticket_number', 'generated_at')
