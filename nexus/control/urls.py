from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    # path('update/', views.update, name='update'),

    # API endpoints
    # PICO
    path('api/get-sensor/', views.get_sensor_data),
    path('api/send-relay/', views.send_sensor_data),
    # Django
    path('api/update-control/', views.update_control),
    path('api/get-latest-sensor/', views.get_latest_sensor),
]