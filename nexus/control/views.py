from django.shortcuts import render, redirect, get_object_or_404
from control.forms import control_form, SensorForm

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

from .models import control, SensorData, Garage


def home(request):
    return render(request, "home.html")


def update(request):
    data = control.objects.first()

    if(request.method == 'POST'):
        form = control_form(request.POST, instance=data)
        if(form.is_valid()):
            form.save()
            return redirect("home")
    else:
        form = control_form(instance=data)
    return render(request, "update.html", {"form": form})



@csrf_exempt
def get_sensor_data(request):

    if request.method == "POST":
        data = json.loads(request.body)

        value = data.get("sensor")
        print("Sensor value:", value)

        SensorData.objects.create(air_quality=value)

        return JsonResponse({
            "status": "received",
            "sensor": value
        })

    return JsonResponse({"error": "POST required"})


@require_GET
def send_sensor_data(request):
    gar = Garage.objects.first()

    data = {
        "is_garage": gar.is_garage, 
        "garage_delay": gar.garage_delay, 
        "is_light": gar.is_light, 
        "is_exhaust": gar.is_exhaust
    }

    print(data)
    return JsonResponse(data)