from django.shortcuts import render, redirect, get_object_or_404
from control.forms import control_form, SensorForm

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

from .models import control, SensorData, Garage


def home(request):
    return render(request, "dashboard/index.html")


# def update(request):
#     data = control.objects.first()

#     if(request.method == 'POST'):
#         form = control_form(request.POST, instance=data)
#         if(form.is_valid()):
#             form.save()
#             return redirect("home")
#     else:
#         form = control_form(instance=data)
#     return render(request, "update.html", {"form": form})



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

    if not gar:
        return JsonResponse({"error": "No garage data"})

    data = {
        "is_light": gar.is_light,
        "is_exhaust": gar.is_exhaust,
        "is_garage_open": gar.is_garage_open,
        "is_garage_close": gar.is_garage_close,
        "garage_delay": gar.garage_delay or 2
    }

    return JsonResponse(data)

@csrf_exempt
def update_control(request):
    if request.method == "POST":
        data = json.loads(request.body)

        gar = Garage.objects.first()

        if not gar:
            return JsonResponse({"error": "No garage data"})

        # Normal updates
        gar.is_light = data.get("is_light", gar.is_light)
        gar.is_exhaust = data.get("is_exhaust", gar.is_exhaust)

        # 🚪 GARAGE OPEN
        if data.get("is_garage_open"):
            gar.is_garage_open = True
            gar.is_garage_close = False
            gar.is_light = True 
        else:
            gar.is_garage_open = False

        # 🚪 GARAGE CLOSE
        if data.get("is_garage_close"):
            gar.is_garage_close = True
            gar.is_garage_open = False
            gar.is_light = False 
        else:
            gar.is_garage_close = False

        gar.save()

        return JsonResponse({"status": "updated"})

    return JsonResponse({"error": "POST required"})

@require_GET
def get_latest_sensor(request):
    latest = SensorData.objects.last()

    if not latest:
        return JsonResponse({"value": 0})

    return JsonResponse({
        "value": latest.air_quality
    })