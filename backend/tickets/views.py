from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
import tempfile
import os
from .models import Ticket
from .serializers import TicketSerializer
from bookings.models import Booking

class IsAdminUser(BasePermission):
    """Custom permission to only allow admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_tickets(request):
    """Get current user's tickets"""
    tickets = Ticket.objects.filter(booking__passenger=request.user)
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ticket_detail(request, pk):
    """Get ticket details"""
    try:
        if request.user.is_admin:
            ticket = Ticket.objects.get(pk=pk)
        else:
            ticket = Ticket.objects.get(pk=pk, booking__passenger=request.user)
        
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)
    except Ticket.DoesNotExist:
        return Response({'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_ticket_pdf(request, pk):
    """Download ticket as PDF"""
    try:
        if request.user.is_admin:
            ticket = Ticket.objects.get(pk=pk)
        else:
            ticket = Ticket.objects.get(pk=pk, booking__passenger=request.user)
        
        # Generate PDF directly
        pdf_content = generate_ticket_pdf(ticket)
        
        # Return PDF file as response
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="ticket_{ticket.ticket_number}.pdf"'
        return response
    
    except Ticket.DoesNotExist:
        return Response({'error': 'Ticket not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'PDF generation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def generate_ticket_pdf(ticket):
    """Generate PDF for ticket"""
    from django.conf import settings
    import os
    
    # HTML template for ticket
    html_content = render_to_string('tickets/ticket_template.html', {
        'ticket': ticket,
        'passenger_name': ticket.passenger_name,
        'bus_title': ticket.bus_title,
        'route': ticket.route,
        'travel_date': ticket.travel_date,
        'departure_time': ticket.departure_time,
        'seat_count': ticket.seat_count,
        'total_paid': ticket.total_paid,
        'booking_reference': ticket.booking.booking_reference,
    })
    
    # Generate PDF
    html = HTML(string=html_content)
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
        html.write_pdf(tmp_file.name)
        
        # Read file content
        with open(tmp_file.name, 'rb') as f:
            pdf_content = f.read()
        
        # Clean up temporary file
        os.unlink(tmp_file.name)
        
        return pdf_content

@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_tickets(request):
    """Get all tickets (admin only)"""
    tickets = Ticket.objects.all()
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data)
