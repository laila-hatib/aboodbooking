from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.utils import timezone
from datetime import datetime
from .models import Bus
from .serializers import BusSerializer, BusCreateSerializer

class IsAdminUser(BasePermission):
    """Custom permission to only allow admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def bus_list(request):
    """Get all active buses"""
    buses = Bus.objects.filter(is_active=True)
    serializer = BusSerializer(buses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def bus_detail(request, pk):
    """Get bus details"""
    try:
        bus = Bus.objects.get(pk=pk, is_active=True)
        serializer = BusSerializer(bus)
        return Response(serializer.data)
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def bus_create(request):
    """Create new bus (admin only)"""
    serializer = BusCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def bus_update(request, pk):
    """Update bus (admin only)"""
    try:
        bus = Bus.objects.get(pk=pk)
        serializer = BusCreateSerializer(bus, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def bus_delete(request, pk):
    """Delete bus (admin only)"""
    try:
        bus = Bus.objects.get(pk=pk)
        bus.is_active = False
        bus.save()
        return Response({'message': 'Bus deactivated successfully'}, status=status.HTTP_200_OK)
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_buses(request):
    """Search buses by route and date"""
    route = request.query_params.get('route')
    travel_date = request.query_params.get('travel_date')
    
    if not route or not travel_date:
        return Response({'error': 'Route and travel_date are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        travel_date_obj = datetime.strptime(travel_date, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Filter buses by route and availability
    buses = Bus.objects.filter(route=route, is_active=True, available_seats__gt=0)
    
    # Check if bus operates on the travel date
    available_buses = []
    for bus in buses:
        if bus.operates_on_date(travel_date_obj):
            available_buses.append(bus)
    
    serializer = BusSerializer(available_buses, many=True)
    return Response(serializer.data)
