import os
from django.core.exceptions import ValidationError

MAX_IMAGE_SIZE = 2 * 1024 * 1024      # 2 MB
MAX_DOCUMENT_SIZE = 5 * 1024 * 1024   # 5 MB

def validate_pdf(file):
    ext = os.path.splitext(file.name)[1].lower()

    if ext != ".pdf":
        raise ValidationError(
            "Only PDF documents are allowed."
        )

def validate_image(file):
    ext = os.path.splitext(file.name)[1].lower()

    allowed = [".jpg", ".jpeg", ".png"]

    if ext not in allowed:
        raise ValidationError(
            "Only JPG, JPEG and PNG images are allowed."
        )


def validate_file_size(file):
    max_size = (
        MAX_IMAGE_SIZE
        if file.name.lower().endswith(
            (".jpg", ".jpeg", ".png")
        )
        else MAX_DOCUMENT_SIZE
    )

    if file.size > max_size:
        raise ValidationError(
            "Uploaded file exceeds the maximum allowed size."
        )
