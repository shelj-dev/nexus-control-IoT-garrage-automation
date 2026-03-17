from django.db import models


class control(models.Model):
    op_delay = models.IntegerField()
    threshold = models.IntegerField()


class SensorData(models.Model):
    air_quality = models.IntegerField()
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)


class Garage(models.Model):
    is_garage = models.BooleanField()
    garage_delay = models.IntegerField(blank=True, null=True)
    is_light = models.BooleanField()
    is_exhaust = models.BooleanField()