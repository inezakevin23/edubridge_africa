// Mock response for GET /api/registration/student/metadata
export const studentRegistrationStepLabels = [
  "Account",
  "Personal",
  "Professional",
  "Verify",
];

export const studentRegistrationStatusOptions = [
  "Student",
  "Graduate",
  "Freelancer",
  "Job Seeker",
  "Professional",
];

export const studentRegistrationSkills = [
  "UI/UX Design",
  "Python",
  "Data Analysis",
  "Product Strategy",
];

export const africanCountries = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Congo",
  "Cote d'Ivoire",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Sao Tome and Principe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
];

const currentYear = new Date().getFullYear();

export const graduationYears = Array.from(
  { length: 17 },
  (_, index) => String(currentYear - 8 + index),
);
