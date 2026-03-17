from django.shortcuts import render, redirect, get_object_or_404
from control.forms import control_form, SensorForm

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

from .models import control, SensorData


def home(request):
    return render(request, "home.html")


def update(request):
    data = get_object_or_404(control_form, id=id)

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

    data = {
        "relay": "hello"
    }

    print(data)
    return JsonResponse(data)