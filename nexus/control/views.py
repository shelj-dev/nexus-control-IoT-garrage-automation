from django.shortcuts import render, redirect, get_object_or_404
from control.forms import control_form

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


# def 




