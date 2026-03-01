from rest_framework import serializers
from .models import Bus

class BusSerializer(serializers.ModelSerializer):
    route_display = serializers.CharField(source='get_route_display', read_only=True)
    travel_days_display = serializers.CharField(source='get_travel_days_display', read_only=True)
    seats_booked = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Bus
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class BusCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def validate(self, attrs):
        total_seats = attrs.get('total_seats')
        available_seats = attrs.get('available_seats')
        
        if available_seats > total_seats:
            raise serializers.ValidationError("Available seats cannot be more than total seats.")
        
        return attrs
