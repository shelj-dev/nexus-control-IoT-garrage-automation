from django.contrib import admin
from control.models import control, SensorData, Garage


admin.site.register(control)
admin.site.register(SensorData)
admin.site.register(Garage)