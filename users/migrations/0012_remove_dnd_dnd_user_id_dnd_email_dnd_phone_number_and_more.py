# Generated by Django 4.0.1 on 2022-02-05 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_remove_user_access_code_remove_user_do_not_disturb_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dnd',
            name='dnd_user_id',
        ),
        migrations.AddField(
            model_name='dnd',
            name='email',
            field=models.EmailField(default=None, max_length=254, unique=True, verbose_name='email address'),
        ),
        migrations.AddField(
            model_name='dnd',
            name='phone_number',
            field=models.CharField(default=None, max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='dnd',
            name='username',
            field=models.CharField(default=None, max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(default=None, max_length=12, unique=True),
        ),
    ]