import os
from rest_framework.serializers import ValidationError 

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB
ALLOWED_DOCUMENT_TYPES = [
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".zip",
]

def validate_document(file):
    if not file:
        return
        
    if file.size > MAX_FILE_SIZE:
        raise ValidationError("Maximum allowed file size is 20MB.")
        
    extension = os.path.splitext(file.name)[1].lower() 
    if extension not in ALLOWED_DOCUMENT_TYPES:
        raise ValidationError(f"Unsupported file type. Allowed formats: {', '.join(ALLOWED_DOCUMENT_TYPES)}")
