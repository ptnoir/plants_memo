# Generated by Django 3.1.2 on 2021-08-18 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0002_category_note_plant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plant',
            name='category',
            field=models.CharField(blank=True, choices=[('C', 'Cacti & Succulents'), ('L', 'Foliage'), ('F', 'Flowering Plants'), ('V', 'Vegetables'), ('H', 'Herbs')], max_length=30, null=True),
        ),
        migrations.DeleteModel(
            name='Category',
        ),
    ]
