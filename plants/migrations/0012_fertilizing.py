# Generated by Django 3.1.2 on 2021-08-24 05:50

import datetime
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0011_auto_20210820_1421'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fertilizing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fertilizer', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('period', models.IntegerField(default=30)),
                ('last_fertilized', models.DateField(default=django.utils.timezone.now, validators=[django.core.validators.MaxValueValidator(datetime.date.today)])),
                ('plant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plant_fertilings', to='plants.plant')),
            ],
        ),
    ]
