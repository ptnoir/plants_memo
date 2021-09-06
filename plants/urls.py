from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/login/', views.login_view, name="login"),
    path('logout', views.logout_view, name="logout"),
    path('register', views.register, name='register'),

    path('addplant',views.add_plant, name="addplant" ),
    path('plant/<int:plant_id>', views.plant, name='plant'),
    path('plant/<int:plant_id>/edit_form', views.edit_plant_form, name="editform"),

    # api routes
    path('plant/<int:plant_id>/update', views.update_plant, name="update"),
    path('plant/<int:plant_id>/delete', views.delete_plant, name="delete"),
    path('plant/<int:plant_id>/create_fertilizing', views.create_fertilizing, name="create_f"),
    path('plant/<int:plant_id>/fertilizing', views.fertilizing, name="fertilizing"),
    path('plant/<int:plant_id>/create_repotting',views.create_repotting, name="create_r"),
    path('plant/<int:plant_id>/repotting', views.repotting, name="repotting"),

]
