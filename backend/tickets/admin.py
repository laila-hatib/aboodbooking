from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'booking', 'passenger_name', 'bus_title', 'travel_date', 'is_printed', 'generated_at')
    list_filter = ('is_printed', 'generated_at', 'booking__travel_date')
    search_fields = ('ticket_number', 'booking__booking_reference', 'booking__passenger__email', 'booking__passenger__first_name', 'booking__passenger__last_name')
    ordering = ('-generated_at',)
    readonly_fields = ('ticket_number', 'generated_at')
    
    fieldsets = (
        (None, {'fields': ('ticket_number', 'booking')}),
        ('File', {'fields': ('pdf_file',)}),
        ('Status', {'fields': ('is_printed',)}),
        ('Timestamps', {'fields': ('generated_at',)}),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('booking',)
        return self.readonly_fields
