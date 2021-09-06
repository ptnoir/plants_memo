import json
from django.http.response import JsonResponse
from django.shortcuts import render
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.forms import ModelForm, DateInput, NumberInput, IntegerField
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.validators import MaxValueValidator, MinValueValidator


from .models import User, Plant, Fertilizing, Repotting

class PlantForm(ModelForm):
    class Meta:
        model = Plant
        fields=['common_name', 'scientific_name', 'category', 'info', 'image', 'watering_period', 'last_watered',]
        widgets = {
            'last_watered': DateInput(attrs={'type': 'date'}),
            # 'watering_period': NumberInput(attrs={'min', 1}),
        }
        help_texts = {'watering_period': " (days)", }

    def __init__(self, *args, **kwargs):
        super(PlantForm, self).__init__(*args, **kwargs)
       
        self.fields["watering_period"].widget.attrs['min'] = 1




class FertilizingForm(ModelForm):
    class Meta:
        model = Fertilizing
        fields = ['fertilizer', 'period', 'last_fertilized']
        widgets = {
            'last_fertilized': DateInput(attrs={'type': 'date'}),
            'period': NumberInput(attrs={'min': 1})
        }
        labels = {
            'period': "Period (days): "
        }
        # help_texts = {'period': " (days)", }
        


    def __init__(self, *args, **kwargs):
        super(FertilizingForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control form-control-sm my-form-control'
        

class RepottingForm(ModelForm):
    class Meta:
        model = Repotting
        fields = ['period', 'last_repotted']
        widgets = {
            'period': NumberInput(attrs={'id': 'r_period', 'min': 1 }),
          
            'last_repotted': DateInput(attrs={'type': 'date'})
        }
        labels = {
            'period': "Period (years): "
        }
        # help_texts = {'period': " (years)", }

    def __init__(self, *args, **kwargs):
        super(RepottingForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control form-control-sm my-form-control'




# Create your views here.
@login_required
def index(request):
    plants = Plant.objects.filter(owner=request.user)
    return render(request, "plants/index.html", {
        'plants': plants
    })

@login_required
def add_plant(request):
    if request.method == "POST":
        form = PlantForm(request.POST, request.FILES)
        if form.is_valid():
            new_plant = form.save(commit=False)
            new_plant.owner = request.user
            new_plant.save()
            return HttpResponseRedirect(reverse("index"))
    else:
        form = PlantForm()

    return render(request, "plants/plant_form.html", {
        'form': form
    })


@login_required
def edit_plant_form(request, plant_id):
    plant = Plant.objects.get(pk=plant_id)
    
    if request.method == "POST":
        form = PlantForm(request.POST, request.FILES, instance=plant)
        if form.is_valid():
            plant = form.save()
            return HttpResponseRedirect(reverse("plant", args=(plant.id,)))
    else:
        form = PlantForm(instance=plant)

    return render(request, "plants/plant_form.html", {
        'form': form,
        'edit': 'to_edit',
        'plant_id': plant_id,
    })



@login_required
def plant(request, plant_id):
    try:
        plant = Plant.objects.get(pk=plant_id)
    except Plant.DoesNotExist:
        return JsonResponse({
            "error": "Plant not found."
        }, status=404)

    f = Fertilizing.objects.filter(plant=plant_id).first()
    r = Repotting.objects.filter(plant=plant_id).first()

    return render(request, "plants/plant.html", {
        'plant': plant,
        'f': f,
        'r': r,
    })




def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "plants/login.html", {
                "message": "Invalid username and/or password."
            })

    return render(request, "plants/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, 'plants/register.html', {
                'message': "Passwords must match."
            })

        # Attempt to create new user
        try: 
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, 'plants/register.html', {
                'message': "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse('index'))

    return render(request, "plants/register.html")


#################################################################
# api functions 
@csrf_exempt
@login_required
def update_plant(request, plant_id):
    try:
        plant = Plant.objects.get(pk=plant_id)
    except Plant.DoesNotExist:
        return JsonResponse(
            {"error": "Plant not found."}, status=404)
    
    if request.user.id != plant.owner.id:
        return JsonResponse(
            {"error": "Not authorized."}, status=401
        )
    
    if request.method != 'PUT':
        return JsonResponse(
            {"error": "PUT method required."}, status=400
        )
    
    else:
        data = json.loads(request.body)
        
        field_names = [f.name for f in Plant._meta.get_fields(
            include_parents=False)]
        field_names.remove("id")
        field_names.remove("owner")
        for fieldname in field_names:
            if data.get(fieldname) is not None:
                
                # print("fieldname:", fieldname)
                # print("date[fieldname]:", data[fieldname])
                # print(type(data[fieldname]))

                setattr(plant, fieldname, data[fieldname])
        
        plant.save()
        return JsonResponse(plant.serialize())
        
# api - delete   
@csrf_exempt
@login_required
def delete_plant(request, plant_id):
    try:
        plant = Plant.objects.get(pk=plant_id)
    except Plant.DoesNotExist:
        return JsonResponse(
            {"error": "Plant not found."}, status=404)
    
    if request.user.id != plant.owner.id:
        return JsonResponse(
            {"error": "Not authorized."}, status=401
        )
    
    if request.method != 'DELETE':
        return JsonResponse(
            {"error": "DELETE method required."}, status=400
        )
    
    else:
        plant.delete()
        return HttpResponse(status=204)
    


# api CRUD fertilizing

@csrf_exempt
@login_required
def create_fertilizing(request, plant_id):
    try:
        plant = Plant.objects.get(pk=plant_id)
    except Plant.DoesNotExist:
        return JsonResponse(
            {"error": "Plant not found."}, status=404)
    if plant.owner.id != request.user.id:
        return JsonResponse(
            {"error": "Not authorized."}, status=401
        )
    f_form = FertilizingForm()

    if request.method == "POST":

        data = json.loads(request.body)
        print("data", data)
        # get content of fertilizing
        fertilizer = data.get("fertilizer", "")
        period = data.get("period", "")
        last_fertilized = data.get("last_fertilized", "")

        print("fertilizer", fertilizer, type(fertilizer))
        print("period", period, type(period))
        print("last_fertilized", last_fertilized, type(last_fertilized))

        f = Fertilizing(
            plant = plant,
            fertilizer = fertilizer,
            period = period,
            last_fertilized = last_fertilized
        )
        f.save()
        return JsonResponse(f.serialize())

    return JsonResponse(f_form.as_p(), safe=False)


@csrf_exempt
@login_required
def fertilizing(request, plant_id):
    # PUT - to update
    # DELETE 
    # GET - return f infos 
    try:
        plant = Plant.objects.get(pk=plant_id)
    except Plant.DoesNotExist:
        return JsonResponse(
            {"error": "Plant not found."}, status=404)
    if plant.owner.id != request.user.id:
        return JsonResponse(
            {"error": "Not authorized."}, status=401
        )

    else:
        try:
            f = Fertilizing.objects.get(plant=plant_id)
        except Fertilizing.DoesNotExist:
            return JsonResponse(
                {"error": "Fertilizing not found."}, status=404)

        if request.method == "GET":
            # return f_form to render edit form
            f_form = FertilizingForm(instance=f)
            # print("f_form", f_form)
            return JsonResponse(f_form.as_p(), safe=False)
    

        if request.method == "DELETE":
            f.delete()
            return HttpResponse(status=204)
        
        if request.method == "PUT":
            data = json.loads(request.body)
            if data.get("fertilizer") is not None:
                f.fertilizer = data["fertilizer"]
            if data.get("period") is not None:
                f.period = data["period"]
            if data.get("last_fertilized") is not None:
                f.last_fertilized = data["last_fertilized"]

            f.save()
            return JsonResponse(f.serialize())


# api CRUD repotting

@csrf_exempt
@login_required
def create_repotting(request, plant_id):
    try:
        plant = Plant.objects.get(pk=plant_id)
    except Plant.DoesNotExist:
        return JsonResponse(
            {"error": "Plant not found."}, status=404)
    if plant.owner.id != request.user.id:
        return JsonResponse(
            {"error": "Not authorized."}, status=401
        )
    r_form = RepottingForm()

    if request.method == "POST":

        data = json.loads(request.body)
        print("data", data)
        # get content of repotting
        period = data.get("period", "")
        last_repotted = data.get("last_repotted", "")

        r = Repotting(
            plant=plant,
            period=period,
            last_repotted=last_repotted
        )
        r.save()
        return JsonResponse(r.serialize())

    return JsonResponse(r_form.as_p(), safe=False)


@csrf_exempt
@login_required
def repotting(request, plant_id):

    try:
        plant = Plant.objects.get(pk=plant_id)
    except Plant.DoesNotExist:
        return JsonResponse(
            {"error": "Plant not found."}, status=404)
    if plant.owner.id != request.user.id:
        return JsonResponse(
            {"error": "Not authorized."}, status=401
        )

    else:
        try:
            r = Repotting.objects.get(plant=plant_id)
        except Repotting.DoesNotExist:
            return JsonResponse(
                {"error": "Repotting not found."}, status=404)

        if request.method == "GET":
            # return r_form to render edit form
            r_form = RepottingForm(instance=r)
            # print("r_form", r_form)
            return JsonResponse(r_form.as_p(), safe=False)

        if request.method == "DELETE":
            r.delete()
            return HttpResponse(status=204)

        if request.method == "PUT":
            data = json.loads(request.body)
            if data.get("period") is not None:
                r.period = data["period"]
            if data.get("last_repotted") is not None:
                r.last_repotted = data["last_repotted"]

            r.save()
            return JsonResponse(r.serialize())
