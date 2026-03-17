from django import forms
from control.models import control, SensorData

class control_form(forms.ModelForm):
    class Meta:
        model = control
        fields = ['threshold', 'op_delay']


class SensorForm(forms.ModelForm):
    class Meta:
        model = SensorData
        fields = ["air_quality"]