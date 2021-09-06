# Plants Memo

Plants Memo :herb: is a Django and Javascript app implemented to track gardening activities, a considerate gardening companion for those who know about their plants.

! [app index page](https://user-images.githubusercontent.com/61316741/132164620-7447a166-c6e3-4918-9420-11cbbe5e87f3.png)

## What is it and Why I build it

In the endless summer the balcony becomes so hot for me to go checking daily, I always forget to water my plants on schedule and they dies on me.

On the simple idea of keeping records of the last time I watered plants and calculating the next date with normal watering schedule with each plant, I implement this gardening work tracking application to get notified as a todo task when the next event comes without me going out to feel the soil and observe leaves everyday, and also enjoy crossing off all the checkboxes after completing the garden work.


## Features

- Watering tracking:
 It will appear as a todo task when the next watering date is due and auto update the last watered date when the task is checked as completed.  
 All works are presented simple and clear with checkboxes.

- Besides watering, user can choose to add usual gardening activities for todo tasks - fertilizing & repotting.  

- Save/update plant info anytime.

- Manage gardening activities:  
 With considerations for varying growing environments of plants, user can specify and alter their own schedule of gardening activities instead of setting a fixed one. (with the normal activity frequecy suggested)

- When a scientific name for the plant is available or on added, wiki extract will generate for users to learn more about the plants in garden.



## Distinctiveness and Complexity

- Implemented models CRUD functions both via rendering templates with modelForms and api ajax functions

- Similar activities are implemented both as fields of a model (watering activity) and another model of foreign key relationship (fertilizing and repotting activities).

- Implemented the quitting of adding/editing activities for better UX.

- Warning popup implemented before deleting the plant.

- Timedelta utilized to calculate the next comming event.

- Format time functions employed for unification of multiple time formats frontend and backend.

- Utilizes wiki api to generate extract.

- Widgets utilized to implement date picker with the datefields and for customizations of CSS and id.

- Future dates are disabled both frontend in dateinput (js function) and backend (validators).

- Plant Image field implemented with default image and resized output utilizing pillow library.

- Django forms dynamically rendered using Ajax.

- Customized CSS

- For minimalistic UI, details are designed as hover to display.



## What's in the file

In the file is a Django project called Capstone that contains a single app called Plants, structured similarly to other pset project apps in CS50 Web. 

| File | Description |
| ------ | ------ |
| media | with a default image and an images folder inside to store user uploaded images for the model Plant imagefield. | 
| plants/urls.py | where the URL configuration for this app Plants is defined. | 
| plants/static/plants/script.js | the javascript file for the whole app | 
| plants/static/plants/style.css | the css file for the whole app | 
| plants/models.py | This is where the models are defined for the application. | 
| plants/admin.py | where models get registered for the admin panel | 
| plants/views.py |  contains the views that are associated with all the routes of the app. | 
| **Html files** :| 
| plants/templates/plants/layout.html | the layout html template for other html pages | 
| plants/templates/plants/login.html | user login page of the project | 
| plants/templates/plants/register.html | user register page of the project |
| plants/templates/plants/index.html | main page of the project where user can overview all one's plants, add/delete plant, interact with dynamic todo task(s) of the plant. |
| plants/templates/plants/plant_form.html | plants model form page for creating new plant and updating current plant information. |
| plants/templates/plants/plant.html | single plant page, with detailed infos, activities management and wiki extract of a specific plant.


## How to run

    1. Download the code file and unzip it or clone this repo.
    
    2. In your terminal, cd into the capstone directory.
    
    3. Download all packages from requirements.txt
```bash
    pip install -r requirements.txt
```
    4. Run the django server
```bash
    python manage.py runserver
```


## To be continued :cactus:

- Later I would add a jounal section to keep track of the thoughts and observations during my gardening time.

- If this project to be deployed for other people to use, I will add a plant identification feature utilizing api. 
