from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'passenger', 'bus', 'travel_date', 'seats_booked', 'total_price', 'payment_status', 'ticket_generated', 'created_at')
    list_filter = ('payment_status', 'ticket_generated', 'travel_date', 'created_at')
    search_fields = ('booking_reference', 'passenger__email', 'passenger__first_name', 'passenger__last_name', 'bus__title')
    ordering = ('-created_at',)
    readonly_fields = ('booking_reference', 'total_price', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('booking_reference', 'passenger')}),
        ('Booking Details', {'fields': ('bus', 'travel_date', 'seats_booked')}),
        ('Payment', {'fields': ('total_price', 'payment_status')}),
        ('Status', {'fields': ('ticket_generated',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('bus', 'travel_date', 'seats_booked')
        return self.readonly_fields
