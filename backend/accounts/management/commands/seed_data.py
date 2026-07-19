import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from accounts.models import User
from profiles.models import Industry, InternProfile, CompanyProfile, CompanyRepresentative
from challenges.models import Challenge, ChallengeRequirement, ChallengeTeam, TeamMember
from submissions.models import Submission
from notifications.models import Notification


class Command(BaseCommand):
    help = "Seeds the database with realistic testing data."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Clearing existing table data..."))
        
        # 1. Clear out existing non-superuser records to prevent unique constraint crashes
        Notification.objects.all().delete()
        Submission.objects.all().delete()
        TeamMember.objects.all().delete()
        ChallengeTeam.objects.all().delete()
        ChallengeRequirement.objects.all().delete()
        Challenge.objects.all().delete()
        CompanyRepresentative.objects.all().delete()
        CompanyProfile.objects.all().delete()
        InternProfile.objects.all().delete()
        Industry.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        self.stdout.write(self.style.SUCCESS("Database cleared successfully."))
        self.stdout.write(self.style.WARNING("Seeding fresh platform data..."))

        # 1. SEED MASTER CANONICAL INDUSTRIES 
        tech_industry = Industry.objects.create(name="Technology & Software")
        finance_industry = Industry.objects.create(name="FinTech & Banking")
        health_industry = Industry.objects.create(name="Healthcare & Biotech")

        #  2. SEED CORPORATE ACCOUNTS & PROFILES 
        # Company 1
        company_user_1 = User.objects.create_user(
            email="talent@edubridge.africa",
            username="edubridge_labs",
            first_name="EduBridge",
            last_name="Labs",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        company_profile_1 = CompanyProfile.objects.create(
            user=company_user_1,
            company_name="EduBridge Labs Africa",
            business_type="startup",
            industry=tech_industry,
            country="Rwanda",
            city="Kigali",
            website="https://edubridge.africa",
            description="Accelerating elite tech talent across the African continent through structured case challenges.",
            registration_certificate="company_documents/registration_certificates/mock_reg.pdf"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_1,
            job_title="Director of Operations",
            corporate_email="operations@edubridge.africa"
        )

        # Company 2
        company_user_2 = User.objects.create_user(
            email="partner@paywave.com",
            username="paywave_africa",
            first_name="PayWave",
            last_name="Fintech",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        company_profile_2 = CompanyProfile.objects.create(
            user=company_user_2,
            company_name="PayWave Africa Ltd",
            business_type="corporation",
            industry=finance_industry,
            country="Kenya",
            city="Nairobi",
            website="https://paywave.africa",
            description="Next-generation digital payment rails and micro-lending API infrastructure.",
            registration_certificate="company_documents/registration_certificates/mock_reg2.pdf"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_2,
            job_title="VP of Engineering",
            corporate_email="engineering@paywave.africa"
        )

        # 3. SEED INTERN TALENT ACCOUNTS & PROFILES 
        # Intern 1 (Team Leader)
        intern_user_1 = User.objects.create_user(
            email="kevin@intern.com",
            username="kevin_dev",
            first_name="Kevin",
            last_name="Munyaneza",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )
        InternProfile.objects.create(
            user=intern_user_1,
            country="Rwanda",
            city="Kigali",
            date_of_birth="2001-04-12",
            gender="male",
            current_status="graduate",
            institution="African Leadership University",
            field_of_study="Software Engineering",
            graduation_year=2024,
            years_of_experience=1,
            skills="Python, Django, PostgreSQL, Tailwind CSS, React",
            portfolio_url="https://github.com",
            national_or_student_id_document="identity_documents/mock_id.pdf",
            profile_picture="profile_pictures/mock_avatar.jpg",
            bio="Passionate full-stack developer focused on building scalable, transactional API systems."
        )

        # Intern 2 (Team Member)
        intern_user_2 = User.objects.create_user(
            email="jane@intern.com",
            username="jane_data",
            first_name="Jane",
            last_name="Awino",
            role=User.Roles.INTERN,
            password="SecurePassword123!",
        )
        InternProfile.objects.create(
            user=intern_user_2,
            country="Kenya",
            city="Nairobi",
            date_of_birth="2002-08-24",
            gender="female",
            current_status="student",
            institution="University of Nairobi",
            field_of_study="Data Science",
            graduation_year=2026,
            years_of_experience=0,
            skills="Python, Pandas, NumPy, Scikit-Learn, SQL",
            portfolio_url="https://github.com",
            national_or_student_id_document="identity_documents/mock_id2.pdf",
            profile_picture="profile_pictures/mock_avatar2.jpg",
            bio="Data scientist in training, specialized in predictive modeling and business intelligence analytics."
        )

        #  4. SEED PLATFORM CHALLENGES 
        # Challenge 1 (Published)
        challenge_1 = Challenge.objects.create(
            title="Pan-African Payment Gateway Optimization",
            description="Design an elegant, fault-tolerant transaction processing script that aggregates disparate mobile money APIs into a single microservice layer.",
            company=company_profile_2,
            industry=finance_industry,
            cash_prize=Decimal("2500.00"),
            submission_deadline=timezone.now() + timedelta(days=14),
            max_team_size=4,
            skills="Python, Redis, Celery, Mobile Money APIs",
            submission_formats=["pdf", "zip"],
            status="published"
        )
        ChallengeRequirement.objects.create(challenge=challenge_1, description="Must use atomic transactions.", order=1)
        ChallengeRequirement.objects.create(challenge=challenge_1, description="Provide a clean docker-compose environment.", order=2)

        # Challenge 2 (Draft)
        challenge_2 = Challenge.objects.create(
            title="AI Crop Disease Classification Model",
            description="Build an image recognition classifier capable of identifying maize leaf conditions using computer vision models.",
            company=company_profile_1,
            industry=tech_industry,
            cash_prize=Decimal("1500.00"),
            submission_deadline=timezone.now() + timedelta(days=30),
            max_team_size=2,
            skills="TensorFlow, Computer Vision, PyTorch",
            submission_formats=["zip"],
            status="draft"
        )

        # 5. SEED TEAMS, MEMBERS, AND SUBMISSIONS 
        # Assemble Team
        team = ChallengeTeam.objects.create(challenge=challenge_1, leader=intern_user_1)
        TeamMember.objects.create(team=team, user=intern_user_1)
        TeamMember.objects.create(team=team, user=intern_user_2)

        # Log an Evaluated Project Submission
        submission = Submission.objects.create(
            challenge=challenge_1,
            intern=intern_user_1,
            team=team,
            title="Unified Core Mobile Rails Repo",
            summary="Implemented a high-performance decoupled transaction processor utilizing Redis cache layers, cutting payment response overhead down by 40%.",
            report_link="https://google.com",
            github_repository="https://github.com/payment-rails",
            company_score=92,
            feedback="Exceptional architectural foresight and clean testing loops. Code handles race conditions gracefully.",
            shortlisted=True,
            cash_prize_awarded=Decimal("2500.00"),
            status=Submission.Status.REVIEWED
        )

        # 6. SEED SYSTEM NOTIFICATIONS 
        Notification.objects.create(
            recipient=intern_user_2,
            title="Challenge Invitation",
            message=f"{intern_user_1.get_full_name()} invited you to collaborate on the challenge '{challenge_1.title}'.",
            notification_type=Notification.NotificationType.CHALLENGE_INVITATION,
            related_object_id=uuid.uuid4(),
            is_read=True
        )

        Notification.objects.create(
            recipient=intern_user_1,
            title="Challenge Shortlist Selection",
            message=f"Congratulations! Your project entry for the challenge '{challenge_1.title}' has been successfully shortlisted.",
            notification_type=Notification.NotificationType.CHALLENGE_SHORTLIST,
            related_object_id=submission.id,
            is_read=False
        )
