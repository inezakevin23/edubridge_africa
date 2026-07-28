from django.db import migrations, models


def convert_under_review_to_submitted(apps, schema_editor):
    """Convert any existing 'under_review' submissions to 'submitted'."""
    Submission = apps.get_model("submissions", "Submission")
    Submission.objects.filter(status="under_review").update(status="submitted")


class Migration(migrations.Migration):

    dependencies = [
        ("submissions", "0002_submissionshortlist"),
    ]

    operations = [
        migrations.RunPython(
            convert_under_review_to_submitted,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="submission",
            name="status",
            field=models.CharField(
                choices=[
                    ("submitted", "Submitted"),
                    ("reviewed", "Reviewed"),
                ],
                default="submitted",
                max_length=20,
            ),
        ),
    ]