import uuid
from django.db import models
from common.models import BaseModel 
from .validators import validate_file_size, validate_image, validate_pdf


def profile_picture_upload_path(instance, filename):
    extension = filename.split(".")[-1]
    return f"profile_pictures/{instance.user.id}/{uuid.uuid4()}.{extension}"

def identity_document_upload_path(instance, filename):
    extension = filename.split(".")[-1]
    return f"identity_documents/{instance.user.id}/{uuid.uuid4()}.{extension}"

def registration_certificate_upload(instance, filename):
    extension = filename.split(".")[-1]
    return f"company_documents/registration_certificates/{instance.user.id}/{uuid.uuid4()}.{extension}"

def tax_document_upload(instance, filename):
    extension = filename.split(".")[-1]
    return f"company_documents/tax_documents/{instance.user.id}/{uuid.uuid4()}.{extension}"

def operating_license_upload(instance, filename):
    extension = filename.split(".")[-1]
    return f"company_documents/operating_licenses/{instance.user.id}/{uuid.uuid4()}.{extension}"

def ngo_certificate_upload(instance, filename):
    extension = filename.split(".")[-1]
    return f"company_documents/ngo_certificates/{instance.user.id}/{uuid.uuid4()}.{extension}"

def accreditation_upload(instance, filename):
    extension = filename.split(".")[-1]
    return f"company_documents/government_accreditation/{instance.user.id}/{uuid.uuid4()}.{extension}"


class GenderChoices(models.TextChoices):
    MALE = "male", "Male"
    FEMALE = "female", "Female"


class CurrentStatusChoices(models.TextChoices):
    STUDENT = "student", "Student"
    GRADUATE = "graduate", "Graduate"
    FREELANCER = "freelancer", "Freelancer"
    JOB_SEEKER = "job_seeker", "Job Seeker"
    PROFESSIONAL = "professional", "Professional"


class BusinessTypeChoices(models.TextChoices):
    STARTUP = "startup", "Startup"
    SME = "sme", "SME"
    CORPORATION = "corporation", "Corporation"
    NGO = "ngo", "NGO"
    GOVERNMENT = "government", "Government"
    EDUCATIONAL = "educational", "Educational Institution"


class AfricanCountries(models.TextChoices):
    ALGERIA = "Algeria", "Algeria"
    ANGOLA = "Angola", "Angola"
    BENIN = "Benin", "Benin"
    BOTSWANA = "Botswana", "Botswana"
    BURKINA_FASO = "Burkina Faso", "Burkina Faso"
    BURUNDI = "Burundi", "Burundi"
    CABO_VERDE = "Cabo Verde", "Cabo Verde"
    CAMEROON = "Cameroon", "Cameroon"
    CENTRAL_AFRICAN_REPUBLIC = "Central African Republic", "Central African Republic"
    CHAD = "Chad", "Chad"
    COMOROS = "Comoros", "Comoros"
    DEMOCRATIC_REPUBLIC_OF_THE_CONGO = "Democratic Republic of the Congo", "Democratic Republic of the Congo"
    DJIBOUTI = "Djibouti", "Djibouti"
    EGYPT = "Egypt", "Egypt"
    EQUATORIAL_GUINEA = "Equatorial Guinea", "Equatorial Guinea"
    ERITREA = "Eritrea", "Eritrea"
    ESWATINI = "Eswatini", "Eswatini"
    ETHIOPIA = "Ethiopia", "Ethiopia"
    GABON = "Gabon", "Gabon"
    GAMBIA = "Gambia", "Gambia"
    GHANA = "Ghana", "Ghana"
    GUINEA = "Guinea", "Guinea"
    GUINEA_BISSAU = "Guinea-Bissau", "Guinea-Bissau"
    IVORY_COAST = "Côte d'Ivoire", "Côte d'Ivoire"
    KENYA = "Kenya", "Kenya"
    LESOTHO = "Lesotho", "Lesotho"
    LIBERIA = "Liberia", "Liberia"
    LIBYA = "Libya", "Libya"
    MADAGASCAR = "Madagascar", "Madagascar"
    MALAWI = "Malawi", "Malawi"
    MALI = "Mali", "Mali"
    MAURITANIA = "Mauritania", "Mauritania"
    MAURITIUS = "Mauritius", "Mauritius"
    MOROCCO = "Morocco", "Morocco"
    MOZAMBIQUE = "Mozambique", "Mozambique"
    NAMIBIA = "Namibia", "Namibia"
    NIGER = "Niger", "Niger"
    NIGERIA = "Nigeria", "Nigeria"
    REPUBLIC_OF_THE_CONGO = "Republic of the Congo", "Republic of the Congo"
    RWANDA = "Rwanda", "Rwanda"
    SAO_TOME_AND_PRINCIPE = "Sao Tome and Principe", "Sao Tome and Principe"
    SENEGAL = "Senegal", "Senegal"
    SEYCHELLES = "Seychelles", "Seychelles"
    SIERRA_LEONE = "Sierra Leone", "Sierra Leone"
    SOMALIA = "Somalia", "Somalia"
    SOUTH_AFRICAN = "South Africa", "South Africa"
    SOUTH_SUDAN = "South Sudan", "South Sudan"
    SUDAN = "Sudan", "Sudan"
    TANZANIA = "Tanzania", "Tanzania"
    TOGO = "Togo", "Togo"
    TUNISIA = "Tunisia", "Tunisia"
    UGANDA = "Uganda", "Uganda"
    ZAMBIA = "Zambia", "Zambia"
    ZIMBABWE = "Zimbabwe", "Zimbabwe"


class VerificationStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    VERIFIED = "verified", "Verified"
    REJECTED = "rejected", "Rejected"


class Industry(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Industries"

    def __str__(self):
        return self.name


class InternProfile(BaseModel):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="intern_profile",
    )
    country = models.CharField(max_length=50, choices=AfricanCountries.choices)
    city = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GenderChoices.choices)
    current_status = models.CharField(
        max_length=20,
        choices=CurrentStatusChoices.choices,
        db_index=True,
    )
    institution = models.CharField(max_length=255, blank=True)
    field_of_study = models.CharField(max_length=255, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    skills = models.TextField(help_text="Separate skills using commas.")
    portfolio_url = models.URLField(blank=True)
    
    national_or_student_id_document = models.FileField(
        upload_to=identity_document_upload_path,
        validators=[validate_pdf, validate_file_size],
    )
    profile_picture = models.ImageField(
        upload_to=profile_picture_upload_path,
        validators=[validate_image, validate_file_size],
    )
    bio = models.TextField(blank=True)
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Intern Profile"
        verbose_name_plural = "Intern Profiles"

    def __str__(self):
        return self.user.get_full_name() if self.user else "Unlinked Intern Profile"


class CompanyProfile(BaseModel):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="company_profile",
    )
    company_name = models.CharField(max_length=255, unique=True)
    business_type = models.CharField(max_length=30, choices=BusinessTypeChoices.choices)
    industry = models.ForeignKey(
        Industry,
        on_delete=models.PROTECT,
        related_name="companies",
    )
    country = models.CharField(max_length=50, choices=AfricanCountries.choices)
    city = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    description = models.TextField()
    
    registration_certificate = models.FileField(
        upload_to=registration_certificate_upload,
        validators=[validate_pdf, validate_file_size],
    )
    tax_document = models.FileField(
        upload_to=tax_document_upload,
        validators=[validate_pdf, validate_file_size],
        blank=True,
        null=True,
    )
    operating_license = models.FileField(
        upload_to=operating_license_upload,
        validators=[validate_pdf, validate_file_size],
        blank=True,
        null=True,
    )
    ngo_certificate = models.FileField(
        upload_to=ngo_certificate_upload,
        validators=[validate_pdf, validate_file_size],
        blank=True,
        null=True,
    )
    government_accreditation = models.FileField(
        upload_to=accreditation_upload,
        validators=[validate_pdf, validate_file_size],
        blank=True,
        null=True,
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )

    class Meta:
        ordering = ["company_name"]
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profiles"

    def __str__(self):
        return self.company_name


class CompanyRepresentative(BaseModel):
    company = models.OneToOneField(
        CompanyProfile,
        on_delete=models.CASCADE,
        related_name="representative",
    )
    job_title = models.CharField(max_length=150)
    corporate_email = models.EmailField()

    class Meta:
        verbose_name = "Company Representative"
        verbose_name_plural = "Company Representatives"

    def __str__(self):
        return f"{self.job_title} ({self.corporate_email})"
