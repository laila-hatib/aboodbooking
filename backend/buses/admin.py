from django.contrib import admin
from .models import Bus

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('title', 'route', 'total_seats', 'available_seats', 'departure_time', 'price_per_seat', 'is_active', 'created_at')
    list_filter = ('route', 'travel_days', 'is_active', 'created_at')
    search_fields = ('title', 'route')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('title', 'image')}),
        ('Route Information', {'fields': ('route', 'travel_days', 'departure_time')}),
        ('Seat Information', {'fields': ('total_seats', 'available_seats')}),
        ('Pricing', {'fields': ('price_per_seat',)}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
