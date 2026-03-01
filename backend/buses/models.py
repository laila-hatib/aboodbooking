from django.db import models

class Bus(models.Model):
    ROUTE_CHOICES = [
        ('dar_morogoro', 'Dar es Salaam → Morogoro'),
        ('morogoro_dar', 'Morogoro → Dar es Salaam'),
    ]
    
    TRAVEL_DAYS_CHOICES = [
        ('daily', 'Daily'),
        ('weekdays', 'Weekdays'),
        ('weekends', 'Weekends'),
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='bus_images/', blank=True, null=True)
    route = models.CharField(max_length=20, choices=ROUTE_CHOICES)
    total_seats = models.PositiveIntegerField()
    available_seats = models.PositiveIntegerField()
    travel_days = models.CharField(max_length=10, choices=TRAVEL_DAYS_CHOICES, default='daily')
    departure_time = models.TimeField()
    price_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.get_route_display()}"
    
    @property
    def seats_booked(self):
        return self.total_seats - self.available_seats
    
    @property
    def is_available(self):
        return self.available_seats > 0 and self.is_active
    
    def update_available_seats(self, seats_booked):
        """Update available seats when booking is made"""
        if seats_booked <= self.available_seats:
            self.available_seats -= seats_booked
            self.save()
            return True
        return False
    
    def operates_on_date(self, date):
        """Check if bus operates on the given date"""
        from datetime import datetime
        
        if self.travel_days == 'daily':
            return True
        elif self.travel_days == 'weekdays':
            return date.weekday() < 5  # Monday=0, Friday=4
        elif self.travel_days == 'weekends':
            return date.weekday() >= 5  # Saturday=5, Sunday=6
        else:
            # Check specific day
            day_mapping = {
                'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
                'friday': 4, 'saturday': 5, 'sunday': 6
            }
            return date.weekday() == day_mapping.get(self.travel_days, -1)
