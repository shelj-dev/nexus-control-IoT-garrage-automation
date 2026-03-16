from django import forms
from control.models import control

class control_form(forms.ModelForm):
    class Meta:
        model = control
        fields = ['threshold', 'op_delay']