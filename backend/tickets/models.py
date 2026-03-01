from django.db import models
from django.contrib.auth import get_user_model
from bookings.models import Booking

User = get_user_model()

class Ticket(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='ticket')
    ticket_number = models.CharField(max_length=16, unique=True, editable=False)
    pdf_file = models.FileField(upload_to='tickets/pdf/', blank=True, null=True)
    is_printed = models.BooleanField(default=False)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"Ticket {self.ticket_number} - {self.booking.booking_reference}"
    
    def save(self, *args, **kwargs):
        if not self.ticket_number:
            self.ticket_number = self.generate_ticket_number()
        super().save(*args, **kwargs)
    
    def generate_ticket_number(self):
        """Generate unique ticket number"""
        import uuid
        return f"TK{uuid.uuid4().hex[:12].upper()}"
    
    @property
    def passenger_name(self):
        return f"{self.booking.passenger.first_name} {self.booking.passenger.last_name}"
    
    @property
    def bus_title(self):
        return self.booking.bus.title
    
    @property
    def route(self):
        return self.booking.bus.get_route_display()
    
    @property
    def travel_date(self):
        return self.booking.travel_date
    
    @property
    def departure_time(self):
        return self.booking.bus.departure_time
    
    @property
    def seat_count(self):
        return self.booking.seats_booked
    
    @property
    def total_paid(self):
        return self.booking.total_price
