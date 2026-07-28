import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from accounts.models import User
from profiles.models import Industry, InternProfile, CompanyProfile, CompanyRepresentative
from challenges.models import Challenge, ChallengeRequirement, ChallengeTeam, TeamMember, ChallengeInvite
from submissions.models import Submission, SubmissionShortlist
from notifications.models import Notification


class Command(BaseCommand):
    help = "Seeds the database with realistic testing data."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Clearing existing table data..."))
        
        # 1. Clear out existing non-superuser records to prevent unique constraint crashes
        Notification.objects.all().delete()
        SubmissionShortlist.objects.all().delete()
        Submission.objects.all().delete()
        TeamMember.objects.all().delete()
        ChallengeInvite.objects.all().delete()
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
        agriculture_industry = Industry.objects.create(name="Agriculture & Agritech")
        education_industry = Industry.objects.create(name="Education & EdTech")
        ecommerce_industry = Industry.objects.create(name="E-commerce & Retail")
        energy_industry = Industry.objects.create(name="Renewable Energy & Sustainability")
        logistics_industry = Industry.objects.create(name="Logistics & Supply Chain")

        # 2. SEED CORPORATE ACCOUNTS & PROFILES
        # Company 1 - EduBridge Labs
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
            description="Accelerating elite tech talent across the African continent through structured case challenges and internships.",
            registration_certificate="company_documents/registration_certificates/edubridge_labs.pdf",
            verification_status="verified"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_1,
            job_title="Director of Operations",
            corporate_email="operations@edubridge.africa"
        )

        # Company 2 - PayWave Fintech
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
            description="Next-generation digital payment rails and micro-lending API infrastructure for emerging markets.",
            registration_certificate="company_documents/registration_certificates/paywave.pdf",
            verification_status="verified"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_2,
            job_title="VP of Engineering",
            corporate_email="engineering@paywave.com"
        )

        # Company 3 - AgriTech Solutions
        company_user_3 = User.objects.create_user(
            email="info@agritech.ke",
            username="agritech_solutions",
            first_name="AgriTech",
            last_name="Solutions",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        company_profile_3 = CompanyProfile.objects.create(
            user=company_user_3,
            company_name="AgriTech Solutions Kenya",
            business_type="startup",
            industry=agriculture_industry,
            country="Kenya",
            city="Nairobi",
            website="https://agritech.co.ke",
            description="AI-powered precision agriculture platform helping smallholder farmers increase yields by 40%.",
            registration_certificate="company_documents/registration_certificates/agritech.pdf",
            verification_status="verified"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_3,
            job_title="CTO",
            corporate_email="cto@agritech.co.ke"
        )

        # Company 4 - HealthSync Systems
        company_user_4 = User.objects.create_user(
            email="career@healthsync.ng",
            username="healthsync_ng",
            first_name="HealthSync",
            last_name="Systems",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        company_profile_4 = CompanyProfile.objects.create(
            user=company_user_4,
            company_name="HealthSync Nigeria",
            business_type="corporation",
            industry=health_industry,
            country="Nigeria",
            city="Lagos",
            website="https://healthsync.ng",
            description="Digital health records management and telemedicine platform serving 200+ hospitals across West Africa.",
            registration_certificate="company_documents/registration_certificates/healthsync.pdf",
            verification_status="verified"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_4,
            job_title="HR Director",
            corporate_email="hr@healthsync.ng"
        )

        # Company 5 - EduLearn Platform
        company_user_5 = User.objects.create_user(
            email="jobs@edulearn.ug",
            username="edulearn_uganda",
            first_name="EduLearn",
            last_name="Uganda",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        company_profile_5 = CompanyProfile.objects.create(
            user=company_user_5,
            company_name="EduLearn Platform Uganda",
            business_type="educational",
            industry=education_industry,
            country="Uganda",
            city="Kampala",
            website="https://edulearn.ug",
            description="Mobile-first e-learning platform providing quality education to rural communities.",
            registration_certificate="company_documents/registration_certificates/edulearn.pdf",
            verification_status="verified"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_5,
            job_title="Product Manager",
            corporate_email="pm@edulearn.ug"
        )

        # Company 6 - SolarGrid Energy
        company_user_6 = User.objects.create_user(
            email="careers@solargrid.za",
            username="solargrid_za",
            first_name="SolarGrid",
            last_name="Energy",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        company_profile_6 = CompanyProfile.objects.create(
            user=company_user_6,
            company_name="SolarGrid Energy SA",
            business_type="startup",
            industry=energy_industry,
            country="South Africa",
            city="Cape Town",
            website="https://solargrid.co.za",
            description="Decentralized solar microgrid solutions for off-grid communities in Southern Africa.",
            registration_certificate="company_documents/registration_certificates/solargrid.pdf",
            verification_status="verified"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_6,
            job_title="Lead Engineer",
            corporate_email="engineering@solargrid.co.za"
        )

        # Company 7 - QuickMart Express
        company_user_7 = User.objects.create_user(
            email="tech@quickmart.gh",
            username="quickmart_gh",
            first_name="QuickMart",
            last_name="Express",
            role=User.Roles.COMPANY,
            password="SecurePassword123!",
        )
        company_profile_7 = CompanyProfile.objects.create(
            user=company_user_7,
            company_name="QuickMart Express Ghana",
            business_type="corporation",
            industry=ecommerce_industry,
            country="Ghana",
            city="Accra",
            website="https://quickmart.gh",
            description="Last-mile e-commerce delivery platform connecting urban retailers with rural consumers.",
            registration_certificate="company_documents/registration_certificates/quickmart.pdf",
            verification_status="verified"
        )
        CompanyRepresentative.objects.create(
            company=company_profile_7,
            job_title="CTO",
            corporate_email="cto@quickmart.gh"
        )

        company_profiles = [
            company_profile_1, company_profile_2, company_profile_3,
            company_profile_4, company_profile_5, company_profile_6, company_profile_7
        ]

        # 3. SEED INTERN TALENT ACCOUNTS & PROFILES (15 interns)
        interns_data = [
            {
                "email": "kevin@intern.com", "username": "kevin_dev", "first_name": "Kevin", "last_name": "Munyaneza",
                "country": "Rwanda", "city": "Kigali", "date_of_birth": "2001-04-12", "gender": "male",
                "current_status": "graduate", "institution": "African Leadership University",
                "field_of_study": "Software Engineering", "graduation_year": 2024, "years_of_experience": 1,
                "skills": "Python, Django, PostgreSQL, Tailwind CSS, React, Docker",
                "bio": "Passionate full-stack developer focused on building scalable, transactional API systems."
            },
            {
                "email": "jane@intern.com", "username": "jane_data", "first_name": "Jane", "last_name": "Awino",
                "country": "Kenya", "city": "Nairobi", "date_of_birth": "2002-08-24", "gender": "female",
                "current_status": "student", "institution": "University of Nairobi",
                "field_of_study": "Data Science", "graduation_year": 2026, "years_of_experience": 0,
                "skills": "Python, Pandas, NumPy, Scikit-Learn, SQL, Tableau",
                "bio": "Data scientist in training, specialized in predictive modeling and business intelligence analytics."
            },
            {
                "email": "abubakar@intern.com", "username": "abubakar_ml", "first_name": "Abubakar", "last_name": "Ibrahim",
                "country": "Nigeria", "city": "Lagos", "date_of_birth": "2000-12-05", "gender": "male",
                "current_status": "graduate", "institution": "University of Lagos",
                "field_of_study": "Computer Science", "graduation_year": 2023, "years_of_experience": 2,
                "skills": "Machine Learning, TensorFlow, PyTorch, Computer Vision, NLP",
                "bio": "ML engineer passionate about applying AI to solve African problems in agriculture and healthcare."
            },
            {
                "email": "fatima@intern.com", "username": "fatima_mobile", "first_name": "Fatima", "last_name": "Hassan",
                "country": "Tanzania", "city": "Dar es Salaam", "date_of_birth": "2001-06-15", "gender": "female",
                "current_status": "graduate", "institution": "University of Dar es Salaam",
                "field_of_study": "Software Engineering", "graduation_year": 2024, "years_of_experience": 1,
                "skills": "Flutter, Dart, Firebase, Android, iOS, React Native",
                "bio": "Mobile app developer creating solutions for financial inclusion in East Africa."
            },
            {
                "email": "david@intern.com", "username": "david_cloud", "first_name": "David", "last_name": "Ochieng",
                "country": "Kenya", "city": "Nairobi", "date_of_birth": "1999-03-20", "gender": "male",
                "current_status": "professional", "institution": "Strathmore University",
                "field_of_study": "Information Technology", "graduation_year": 2021, "years_of_experience": 3,
                "skills": "AWS, Kubernetes, Docker, Terraform, CI/CD, Python, Go",
                "bio": "DevOps engineer specializing in cloud infrastructure and automation for fintech applications."
            },
            {
                "email": "amara@intern.com", "username": "amara_ux", "first_name": "Amara", "last_name": "Diallo",
                "country": "Senegal", "city": "Dakar", "date_of_birth": "2002-11-08", "gender": "female",
                "current_status": "student", "institution": "Université Cheikh Anta Diop",
                "field_of_study": "Human-Computer Interaction", "graduation_year": 2025, "years_of_experience": 0,
                "skills": "Figma, Adobe XD, UI/UX Design, User Research, Prototyping",
                "bio": "UX designer passionate about creating inclusive digital experiences for African users."
            },
            {
                "email": "chidi@intern.com", "username": "chidi_blockchain", "first_name": "Chidi", "last_name": "Okonkwo",
                "country": "Nigeria", "city": "Lagos", "date_of_birth": "2000-07-30", "gender": "male",
                "current_status": "graduate", "institution": "Covenant University",
                "field_of_study": "Computer Science", "graduation_year": 2023, "years_of_experience": 2,
                "skills": "Solidity, Web3.js, Ethereum, Smart Contracts, Rust",
                "bio": "Blockchain developer building decentralized solutions for transparency in African supply chains."
            },
            {
                "email": "grace@intern.com", "username": "grace_backend", "first_name": "Grace", "last_name": "Kimani",
                "country": "Kenya", "city": "Nairobi", "date_of_birth": "2001-09-14", "gender": "female",
                "current_status": "graduate", "institution": "Jomo Kenyatta University",
                "field_of_study": "Computer Science", "graduation_year": 2024, "years_of_experience": 1,
                "skills": "Java, Spring Boot, Microservices, REST APIs, PostgreSQL",
                "bio": "Backend engineer focused on building robust and scalable server-side applications."
            },
            {
                "email": "moussa@intern.com", "username": "moussa_iot", "first_name": "Moussa", "last_name": "Traoré",
                "country": "Mali", "city": "Bamako", "date_of_birth": "2000-02-18", "gender": "male",
                "current_status": "graduate", "institution": "École Polytechnique de Bamako",
                "field_of_study": "Electrical Engineering", "graduation_year": 2023, "years_of_experience": 2,
                "skills": "IoT, Arduino, Raspberry Pi, C++, Python, Sensor Networks",
                "bio": "IoT specialist developing smart agriculture sensors for monitoring soil conditions."
            },
            {
                "email": "zuri@intern.com", "username": "zuri_frontend", "first_name": "Zuri", "last_name": "Mwangi",
                "country": "Tanzania", "city": "Arusha", "date_of_birth": "2002-05-22", "gender": "female",
                "current_status": "student", "institution": "University of Arusha",
                "field_of_study": "Information Systems", "graduation_year": 2025, "years_of_experience": 0,
                "skills": "React, Vue.js, TypeScript, JavaScript, CSS, HTML",
                "bio": "Frontend developer passionate about creating accessible and performant web interfaces."
            },
            {
                "email": "kwame@intern.com", "username": "kwame_sec", "first_name": "Kwame", "last_name": "Asante",
                "country": "Ghana", "city": "Accra", "date_of_birth": "1999-10-10", "gender": "male",
                "current_status": "professional", "institution": "Kwame Nkrumah University of Science and Technology",
                "field_of_study": "Computer Science", "graduation_year": 2021, "years_of_experience": 3,
                "skills": "Cybersecurity, Penetration Testing, Python, Network Security, Cryptography",
                "bio": "Cybersecurity analyst helping organizations secure their digital assets against threats."
            },
            {
                "email": "nneka@intern.com", "username": "nneka_data", "first_name": "Nneka", "last_name": "Eze",
                "country": "Nigeria", "city": "Abuja", "date_of_birth": "2001-03-28", "gender": "female",
                "current_status": "graduate", "institution": "University of Abuja",
                "field_of_study": "Statistics", "graduation_year": 2023, "years_of_experience": 2,
                "skills": "R, Python, Data Visualization, Statistical Analysis, Machine Learning",
                "bio": "Data analyst leveraging statistics to drive insights in public health and social development."
            },
            {
                "email": "juma@intern.com", "username": "juma_fullstack", "first_name": "Juma", "last_name": "Mohammed",
                "country": "Tanzania", "city": "Mwanza", "date_of_birth": "2000-08-05", "gender": "male",
                "current_status": "graduate", "institution": "University of Dar es Salaam",
                "field_of_study": "Information Technology", "graduation_year": 2023, "years_of_experience": 2,
                "skills": "Node.js, Express, MongoDB, React, JavaScript, TypeScript",
                "bio": "Full-stack developer building end-to-end web applications for social impact."
            },
            {
                "email": "nadia@intern.com", "username": "nadia_ai", "first_name": "Nadia", "last_name": "Benali",
                "country": "Algeria", "city": "Algiers", "date_of_birth": "2001-01-17", "gender": "female",
                "current_status": "student", "institution": "University of Algiers",
                "field_of_study": "Artificial Intelligence", "graduation_year": 2025, "years_of_experience": 0,
                "skills": "Python, Deep Learning, NLP, Computer Vision, OpenCV",
                "bio": "AI researcher focused on natural language processing for low-resource African languages."
            },
            {
                "email": "tendai@intern.com", "username": "tendai_devops", "first_name": "Tendai", "last_name": "Moyo",
                "country": "Zimbabwe", "city": "Harare", "date_of_birth": "1999-06-12", "gender": "male",
                "current_status": "professional", "institution": "University of Zimbabwe",
                "field_of_study": "Computer Engineering", "graduation_year": 2020, "years_of_experience": 4,
                "skills": "Azure, Docker, Kubernetes, Ansible, Jenkins, Python",
                "bio": "DevOps specialist automating deployment pipelines for enterprise applications."
            },
            {
                "email": "jabir@intern.com", "username": "jabir_data", "first_name": "Jabir", "last_name": "Mensah",
                "country": "Ghana", "city": "Kumasi", "date_of_birth": "2000-11-03", "gender": "male",
                "current_status": "graduate", "institution": "Kwame Nkrumah University of Science and Technology",
                "field_of_study": "Data Science", "graduation_year": 2023, "years_of_experience": 2,
                "skills": "Python, SQL, Power BI, Machine Learning, Data Engineering",
                "bio": "Data engineer building scalable ETL pipelines and analytics solutions for fintech."
            }
        ]

        interns = []
        for idx, data in enumerate(interns_data):
            user = User.objects.create_user(
                email=data["email"],
                username=data["username"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=User.Roles.INTERN,
                password="SecurePassword123!",
            )
            profile = InternProfile.objects.create(
                user=user,
                country=data["country"],
                city=data["city"],
                date_of_birth=data["date_of_birth"],
                gender=data["gender"],
                current_status=data["current_status"],
                institution=data["institution"],
                field_of_study=data["field_of_study"],
                graduation_year=data["graduation_year"],
                years_of_experience=data["years_of_experience"],
                skills=data["skills"],
                portfolio_url=f"https://github.com/{data['username']}",
                national_or_student_id_document=f"identity_documents/{user.id}/mock_id_{idx}.pdf",
                profile_picture=f"profile_pictures/{user.id}/mock_avatar_{idx}.jpg",
                bio=data["bio"],
                verification_status="verified" if idx % 3 == 0 else "pending"
            )
            interns.append((user, profile))

        # 4. SEED 25 CHALLENGES
        challenges_data = [
            {
                "title": "Pan-African Payment Gateway Optimization",
                "description": "Design an elegant, fault-tolerant transaction processing script that aggregates disparate mobile money APIs (M-Pesa, MTN MoMo, Airtel Money) into a unified microservice layer.",
                "company": company_profile_2,
                "industry": finance_industry,
                "cash_prize": Decimal("5000.00"),
                "submission_deadline": timezone.now() + timedelta(days=14),
                "max_team_size": 4,
                "skills": "Python, Django, Redis, Celery, Mobile Money APIs",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must implement atomic transactions to prevent double-spending.",
                    "Provide a clean docker-compose environment for local testing.",
                    "Include comprehensive API documentation with Swagger/OpenAPI.",
                    "Must handle at least 10,000 concurrent transactions per second."
                ]
            },
            {
                "title": "AI-Powered Crop Disease Detection System",
                "description": "Build a computer vision model that can identify common maize, cassava, and tomato diseases from smartphone photos with 95%+ accuracy.",
                "company": company_profile_3,
                "industry": agriculture_industry,
                "cash_prize": Decimal("3500.00"),
                "submission_deadline": timezone.now() + timedelta(days=21),
                "max_team_size": 3,
                "skills": "TensorFlow, Computer Vision, PyTorch, Flask, OpenCV",
                "submission_formats": ["zip", "pdf"],
                "status": "published",
                "requirements": [
                    "Must work offline on low-end Android smartphones.",
                    "Include a dataset of at least 5,000 labeled images.",
                    "Provide a lightweight model (<50MB) for mobile deployment.",
                    "Must support English and one local language (Swahili or French)."
                ]
            },
            {
                "title": "Electronic Health Records Interoperability Platform",
                "description": "Create a FHIR-compliant API gateway that enables secure data exchange between hospital systems, labs, and insurance providers.",
                "company": company_profile_4,
                "industry": health_industry,
                "cash_prize": Decimal("4500.00"),
                "submission_deadline": timezone.now() + timedelta(days=30),
                "max_team_size": 4,
                "skills": "Python, FHIR, HL7, PostgreSQL, GraphQL",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must comply with HIPAA and local data protection regulations.",
                    "Implement OAuth2 authentication for healthcare providers.",
                    "Provide audit logging for all data access events.",
                    "Include a React-based admin dashboard for data visualization."
                ]
            },
            {
                "title": "Offline-First E-Learning Mobile Application",
                "description": "Develop a Progressive Web App (PWA) for rural students that works without internet connectivity and syncs when online.",
                "company": company_profile_5,
                "industry": education_industry,
                "cash_prize": Decimal("3000.00"),
                "submission_deadline": timezone.now() + timedelta(days=25),
                "max_team_size": 3,
                "skills": "React, Service Workers, IndexedDB, PWA, JavaScript",
                "submission_formats": ["zip"],
                "status": "published",
                "requirements": [
                    "Must support content caching for at least 50 hours of video.",
                    "Implement collaborative features (discussion forums, peer reviews).",
                    "Support SCORM packages for interactive lessons.",
                    "Include gamification elements (badges, leaderboards)."
                ]
            },
            {
                "title": "Solar Microgrid Monitoring Dashboard",
                "description": "Build a real-time IoT dashboard for monitoring solar panel performance, battery levels, and energy consumption patterns.",
                "company": company_profile_6,
                "industry": energy_industry,
                "cash_prize": Decimal("4000.00"),
                "submission_deadline": timezone.now() + timedelta(days=18),
                "max_team_size": 3,
                "skills": "React, D3.js, TimescaleDB, MQTT, Python",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must display real-time data with <5 second latency.",
                    "Implement predictive maintenance alerts using ML.",
                    "Create mobile-responsive dashboard with dark mode.",
                    "Include role-based access control (admin, technician, customer)."
                ]
            },
            {
                "title": "Last-Mile Delivery Route Optimizer",
                "description": "Create an algorithm that optimizes delivery routes for e-commerce packages in congested urban areas considering traffic patterns.",
                "company": company_profile_7,
                "industry": ecommerce_industry,
                "cash_prize": Decimal("3500.00"),
                "submission_deadline": timezone.now() + timedelta(days=22),
                "max_team_size": 4,
                "skills": "Python, Graph Algorithms, Google Maps API, PostgreSQL, Redis",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must reduce delivery time by at least 25% compared to standard routing.",
                    "Integrate real-time traffic data from local providers.",
                    "Support dynamic order insertion without full route recalculation.",
                    "Include a driver mobile app with turn-by-turn navigation."
                ]
            },
            {
                "title": "Blockchain-Based Land Registry System",
                "description": "Design a decentralized land title management system to prevent fraud and ensure transparent property transactions.",
                "company": company_profile_1,
                "industry": tech_industry,
                "cash_prize": Decimal("5000.00"),
                "submission_deadline": timezone.now() + timedelta(days=35),
                "max_team_size": 4,
                "skills": "Solidity, Ethereum, React, Web3.js, IPFS",
                "submission_formats": ["zip", "pdf"],
                "status": "published",
                "requirements": [
                    "Must provide immutable audit trail for all land transactions.",
                    "Implement multi-signature approval for government verification.",
                    "Include IPFS storage for property documents and images.",
                    "Create a user-friendly web interface for non-technical users."
                ]
            },
            {
                "title": "Predictive Maintenance System for Manufacturing",
                "description": "Develop an ML model that predicts equipment failures 48 hours in advance using sensor data from manufacturing machines.",
                "company": company_profile_6,
                "industry": tech_industry,
                "cash_prize": Decimal("4000.00"),
                "submission_deadline": timezone.now() + timedelta(days=28),
                "max_team_size": 3,
                "skills": "Python, Scikit-Learn, Time Series Analysis, Flask, REST API",
                "submission_formats": ["zip", "pdf"],
                "status": "published",
                "requirements": [
                    "Must achieve 90%+ prediction accuracy with minimal false positives.",
                    "Include data preprocessing pipeline for sensor data normalization.",
                    "Provide REST API for integration with existing ERP systems.",
                    "Create a Grafana dashboard for real-time monitoring."
                ]
            },
            {
                "title": "Mobile Money Fraud Detection Engine",
                "description": "Build a real-time fraud detection system for mobile money transactions using pattern recognition and anomaly detection.",
                "company": company_profile_2,
                "industry": finance_industry,
                "cash_prize": Decimal("6000.00"),
                "submission_deadline": timezone.now() + timedelta(days=20),
                "max_team_size": 4,
                "skills": "Python, Kafka, Redis, Machine Learning, PostgreSQL",
                "submission_formats": ["zip", "pdf"],
                "status": "published",
                "requirements": [
                    "Must process transactions in <100ms with 95% fraud detection rate.",
                    "Implement explainable AI to justify fraud flags to regulators.",
                    "Include a feedback loop for continuous model improvement.",
                    "Must handle batch processing for offline fraud pattern analysis."
                ]
            },
            {
                "title": "Supply Chain Traceability Platform",
                "description": "Create a blockchain-based system for tracking agricultural products from farm to consumer, ensuring authenticity and fair trade.",
                "company": company_profile_3,
                "industry": agriculture_industry,
                "cash_prize": Decimal("4000.00"),
                "submission_deadline": timezone.now() + timedelta(days=32),
                "max_team_size": 3,
                "skills": "Blockchain, Hyperledger, React, Node.js, MongoDB",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must support QR code scanning for product verification.",
                    "Include farmer profiles and certification management.",
                    "Provide consumer-facing mobile app for product tracing.",
                    "Implement smart contracts for automated payments to farmers."
                ]
            },
            {
                "title": "Telemedicine Consultation Platform",
                "description": "Develop a HIPAA-compliant video consultation platform connecting patients in rural areas with specialist doctors in urban centers.",
                "company": company_profile_4,
                "industry": health_industry,
                "cash_prize": Decimal("4500.00"),
                "submission_deadline": timezone.now() + timedelta(days=40),
                "max_team_size": 4,
                "skills": "WebRTC, Django, PostgreSQL, React, Azure/AWS",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must support video calls up to 60 minutes with HD quality.",
                    "Implement end-to-end encryption for patient privacy.",
                    "Include electronic prescription generation and management.",
                    "Integrate with local payment systems for consultation fees."
                ]
            },
            {
                "title": "EdTech Gamification Engine",
                "description": "Build a gamification engine that increases student engagement through points, badges, leaderboards, and adaptive learning paths.",
                "company": company_profile_5,
                "industry": education_industry,
                "cash_prize": Decimal("3000.00"),
                "submission_deadline": timezone.now() + timedelta(days=24),
                "max_team_size": 3,
                "skills": "JavaScript, Node.js, MongoDB, Redis, React",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must provide 20+ types of achievements and badges.",
                    "Implement machine learning for personalized content recommendations.",
                    "Support social features (challenges, team competitions).",
                    "Include analytics dashboard for educators to track engagement metrics."
                ]
            },
            {
                "title": "Smart Energy Meter with IoT Integration",
                "description": "Design an IoT-based energy monitoring system that provides real-time consumption data and automated billing for residential users.",
                "company": company_profile_6,
                "industry": energy_industry,
                "cash_prize": Decimal("3500.00"),
                "submission_deadline": timezone.now() + timedelta(days=27),
                "max_team_size": 3,
                "skills": "IoT, Arduino, MQTT, Python, React, TimescaleDB",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must measure energy consumption with ±2% accuracy.",
                    "Implement remote control capabilities for energy providers.",
                    "Create a mobile app for users to monitor consumption patterns.",
                    "Support prepaid billing integration with mobile money."
                ]
            },
            {
                "title": "Marketplace Recommendation Engine",
                "description": "Build a recommendation system for an e-commerce platform that increases conversion rates through personalized product suggestions.",
                "company": company_profile_7,
                "industry": ecommerce_industry,
                "cash_prize": Decimal("3000.00"),
                "submission_deadline": timezone.now() + timedelta(days=19),
                "max_team_size": 3,
                "skills": "Python, Collaborative Filtering, Content-Based Filtering, Redis, PostgreSQL",
                "submission_formats": ["zip"],
                "status": "published",
                "requirements": [
                    "Must handle 1M+ products with sub-200ms recommendation latency.",
                    "Include cold-start strategies for new users and products.",
                    "Implement A/B testing framework for recommendation algorithms.",
                    "Provide explainability for why products are recommended."
                ]
            },
            {
                "title": "Cybersecurity Threat Intelligence Platform",
                "description": "Create a platform that aggregates and analyzes cybersecurity threats specific to African businesses, providing actionable insights.",
                "company": company_profile_1,
                "industry": tech_industry,
                "cash_prize": Decimal("4500.00"),
                "submission_deadline": timezone.now() + timedelta(days=33),
                "max_team_size": 4,
                "skills": "Python, Elasticsearch, ML, Threat Intelligence, API Integration",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must integrate with at least 5 threat intelligence feeds.",
                    "Implement automated threat scoring and prioritization.",
                    "Create customizable alerting system via SMS, email, Slack.",
                    "Include incident response playbook management."
                ]
            },
            {
                "title": "Crowdfunding Platform for African Startups",
                "description": "Develop a crowdfunding platform connecting African entrepreneurs with global investors, featuring escrow and milestone-based funding.",
                "company": company_profile_2,
                "industry": finance_industry,
                "cash_prize": Decimal("4000.00"),
                "submission_deadline": timezone.now() + timedelta(days=29),
                "max_team_size": 4,
                "skills": "Django, React, Stripe/PayPal API, PostgreSQL, Celery",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must support both equity and rewards-based crowdfunding.",
                    "Implement escrow service for secure fund management.",
                    "Include investor verification and due diligence workflows.",
                    "Provide campaign analytics and performance tracking."
                ]
            },
            {
                "title": "Drone-Based Crop Monitoring System",
                "description": "Build a system that processes drone imagery to assess crop health, identify pest infestations, and optimize irrigation.",
                "company": company_profile_3,
                "industry": agriculture_industry,
                "cash_prize": Decimal("5000.00"),
                "submission_deadline": timezone.now() + timedelta(days=45),
                "max_team_size": 4,
                "skills": "Python, OpenCV, GIS, DroneKit, Flask, React",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must process NDVI (Normalized Difference Vegetation Index) from drone images.",
                    "Include automated flight path planning for drone coverage.",
                    "Generate actionable insights for farmers via SMS alerts.",
                    "Support integration with satellite imagery for historical analysis."
                ]
            },
            {
                "title": "Mental Health Chatbot with Sentiment Analysis",
                "description": "Create an AI-powered mental health chatbot that provides crisis support and resources in multiple African languages.",
                "company": company_profile_4,
                "industry": health_industry,
                "cash_prize": Decimal("3500.00"),
                "submission_deadline": timezone.now() + timedelta(days=26),
                "max_team_size": 3,
                "skills": "Python, NLP, Transformers, FastAPI, React, TensorFlow",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must detect suicidal ideation and trigger emergency protocols.",
                    "Support at least 5 African languages with language detection.",
                    "Include resource directory with local mental health services.",
                    "Ensure conversation privacy with end-to-end encryption."
                ]
            },
            {
                "title": "AR-Based Vocational Training Simulator",
                "description": "Develop an Augmented Reality mobile app that simulates hands-on training for trades like electrical work, plumbing, and carpentry.",
                "company": company_profile_5,
                "industry": education_industry,
                "cash_prize": Decimal("4000.00"),
                "submission_deadline": timezone.now() + timedelta(days=38),
                "max_team_size": 3,
                "skills": "Unity, AR Foundation, C#, Mobile Development, 3D Modeling",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must run smoothly on mid-range Android devices.",
                    "Include interactive tutorials with step-by-step guidance.",
                    "Provide performance tracking and skill assessment.",
                    "Support offline mode for areas with poor connectivity."
                ]
            },
            {
                "title": "Peer-to-Peer Energy Trading Platform",
                "description": "Build a blockchain-based platform allowing solar panel owners to sell excess energy to neighbors in real-time.",
                "company": company_profile_6,
                "industry": energy_industry,
                "cash_prize": Decimal("4500.00"),
                "submission_deadline": timezone.now() + timedelta(days=34),
                "max_team_size": 4,
                "skills": "Ethereum, Smart Contracts, React, Node.js, IoT",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must enable automatic micro-transactions via smart contracts.",
                    "Integrate with smart meters for real-time energy measurement.",
                    "Include a marketplace for energy trading bids.",
                    "Provide transparent billing and settlement records."
                ]
            },
            {
                "title": "Inventory Management System for SMEs",
                "description": "Create an affordable, cloud-based inventory management system tailored for small and medium enterprises in Africa.",
                "company": company_profile_7,
                "industry": ecommerce_industry,
                "cash_prize": Decimal("3000.00"),
                "submission_deadline": timezone.now() + timedelta(days=16),
                "max_team_size": 3,
                "skills": "Django, React, PostgreSQL, Redis, REST API",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must include barcode/QR code scanning functionality.",
                    "Provide low-stock alerts via SMS and email.",
                    "Generate purchase orders and sales reports automatically.",
                    "Support multi-currency and multi-location inventory tracking."
                ]
            },
            {
                "title": "Facial Recognition Attendance System",
                "description": "Develop a facial recognition-based attendance system for schools and workplaces that works in low-light conditions.",
                "company": company_profile_1,
                "industry": tech_industry,
                "cash_prize": Decimal("3500.00"),
                "submission_deadline": timezone.now() + timedelta(days=23),
                "max_team_size": 3,
                "skills": "Python, OpenCV, Deep Learning, Flask, React",
                "submission_formats": ["zip", "pdf"],
                "status": "published",
                "requirements": [
                    "Must achieve 98%+ accuracy in various lighting conditions.",
                    "Include anti-spoofing measures to prevent photo-based fraud.",
                    "Generate real-time attendance reports with analytics.",
                    "Support integration with existing HR management systems."
                ]
            },
            {
                "title": "Cross-Border Remittance Fee Optimizer",
                "description": "Build a platform that compares and optimizes remittance fees across African corridors, helping diaspora send money home cost-effectively.",
                "company": company_profile_2,
                "industry": finance_industry,
                "cash_prize": Decimal("4000.00"),
                "submission_deadline": timezone.now() + timedelta(days=28),
                "max_team_size": 3,
                "skills": "Python, Django, Celery, Celery Beat, PostgreSQL, Redis",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must aggregate real-time exchange rates from 10+ providers.",
                    "Include route optimization considering fees, speed, and reliability.",
                    "Provide transaction history and receipt generation.",
                    "Support mobile money integration for direct disbursement."
                ]
            },
            {
                "title": "Livestock Health Monitoring Wearable",
                "description": "Design a low-cost IoT wearable device for tracking livestock health metrics and sending alerts to farmers.",
                "company": company_profile_3,
                "industry": agriculture_industry,
                "cash_prize": Decimal("4000.00"),
                "submission_deadline": timezone.now() + timedelta(days=36),
                "max_team_size": 4,
                "skills": "IoT, Python, LoRaWAN, MongoDB, React, Embedded C",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must operate on battery for at least 6 months.",
                    "Track temperature, heart rate, and movement patterns.",
                    "Send SMS alerts for abnormal health indicators.",
                    "Include a farmer mobile app with herd management features."
                ]
            },
            {
                "title": "AI-Powered Medical Diagnostic Assistant",
                "description": "Create an AI system that assists healthcare workers in diagnosing common diseases using symptom analysis and medical history.",
                "company": company_profile_4,
                "industry": health_industry,
                "cash_prize": Decimal("5000.00"),
                "submission_deadline": timezone.now() + timedelta(days=42),
                "max_team_size": 4,
                "skills": "NLP, TensorFlow, Python, FastAPI, React",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must achieve 85%+ diagnostic accuracy for top 20 common diseases.",
                    "Include explainable AI features for medical validation.",
                    "Support offline mode for remote clinics with limited connectivity.",
                    "Generate medical reports compatible with hospital systems."
                ]
            },
            {
                "title": "Virtual Reality Heritage Tours",
                "description": "Build a VR platform offering immersive cultural heritage tours of African historical sites for educational purposes.",
                "company": company_profile_5,
                "industry": education_industry,
                "cash_prize": Decimal("3500.00"),
                "submission_deadline": timezone.now() + timedelta(days=37),
                "max_team_size": 3,
                "skills": "Unity, VR/AR Development, 3D Modeling, C#, Photogrammetry",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must create photorealistic 360° environments of at least 3 heritage sites.",
                    "Include interactive storytelling features with historical narratives.",
                    "Support multiple VR headsets (Oculus, HTC Vive).",
                    "Provide educational quizzes and assessments."
                ]
            },
            {
                "title": "Waste Management Optimization System",
                "description": "Develop a smart waste management platform using IoT sensors to optimize collection routes and reduce operational costs.",
                "company": company_profile_6,
                "industry": tech_industry,
                "cash_prize": Decimal("3800.00"),
                "submission_deadline": timezone.now() + timedelta(days=25),
                "max_team_size": 3,
                "skills": "IoT, Python, Django, React, Google Maps API",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must integrate fill-level sensors on waste bins.",
                    "Implement route optimization reducing fuel consumption by 30%.",
                    "Create admin dashboard for fleet and worker management.",
                    "Include citizen reporting app for illegal dumping incidents."
                ]
            },
            {
                "title": "Voice-Enabled E-Commerce Assistant",
                "description": "Build a voice-activated shopping assistant allowing users to search, compare, and purchase products using natural language.",
                "company": company_profile_7,
                "industry": ecommerce_industry,
                "cash_prize": Decimal("3200.00"),
                "submission_deadline": timezone.now() + timedelta(days=21),
                "max_team_size": 3,
                "skills": "Python, Speech Recognition, NLP, React, Deep Learning",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must support 5+ African languages with accent recognition.",
                    "Include product comparison and review summarization features.",
                    "Implement secure voice authentication for transactions.",
                    "Provide personalized recommendations based on purchase history."
                ]
            },
            {
                "title": "Open Source Contribution Platform",
                "description": "Create a platform connecting African developers with open source projects, featuring mentorship and code review systems.",
                "company": company_profile_1,
                "industry": tech_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=60),
                "max_team_size": 4,
                "skills": "Django, React, Git, OAuth, PostgreSQL",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must integrate with GitHub/GitLab APIs for repository management.",
                    "Include code review and approval workflows.",
                    "Implement mentorship matching algorithm.",
                    "Provide contribution tracking and gamification."
                ]
            },
            {
                "title": "Digital Identity Verification System",
                "description": "Build a secure digital identity system for unbanked populations using biometric verification and blockchain technology.",
                "company": company_profile_2,
                "industry": finance_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=45),
                "max_team_size": 3,
                "skills": "Python, Blockchain, Biometrics, PostgreSQL, React",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must use government-issued ID verification.",
                    "Implement biometric fingerprint/facial recognition.",
                    "Ensure GDPR and local data protection compliance.",
                    "Create mobile SDK for third-party integrations."
                ]
            },
            {
                "title": "Community Health Worker Mobile App",
                "description": "Develop a mobile application for community health workers to track patient visits, vaccinations, and health metrics.",
                "company": company_profile_4,
                "industry": health_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=35),
                "max_team_size": 3,
                "skills": "Flutter, Firebase, Django, PostgreSQL, REST API",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must work offline in remote areas with no connectivity.",
                    "Include GPS tracking for field visits.",
                    "Implement SMS reminders for patient follow-ups.",
                    "Generate health metrics dashboards for health officials."
                ]
            },
            {
                "title": "Rural Education Content Management System",
                "description": "Create a CMS for managing and distributing educational content to rural schools with offline synchronization.",
                "company": company_profile_5,
                "industry": education_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=40),
                "max_team_size": 3,
                "skills": "Django, React, PostgreSQL, Redis, Celery",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must support bulk content upload and organization.",
                    "Include offline sync capabilities for low-connectivity areas.",
                    "Implement role-based access for teachers, admins, students.",
                    "Generate analytics on content usage and student progress."
                ]
            },
            {
                "title": "Microinsurance Management Platform",
                "description": "Build a platform for managing microinsurance policies, claims, and payouts for low-income rural communities.",
                "company": company_profile_2,
                "industry": finance_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=50),
                "max_team_size": 4,
                "skills": "Django, React, PostgreSQL, Celery, Stripe API",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must support mobile money premium payments.",
                    "Implement automated claims processing with ML.",
                    "Include satellite data integration for crop insurance.",
                    "Generate policy documents and certificates."
                ]
            },
            {
                "title": "Smart Agriculture Advisory System",
                "description": "Develop an AI-powered advisory system providing farmers with personalized recommendations for crop selection and farming practices.",
                "company": company_profile_3,
                "industry": agriculture_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=55),
                "max_team_size": 3,
                "skills": "Python, NLP, TensorFlow, Django, React",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must analyze soil data, weather patterns, and market prices.",
                    "Provide SMS-based recommendations for feature phone users.",
                    "Include image recognition for pest/disease detection.",
                    "Support multiple African languages."
                ]
            },
            {
                "title": "Telemedicine Appointment Scheduling System",
                "description": "Create an intelligent appointment scheduling system for telemedicine consultations with AI-powered time slot optimization.",
                "company": company_profile_4,
                "industry": health_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=30),
                "max_team_size": 3,
                "skills": "Django, React, PostgreSQL, Redis, Celery",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must integrate with doctor availability calendars.",
                    "Implement automated reminders via SMS and email.",
                    "Include waitlist management and cancellation handling.",
                    "Provide video consultation link generation."
                ]
            },
            {
                "title": "E-Learning Assessment and Grading System",
                "description": "Build an automated assessment and grading platform for online courses with plagiarism detection and detailed analytics.",
                "company": company_profile_5,
                "industry": education_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=38),
                "max_team_size": 3,
                "skills": "Python, Django, React, PostgreSQL, NLP",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must support multiple question types (MCQ, essay, coding).",
                    "Implement plagiarism detection for written assignments.",
                    "Provide detailed performance analytics for students and instructors.",
                    "Include peer assessment capabilities."
                ]
            },
            {
                "title": "Solar Energy Financing Calculator",
                "description": "Develop a financial calculator and platform for financing solar energy installations for households and small businesses.",
                "company": company_profile_6,
                "industry": energy_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=25),
                "max_team_size": 3,
                "skills": "React, JavaScript, Python, Django, PostgreSQL",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must calculate ROI and payback periods accurately.",
                    "Include mobile money integration for down payments.",
                    "Provide loan application and approval workflows.",
                    "Generate detailed financial projections and reports."
                ]
            },
            {
                "title": "Farmer-to-Consumer Marketplace",
                "description": "Create a direct marketplace platform connecting smallholder farmers directly to consumers, eliminating middlemen.",
                "company": company_profile_3,
                "industry": agriculture_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=42),
                "max_team_size": 4,
                "skills": "Django, React, PostgreSQL, Redis, Google Maps API",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must include geolocation-based product search.",
                    "Implement secure payment and escrow system.",
                    "Provide delivery tracking and logistics coordination.",
                    "Include farmer verification and rating system."
                ]
            },
            {
                "title": "Mental Health Self-Assessment Tool",
                "description": "Build a confidential self-assessment tool for mental health screening with recommendations for professional help.",
                "company": company_profile_4,
                "industry": health_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=33),
                "max_team_size": 3,
                "skills": "Python, NLP, Django, React, TensorFlow",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must include validated mental health questionnaires.",
                    "Implement crisis intervention protocols.",
                    "Ensure complete user privacy and data encryption.",
                    "Provide directory of mental health professionals."
                ]
            },
            {
                "title": "Renewable Energy Crowdfunding Platform",
                "description": "Develop a specialized crowdfunding platform for renewable energy projects with impact tracking and investor returns.",
                "company": company_profile_6,
                "industry": energy_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=48),
                "max_team_size": 4,
                "skills": "Django, React, PostgreSQL, Stripe, Celery",
                "submission_formats": ["pdf", "zip"],
                "status": "draft",
                "requirements": [
                    "Must track and visualize environmental impact metrics.",
                    "Implement project milestone verification by third parties.",
                    "Include investor dashboard with returns tracking.",
                    "Generate compliance reports for regulatory bodies."
                ]
            },
            {
                "title": "Automated Essay Scoring System",
                "description": "Create an AI-powered essay scoring system that provides instant feedback on grammar, structure, and content quality.",
                "company": company_profile_5,
                "industry": education_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=28),
                "max_team_size": 3,
                "skills": "Python, NLP, GPT Models, Django, React",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must evaluate grammar, coherence, and argument strength.",
                    "Provide constructive feedback and improvement suggestions.",
                    "Support multiple languages and dialects.",
                    "Include plagiarism detection capabilities."
                ]
            },
            {
                "title": "Local Community Service Platform",
                "description": "Build a platform connecting volunteers with local community service opportunities and tracking impact metrics.",
                "company": company_profile_1,
                "industry": tech_industry,
                "cash_prize": None,
                "submission_deadline": timezone.now() + timedelta(days=32),
                "max_team_size": 3,
                "skills": "Django, React, PostgreSQL, Google Maps API, Celery",
                "submission_formats": ["pdf", "zip"],
                "status": "published",
                "requirements": [
                    "Must include opportunity matching based on skills and interests.",
                    "Implement volunteer hour tracking and certification.",
                    "Provide impact measurement and reporting dashboards.",
                    "Include event management and RSVP functionality."
                ]
            }
        ]

        created_challenges = []
        for challenge_data in challenges_data:
            requirements = challenge_data.pop("requirements", [])
            challenge = Challenge.objects.create(**challenge_data)
            created_challenges.append(challenge)
            
            for idx, req_desc in enumerate(requirements, 1):
                ChallengeRequirement.objects.create(
                    challenge=challenge,
                    description=req_desc,
                    order=idx
                )

        # 5. SEED TEAMS, MEMBERS, AND SUBMISSIONS
        # Create teams for some challenges
        team_data = [
            (created_challenges[0], interns[0], [interns[0], interns[1]]),
            (created_challenges[1], interns[2], [interns[2], interns[3], interns[4]]),
            (created_challenges[2], interns[5], [interns[5], interns[6]]),
            (created_challenges[3], interns[7], [interns[7], interns[8], interns[9]]),
            (created_challenges[4], interns[10], [interns[10], interns[11]]),
            (created_challenges[5], interns[12], [interns[12], interns[13], interns[14]]),
            (created_challenges[6], interns[1], [interns[1], interns[3]]),
            (created_challenges[7], interns[4], [interns[4], interns[5], interns[6]]),
            (created_challenges[8], interns[8], [interns[8], interns[10]]),
        ]

        created_teams = []
        for challenge, leader, members in team_data:
            team = ChallengeTeam.objects.create(challenge=challenge, leader=leader[0])
            for member in members:
                TeamMember.objects.create(team=team, user=member[0])
            created_teams.append((challenge, team))

        # Create submissions with various statuses
        submissions_data = [
            {
                "challenge": created_challenges[0], "intern": interns[0][0], "team": created_teams[0][1],
                "title": "Unified Mobile Payment Gateway API",
                "summary": "Implemented a high-performance decoupled transaction processor with Redis cache layers, achieving 40% reduction in payment response overhead.",
                "report_link": "https://github.com/kevin_dev/payment-gateway",
                "github_repository": "https://github.com/kevin_dev/payment-gateway",
                "company_score": 92,
                "feedback": "Exceptional architectural foresight and clean testing loops. Code handles race conditions gracefully.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("5000.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[1], "intern": interns[2][0], "team": created_teams[1][1],
                "title": "Crop Disease CNN Model v2.0",
                "summary": "Developed a MobileNetV2-based classifier achieving 96.7% accuracy on maize leaf diseases with optimized quantization for mobile deployment.",
                "report_link": "https://github.com/abubakar_ml/crop-disease-ai",
                "github_repository": "https://github.com/abubakar_ml/crop-disease-ai",
                "company_score": 88,
                "feedback": "Impressive model optimization techniques. Well-documented training pipeline.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("3500.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[2], "intern": interns[5][0], "team": created_teams[2][1],
                "title": "HealthSync FHIR Gateway Implementation",
                "summary": "Built a FHIR R4 compliant API gateway with OAuth2 authentication and HL7 message transformation capabilities.",
                "report_link": "https://github.com/grace_backend/fhir-gateway",
                "github_repository": "https://github.com/grace_backend/fhir-gateway",
                "company_score": 85,
                "feedback": "Solid implementation of FHIR standards. Could improve error handling.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("4500.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[3], "intern": interns[7][0], "team": created_teams[3][1],
                "title": "EduLearn PWA - Offline Learning Platform",
                "summary": "Created a fully offline-capable PWA with Service Workers, IndexedDB caching, and collaborative learning features.",
                "report_link": "https://github.com/zuri_frontend/edulearn-pwa",
                "github_repository": "https://github.com/zuri_frontend/edulearn-pwa",
                "status": Submission.Status.SUBMITTED
            },
            {
                "challenge": created_challenges[4], "intern": interns[10][0], "team": created_teams[4][1],
                "title": "SolarGrid IoT Monitoring Dashboard",
                "summary": "Developed real-time dashboard with D3.js visualizations, TimescaleDB for time-series data, and MQTT integration for IoT devices.",
                "report_link": "https://github.com/juma_fullstack/solargrid-dashboard",
                "github_repository": "https://github.com/juma_fullstack/solargrid-dashboard",
                "company_score": 90,
                "feedback": "Excellent real-time data visualization. Clean architecture and well-tested.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("4000.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[5], "intern": interns[12][0], "team": created_teams[5][1],
                "title": "QuickMart Delivery Route Optimizer",
                "summary": "Implemented Dijkstra's algorithm with A* optimization for route planning, reducing delivery times by 28% in simulation.",
                "report_link": "https://github.com/tendai_devops/route-optimizer",
                "github_repository": "https://github.com/tendai_devops/route-optimizer",
                "status": Submission.Status.SUBMITTED
            },
            {
                "challenge": created_challenges[6], "intern": interns[1][0], "team": None,
                "title": "Blockchain Land Registry Smart Contracts",
                "summary": "Developed Solidity smart contracts for land title management with IPFS integration for document storage.",
                "report_link": "https://github.com/jane_data/land-registry-blockchain",
                "github_repository": "https://github.com/jane_data/land-registry-blockchain",
                "company_score": 87,
                "feedback": "Innovative use of blockchain for land registry. Security audit needed.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("5000.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[7], "intern": interns[4][0], "team": created_teams[7][1],
                "title": "IoT Sensor Data Processing Pipeline",
                "summary": "Built a scalable data processing pipeline using Apache Kafka and Spark for real-time sensor data analytics.",
                "report_link": "https://github.com/david_cloud/sensor-pipeline",
                "github_repository": "https://github.com/david_cloud/sensor-pipeline",
                "status": Submission.Status.SUBMITTED
            },
            {
                "challenge": created_challenges[8], "intern": interns[8][0], "team": created_teams[8][1],
                "title": "Mobile M-Pesa Fraud Detection Model",
                "summary": "Implemented gradient boosting model with 96% fraud detection accuracy and <80ms inference time using model quantization.",
                "report_link": "https://github.com/moussa_iot/fraud-detection",
                "github_repository": "https://github.com/moussa_iot/fraud-detection",
                "company_score": 95,
                "feedback": "Outstanding performance and model explainability. Well-architected solution.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("6000.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[9], "intern": interns[9][0], "team": None,
                "title": "AgriTech Supply Chain Traceability",
                "summary": "Created a Hyperledger Fabric network for tracking agricultural products with QR code verification at each stage.",
                "report_link": "https://github.com/zuri_frontend/agritech-trace",
                "github_repository": "https://github.com/zuri_frontend/agritech-trace",
                "status": Submission.Status.SUBMITTED
            },
            {
                "challenge": created_challenges[10], "intern": interns[11][0], "team": None,
                "title": "Telemedicine Video Consultation App",
                "summary": "Built a WebRTC-based telemedicine platform with HIPAA compliance, e-prescriptions, and mobile money integration.",
                "report_link": "https://github.com/nneka_data/telemedicine-app",
                "github_repository": "https://github.com/nneka_data/telemedicine-app",
                "company_score": 91,
                "feedback": "Excellent security implementation and seamless video quality.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("4500.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[12], "intern": interns[13][0], "team": None,
                "title": "Smart Energy Meter with Real-time Dashboard",
                "summary": "Developed IoT-enabled energy meter with MQTT protocol, providing real-time consumption analytics and automated billing.",
                "report_link": "https://github.com/juma_fullstack/energy-meter",
                "github_repository": "https://github.com/juma_fullstack/energy-meter",
                "company_score": 86,
                "feedback": "Solid hardware-software integration. Good documentation.",
                "shortlisted": True,
                "cash_prize_awarded": Decimal("3500.00"),
                "status": Submission.Status.REVIEWED
            },
            {
                "challenge": created_challenges[13], "intern": interns[14][0], "team": None,
                "title": "E-Commerce Recommendation Engine",
                "summary": "Implemented hybrid recommendation system combining collaborative and content-based filtering with 35% increase in click-through rate.",
                "report_link": "https://github.com/nadia_ai/recommendation-engine",
                "github_repository": "https://github.com/nadia_ai/recommendation-engine",
                "status": Submission.Status.SUBMITTED
            },
        ]

        created_submissions = []
        for sub_data in submissions_data:
            submission = Submission.objects.create(**sub_data)
            created_submissions.append(submission)
            
            # Create shortlist entries if shortlisted
            if submission.shortlisted:
                SubmissionShortlist.objects.create(
                    submission=submission,
                    user=submission.intern
                )

        # 6. SEED SYSTEM NOTIFICATIONS
        notifications = [
            {
                "recipient": interns[1][0],
                "title": "Challenge Invitation",
                "message": f"{interns[0][0].get_full_name()} invited you to collaborate on the challenge '{created_challenges[0].title}'.",
                "notification_type": Notification.NotificationType.CHALLENGE_INVITATION,
                "related_object_id": uuid.uuid4(),
                "is_read": True
            },
            {
                "recipient": interns[0][0],
                "title": "Challenge Shortlist Selection",
                "message": f"Congratulations! Your project entry for '{created_challenges[0].title}' has been shortlisted.",
                "notification_type": Notification.NotificationType.CHALLENGE_SHORTLIST,
                "related_object_id": created_submissions[0].id,
                "is_read": False
            },
            {
                "recipient": interns[11][0],
                "title": "Submission Under Review",
                "message": f"Your submission for '{created_challenges[10].title}' is now under review by the company.",
                "notification_type": Notification.NotificationType.SUBMISSION_REVIEWED,
                "related_object_id": created_submissions[10].id,
                "is_read": True
            },
            {
                "recipient": company_user_1,
                "title": "New Submissions Received",
                "message": f"You have received 3 new submissions for your challenge '{created_challenges[6].title}'.",
                "notification_type": Notification.NotificationType.NEW_SUBMISSION,
                "related_object_id": created_challenges[6].id,
                "is_read": False
            }
        ]

        for notif_data in notifications:
            Notification.objects.create(**notif_data)

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded platform data:"))
        self.stdout.write(f"  - {len(Industry.objects.all())} industries")
        self.stdout.write(f"  - {len(company_profiles)} companies")
        self.stdout.write(f"  - {len(interns)} interns")
        self.stdout.write(f"  - {len(created_challenges)} challenges")
        self.stdout.write(f"  - {len(created_teams)} teams")
        self.stdout.write(f"  - {len(created_submissions)} submissions")
        self.stdout.write(f"  - {len(notifications)} notifications")
        self.stdout.write(self.style.SUCCESS("Seed data completed successfully!"))