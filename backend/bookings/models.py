from django.db import models
from django.contrib.auth import get_user_model
from buses.models import Bus
import uuid

User = get_user_model()

class Booking(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    booking_reference = models.CharField(max_length=12, unique=True, editable=False)
    passenger = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='bookings')
    travel_date = models.DateField()
    seats_booked = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    ticket_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Booking {self.booking_reference} - {self.passenger.email}"
    
    def save(self, *args, **kwargs):
        if not self.booking_reference:
            # Generate unique booking reference
            self.booking_reference = self.generate_booking_reference()
        
        # Calculate total price if not set
        if not self.total_price and self.bus and self.seats_booked:
            self.total_price = self.bus.price_per_seat * self.seats_booked
        
        super().save(*args, **kwargs)
    
    def generate_booking_reference(self):
        """Generate unique booking reference"""
        while True:
            ref = f"AB{uuid.uuid4().hex[:8].upper()}"
            if not Booking.objects.filter(booking_reference=ref).exists():
                return ref
    
    @property
    def is_paid(self):
        return self.payment_status == 'paid'
    
    @property
    def is_pending(self):
        return self.payment_status == 'pending'
    
    @property
    def is_cancelled(self):
        return self.payment_status == 'cancelled'
