// Mock response shape for GET /api/challenges and GET /api/challenges/:slug
import {
  BriefcaseBusiness,
  ChartPie,
  CheckSquare,
  Coins,
  Clock3,
  Users,
} from "lucide-react";

export const challengeDetailsNavItems = [
  ["Dashboard", ChartPie],
  ["Manage Challenges", BriefcaseBusiness],
  ["Submissions", CheckSquare],
];

const baseFeedback = [
  {
    label: "Problem Framing",
    score: "85/100",
    value: "85%",
    color: "bg-[#22C55E]",
    note: "Good clarity on scope. Consider narrowing the user segment for greater depth.",
  },
  {
    label: "Research Methodology",
    score: "76/100",
    value: "76%",
    color: "bg-[#F59E0B]",
    note: "Strong early structure. Add more evidence for assumptions and trade-offs.",
  },
  {
    label: "Proposed Solution",
    score: "91/100",
    value: "91%",
    color: "bg-[#22C55E]",
    note: "Excellent practicality and measurable implementation milestones.",
  },
];

const baseLeaderboard = [
  ["1", "Amina B.", "98%", "https://i.pravatar.cc/100?img=47"],
  ["2", "Kwame O.", "95%", "https://i.pravatar.cc/100?img=12"],
  ["3", "Adebayo O.", "91%", "https://i.pravatar.cc/100?img=32"],
];

export const challengeRecords = [
  {
    id: "chal_001",
    slug: "supply-chain-optimization",
    title: "Supply Chain Optimization",
    company: {
      name: "Jumia",
      legalName: "Jumia Inc.",
      industry: "E-Commerce - Pan-African",
      description:
        "Africa's leading online marketplace, operating across 11 countries with a mission to make commerce easier and more reliable across the continent.",
      challengesPosted: 12,
      averageRating: 4.9,
    },
    initials: "J",
    color: "bg-violet-500/20 text-[#A879FF]",
    status: "Open",
    tags: ["Logistics", "Data Analysis", "Strategy"],
    xp: "1200 XP",
    applicants: "142",
    time: "2 days left",
    deadline: "Oct 24, 2024",
    participants: "142",
    summary:
      "Optimize last-mile delivery costs and delays across Lagos, Nairobi, and Accra using operational data.",
    description:
      "Jumia is facing operational inefficiencies in its last-mile delivery supply chain that result in higher costs, missed delivery promises, and inconsistent customer experiences. The team needs fresh analytical and strategic perspectives from emerging African talent.",
    brief: [
      "Participants will analyze delivery network data across Lagos, Nairobi, and Accra, identify key bottlenecks, and propose a data-driven optimization framework that can reduce last-mile delivery costs by at least 20%.",
      "Solutions should include a clear problem analysis, an implementation roadmap, and measurable KPIs. Strong submissions will connect operational changes to customer experience and business outcomes.",
    ],
    requirements: [
      "Analyze the provided CSV and GeoJSON datasets covering 6 months of delivery records across 3 cities",
      "Identify the top 3 bottlenecks causing delivery delays and cost overruns",
      "Propose a scalable optimization framework with at least 3 concrete interventions",
      "Build a visual dashboard prototype to present your findings",
      "Provide a written report of no more than 2,000 words summarizing your methodology",
      "Include projected ROI calculations for each proposed intervention",
    ],
    collaboration: {
      maxMembers: 3,
      currentMembers: [
        {
          name: "Adebayo O.",
          avatar: "https://i.pravatar.cc/100?img=32",
        },
        {
          name: "Fatima S.",
          avatar: "https://i.pravatar.cc/100?img=47",
        },
      ],
      note: "Adebayo O., Fatima S. - 1 slot remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
  {
    id: "chal_002",
    slug: "fintech-app-onboarding-ux",
    title: "Fintech App Onboarding UX",
    company: {
      name: "Flutterwave",
      legalName: "Flutterwave",
      industry: "Fintech - Payments",
      description:
        "A payments technology company helping businesses across Africa collect, send, and manage money through digital products.",
      challengesPosted: 8,
      averageRating: 4.8,
    },
    initials: "F",
    color: "bg-amber-500/20 text-[#F59E0B]",
    status: "Open",
    tags: ["UI/UX", "Research", "Design"],
    xp: "800 XP",
    applicants: "89",
    time: "5 days left",
    deadline: "Oct 27, 2024",
    participants: "89",
    summary:
      "Redesign onboarding so first-time merchants can activate payments with less confusion and fewer drop-offs.",
    description:
      "Flutterwave wants to reduce onboarding abandonment for small business owners who are new to digital payments. The challenge focuses on UX research, clearer product education, and a practical activation journey.",
    brief: [
      "Map the current onboarding journey, identify friction points, and design a streamlined flow for first-time merchants using mobile-first screens.",
      "Your solution should balance compliance requirements with clarity, trust, and a faster path to the user's first successful transaction.",
    ],
    requirements: [
      "Create a user journey map for a small merchant signing up for payment collection",
      "Identify at least 5 onboarding friction points and rank them by severity",
      "Design a low or mid-fidelity prototype covering account setup, verification, and first payment activation",
      "Write a short research summary explaining your assumptions and target persona",
      "Define 4 product metrics that would prove the new onboarding flow works",
    ],
    collaboration: {
      maxMembers: 3,
      currentMembers: [
        { name: "Maya N.", avatar: "https://i.pravatar.cc/100?img=5" },
      ],
      note: "Maya N. - 2 slots remaining",
    },
    feedback: baseFeedback,
    leaderboard: [
      ["1", "Thabo M.", "96%", "https://i.pravatar.cc/100?img=15"],
      ["2", "Salma K.", "92%", "https://i.pravatar.cc/100?img=25"],
      ["3", "Ife A.", "89%", "https://i.pravatar.cc/100?img=44"],
    ],
  },
  {
    id: "chal_003",
    slug: "sustainable-agri-tech-model",
    title: "Sustainable Agri-Tech Model",
    company: {
      name: "Nourish Africa",
      legalName: "Nourish Africa",
      industry: "Agriculture - Social Impact",
      description:
        "An impact organization helping food entrepreneurs and smallholder-focused ventures build resilient agricultural businesses.",
      challengesPosted: 6,
      averageRating: 4.7,
    },
    initials: "N",
    color: "bg-emerald-500/20 text-[#22C55E]",
    status: "Open",
    tags: ["Strategy", "Impact", "Agriculture"],
    xp: "450 XP",
    applicants: "56",
    time: "1 week left",
    deadline: "Oct 31, 2024",
    participants: "56",
    summary:
      "Design a practical model that helps smallholder farmers access markets while reducing crop loss.",
    description:
      "Nourish Africa is exploring lightweight agri-tech models that can improve farmer income, market access, and produce quality without requiring expensive infrastructure.",
    brief: [
      "Develop a business and operating model for a pilot program supporting smallholder farmers in one region.",
      "Focus on adoption barriers, partner roles, unit economics, and how the model could scale after a small pilot.",
    ],
    requirements: [
      "Choose one crop value chain and one target region",
      "Describe the farmer, buyer, and logistics pain points",
      "Propose a pilot operating model with partners, costs, and success metrics",
      "Explain how the model reduces waste or improves farmer revenue",
      "Prepare a 5-slide summary deck for stakeholders",
    ],
    collaboration: {
      maxMembers: 3,
      currentMembers: [],
      note: "No teammates yet - 3 slots remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
  {
    id: "chal_004",
    slug: "ai-powered-credit-scoring",
    title: "AI-Powered Credit Scoring",
    company: {
      name: "Kuda Bank",
      legalName: "Kuda Bank",
      industry: "Digital Banking",
      description:
        "A digital bank building simple, mobile-first financial services for individuals and small businesses.",
      challengesPosted: 9,
      averageRating: 4.8,
    },
    initials: "K",
    color: "bg-pink-500/20 text-[#F472B6]",
    status: "Private",
    tags: ["Machine Learning", "Finance", "Python"],
    xp: "1500 XP",
    applicants: "34",
    time: "3 days left",
    deadline: "Oct 25, 2024",
    participants: "34",
    summary:
      "Prototype a fair credit scoring approach for thin-file customers using alternative behavioral signals.",
    description:
      "Kuda Bank wants to explore responsible credit scoring for users with limited formal credit history while protecting customers from biased or opaque decisions.",
    brief: [
      "Design a scoring model concept that combines alternative signals, explainability, and responsible lending safeguards.",
      "The submission should include a small notebook or model outline, evaluation metrics, and a risk review for fairness and privacy.",
    ],
    requirements: [
      "Define candidate features and explain why each feature is relevant",
      "Build a simple baseline model or scoring framework in Python",
      "Describe fairness risks and how you would test for bias",
      "Recommend human review triggers for borderline applications",
      "Create a one-page model governance summary",
    ],
    collaboration: {
      maxMembers: 2,
      currentMembers: [
        { name: "Nana Y.", avatar: "https://i.pravatar.cc/100?img=20" },
      ],
      note: "Nana Y. - 1 slot remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
  {
    id: "chal_005",
    slug: "rural-healthcare-access-study",
    title: "Rural Healthcare Access Study",
    company: {
      name: "HealthTide NGO",
      legalName: "HealthTide NGO",
      industry: "Healthcare - Nonprofit",
      description:
        "A nonprofit organization improving access to community health resources in underserved rural regions.",
      challengesPosted: 5,
      averageRating: 4.6,
    },
    initials: "H",
    color: "bg-orange-500/20 text-[#FB923C]",
    status: "Open",
    tags: ["Research", "Healthcare", "Impact"],
    xp: "700 XP",
    applicants: "71",
    time: "10 days left",
    deadline: "Nov 3, 2024",
    participants: "71",
    summary:
      "Research barriers to rural clinic access and recommend service delivery improvements for community teams.",
    description:
      "HealthTide NGO needs a structured study that turns community feedback into clear operational recommendations for rural healthcare outreach.",
    brief: [
      "Design a mixed-methods research approach and synthesize likely access barriers across transport, cost, awareness, and trust.",
      "Recommendations should be realistic for community health workers and low-bandwidth operating environments.",
    ],
    requirements: [
      "Draft a research plan with survey and interview questions",
      "Create 3 user personas representing rural patients or caregivers",
      "Identify the highest-impact access barriers",
      "Recommend 4 service delivery improvements with implementation effort",
      "Define ethical considerations for health-related research",
    ],
    collaboration: {
      maxMembers: 4,
      currentMembers: [
        { name: "Grace T.", avatar: "https://i.pravatar.cc/100?img=49" },
      ],
      note: "Grace T. - 3 slots remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
  {
    id: "chal_006",
    slug: "e-commerce-growth-playbook",
    title: "E-Commerce Growth Playbook",
    company: {
      name: "Paystack",
      legalName: "Paystack",
      industry: "Fintech - Commerce Infrastructure",
      description:
        "A payments company helping ambitious businesses in Africa accept payments and build better online commerce experiences.",
      challengesPosted: 10,
      averageRating: 4.9,
    },
    initials: "P",
    color: "bg-violet-500/20 text-[#A879FF]",
    status: "Open",
    tags: ["Growth", "Marketing", "Analytics"],
    xp: "950 XP",
    applicants: "103",
    time: "4 days left",
    deadline: "Oct 26, 2024",
    participants: "103",
    summary:
      "Build a growth playbook that helps online merchants improve checkout conversion and repeat purchases.",
    description:
      "Paystack wants practical, data-informed growth recommendations that small online merchants can apply quickly without a large marketing team.",
    brief: [
      "Create a merchant growth playbook focused on acquisition, checkout conversion, retention, and measurement.",
      "The best submissions will include experiments, sample messaging, and analytics events that make results measurable.",
    ],
    requirements: [
      "Define the target merchant segment and customer persona",
      "Audit common conversion leaks in an e-commerce checkout journey",
      "Propose 6 growth experiments with effort and impact estimates",
      "Create a measurement plan with funnel events and success metrics",
      "Prepare a concise rollout calendar for the first 30 days",
    ],
    collaboration: {
      maxMembers: 3,
      currentMembers: [
        { name: "Lerato S.", avatar: "https://i.pravatar.cc/100?img=36" },
      ],
      note: "Lerato S. - 2 slots remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
  {
    id: "chal_007",
    slug: "mobile-first-education-platform",
    title: "Mobile-First Education Platform",
    company: {
      name: "Andela",
      legalName: "Andela",
      industry: "Talent Technology",
      description:
        "A technology talent platform connecting skilled professionals with global opportunities and learning pathways.",
      challengesPosted: 7,
      averageRating: 4.7,
    },
    initials: "A",
    color: "bg-yellow-500/20 text-[#EAB308]",
    status: "Open",
    tags: ["EdTech", "Product", "UX"],
    xp: "1100 XP",
    applicants: "67",
    time: "6 days left",
    deadline: "Oct 28, 2024",
    participants: "67",
    summary:
      "Design a mobile-first learning experience for learners with limited data, irregular schedules, and career goals.",
    description:
      "Andela is exploring new learning formats that keep early-career technologists engaged while respecting connectivity, cost, and time constraints.",
    brief: [
      "Design the core product experience for a mobile-first education platform serving emerging African tech talent.",
      "Show how learners discover modules, complete practice work, track progress, and connect learning outcomes to job readiness.",
    ],
    requirements: [
      "Define 2 primary learner personas and their constraints",
      "Create a feature priority map for the first MVP release",
      "Design core mobile screens for discovery, lesson, practice, and progress tracking",
      "Recommend offline or low-data product behaviors",
      "Define success metrics for engagement and learning outcomes",
    ],
    collaboration: {
      maxMembers: 3,
      currentMembers: [
        { name: "Ruth E.", avatar: "https://i.pravatar.cc/100?img=9" },
      ],
      note: "Ruth E. - 2 slots remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
  {
    id: "chal_008",
    slug: "waste-collection-route-optimizer",
    title: "Waste Collection Route Optimizer",
    company: {
      name: "Ecoclean Lagos",
      legalName: "Ecoclean Lagos",
      industry: "Environment - Urban Services",
      description:
        "A city services startup improving waste collection reliability and recycling outcomes in dense urban communities.",
      challengesPosted: 4,
      averageRating: 4.5,
    },
    initials: "E",
    color: "bg-emerald-500/20 text-[#22C55E]",
    status: "Open",
    tags: ["Environment", "Mapping", "Impact"],
    xp: "400 XP",
    applicants: "29",
    time: "2 weeks left",
    deadline: "Nov 7, 2024",
    participants: "29",
    summary:
      "Improve collection routes for dense neighborhoods while reducing missed pickups and fuel usage.",
    description:
      "Ecoclean Lagos needs a practical routing recommendation that balances truck capacity, neighborhood density, road conditions, and predictable pickup windows.",
    brief: [
      "Analyze a simplified set of pickup zones and propose a better route planning approach for weekly waste collection.",
      "Your answer should be understandable to operations teams and include a small map, route logic, or scheduling table.",
    ],
    requirements: [
      "Define the routing problem and key constraints",
      "Group pickup zones by priority and proximity",
      "Propose an optimized weekly route plan",
      "Estimate operational benefits such as fuel savings or fewer missed pickups",
      "Show how residents would be notified about pickup windows",
    ],
    collaboration: {
      maxMembers: 3,
      currentMembers: [],
      note: "No teammates yet - 3 slots remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
  {
    id: "chal_009",
    slug: "pan-african-logistics-dashboard",
    title: "Pan-African Logistics Dashboard",
    company: {
      name: "DHL Africa",
      legalName: "DHL Africa",
      industry: "Logistics",
      description:
        "A logistics provider supporting regional shipping, cross-border trade, and business delivery operations across African markets.",
      challengesPosted: 11,
      averageRating: 4.8,
    },
    initials: "D",
    color: "bg-fuchsia-500/20 text-[#E879F9]",
    status: "Private",
    tags: ["Data Viz", "Logistics", "Design"],
    xp: "1800 XP",
    applicants: "18",
    time: "1 day left",
    deadline: "Oct 23, 2024",
    participants: "18",
    summary:
      "Design an executive dashboard for shipment performance, route exceptions, and market-level logistics trends.",
    description:
      "DHL Africa wants a dashboard concept that helps operations leaders spot route exceptions, compare country performance, and prioritize action.",
    brief: [
      "Create a data visualization concept for regional logistics leaders who need fast insight into shipment reliability.",
      "Your dashboard should make exceptions obvious, support country comparisons, and include recommended actions for common operational issues.",
    ],
    requirements: [
      "Define executive and operations user needs",
      "Sketch dashboard information architecture",
      "Design visual components for shipment status, exceptions, route performance, and market comparisons",
      "Explain how users drill into problem routes or delayed shipments",
      "Recommend alert thresholds and operational KPIs",
    ],
    collaboration: {
      maxMembers: 2,
      currentMembers: [
        { name: "Omar D.", avatar: "https://i.pravatar.cc/100?img=52" },
      ],
      note: "Omar D. - 1 slot remaining",
    },
    feedback: baseFeedback,
    leaderboard: baseLeaderboard,
  },
];

export const challengeList = challengeRecords.map(
  ({
    slug,
    title,
    company,
    initials,
    color,
    status,
    tags,
    xp,
    applicants,
    time,
  }) => ({
    slug,
    title,
    company: company.name,
    initials,
    color,
    status,
    tags,
    xp,
    applicants,
    time,
  }),
);

export const getChallengeBySlug = (slug) =>
  challengeRecords.find((challenge) => challenge.slug === slug);

export const getChallengeApplyRows = (challenge) => [
  ["Reward", challenge.xp, Coins],
  ["Deadline", challenge.deadline, Clock3],
  ["Participants", challenge.participants, Users],
];
