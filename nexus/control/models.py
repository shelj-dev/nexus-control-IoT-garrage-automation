from django.db import models

# Create your models here.
class control(models.Model):
    op_delay = models.IntegerField()
    threshold = models.IntegerField()


class SensorData(models.Model):
    air_quality = models.IntegerField()
    