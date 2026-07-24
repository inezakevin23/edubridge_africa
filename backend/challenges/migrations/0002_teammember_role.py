from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("challenges", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="teammember",
            name="role",
            field=models.CharField(default="Member", max_length=100),
        ),
    ]
