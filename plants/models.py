from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime
from django.utils import timezone
from PIL import Image




# Create your models here.

class User(AbstractUser):
    def __str__(self):
        return self.username


plant_categories = (
    ('Cacti & Succulents', 'Cacti & Succulents'),
    ('Foliage', 'Foliage'),
    ('Flowering Plants', 'Flowering Plants'),
    ('Vegetables', 'Vegetables'),
    ('Herbs', 'Herbs'),
)


class Plant(models.Model):
    owner = models.ForeignKey(User, on_delete=models.SET_NULL,
                              null=True, related_name='user_plants', blank=True)
    common_name = models.CharField(max_length=100)
    scientific_name = models.CharField(max_length=100, blank=True, null=True)
    # category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='category_plants', blank=True)
    category = models.CharField(max_length=30, choices=plant_categories, blank=True, null=True)
    info = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="images/", default="default.jpeg")
    
    # watering_period = models.DurationField(default=datetime.timedelta(days=7))
    watering_period = models.IntegerField(
        default=7, validators=[MinValueValidator(1)])
    last_watered = models.DateField(default=timezone.now, validators=[
                                    MaxValueValidator(datetime.date.today)])

    
    # def last_watered(self):
    #     return self.plant_waterings.all().order_by('-date')[0].date

    def to_water(self):
        delta = datetime.timedelta(days=self.watering_period)
        tday = datetime.date.today()
        return delta + self.last_watered <= tday
    

    # fertilizing
    def has_f(self):
        return self.plant_fertilizings.get()

    def last_fertilized(self):
        if self.has_f:
            return self.plant_fertilizings.get().last_fertilized

    def to_fertilize(self):
        f = self.plant_fertilizings.get()
        delta = datetime.timedelta(days=f.period)
        tday = datetime.date.today()
        return delta + f.last_fertilized <= tday
    
    # repotting
    def has_r(self):
        return self.plant_repottings.get()

    def last_repotted(self):
        if self.has_r:
            return self.plant_repottings.get().last_repotted

    def to_repot(self):
        r = self.plant_repottings.get()
        delta = datetime.timedelta(days=r.period*365)
        tday = datetime.date.today()
        return delta + r.last_repotted <= tday




    def __str__(self):
        return self.common_name

    # def save(self):
    #     super().save()
    #     if self.image:
    #         img = Image.open(self.image.path)
    #         if img.height > 320 or img.width > 320:
    #             output_size = (320, 320)
    #             img.thumbnail(output_size)
    #             img.save(self.image.path) 

    def serialize(self):

        return {
            "id": self.id,
            "owner": self.owner.username,
            "common_name": self.common_name,
            "scientific_name": self.scientific_name,
            "category": self.category,
            "info": self.info,
            "image": self.image.url,
            "watering_period": self.watering_period,
            "last_watered": self.last_watered,

        }


# class Watering(models.Model):
#     # what is watering? - many date records to one plant

#     plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='plant_waterings')
#     date = models.DateField(auto_now_add=True)
#     # last_watered = models.DateTimeField(auto_now=True)

class Fertilizing(models.Model):
    # do not think of it as a record, but an activity
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='plant_fertilizings')
    fertilizer = models.CharField(
        default=None, max_length=100, null=True, blank=True)
    period = models.IntegerField(default=30, validators=[MinValueValidator(1)])
    # date = models.DateField()
    last_fertilized = models.DateField(default=timezone.now, validators=[
        MaxValueValidator(datetime.date.today)])



    def to_fertilize(self):
        delta = datetime.timedelta(days=self.period)
        tday = datetime.date.today()
        return delta + self.last_fertilized <= tday
    
    def serialize(self):
        # to_fertilize = self.to_fertilize()
        return {
            "plant": self.plant.id,
            "fertilizer": self.fertilizer,
            "period": self.period,
            "last_fertilized": self.last_fertilized,
            # "to_fertilize": to_fertilize,
        }

    def __str__(self):
        return f"fertilizing - {self.plant}"


class Repotting(models.Model):
    # do not think of it as a record, but an activity
    plant = models.ForeignKey(
        Plant, on_delete=models.CASCADE, related_name='plant_repottings')

    period = models.IntegerField(default=3, validators=[MinValueValidator(1)])
    # date = models.DateField()
    last_repotted = models.DateField(default=timezone.now, validators=[
        MaxValueValidator(datetime.date.today)])

    def to_repot(self):
        delta = datetime.timedelta(days=self.period*365)
        tday = datetime.date.today()
        return delta + self.last_repotted <= tday

    def serialize(self):
        return {
            "plant": self.plant.id,
            "period": self.period,
            "last_repotted": self.last_repotted,
         
        }

    def __str__(self):
        return f"repotting - {self.plant}"













# note_categories = [
#     ('m', 'plant memo'),
#     ('t', 'todo'),
#     ('j', 'journal')
# ]
# class Note(models.Model):
#     content = models.TextField()
#     author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="user_notes")
#     created_time = models.DateTimeField(auto_now_add=True)
#     last_updated = models.DateTimeField(auto_now=True)
#     category = models.CharField(max_length=10, choices=note_categories)
#     plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, null=True, blank=True, default=None, related_name="plant_notes")

#     def __str__(self):
#         return self.content

