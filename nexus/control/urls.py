from django.urls import path

from control import views

urlpatterns = [
    path('home/', views.home, name="home"),
]