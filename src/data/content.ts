// All site copy lives here. The layout reads everything from this file.

export const profile = {
  firstName: "ALI",
  lastName: "ASGHAR",
  role: "Data Scientist · AI Automation Engineer",
  title: "AI Automation Engineer", // how the site refers to you
  location: "Karachi, Pakistan",
  timeZone: "Asia/Karachi", // IANA zone shown by the nav clock
  email: "ali.asgherr20@gmail.com", // primary, used for the contact button
  emails: [
    { label: "Personal", address: "ali.asgherr20@gmail.com" },
    { label: "Business", address: "business.intelliops@gmail.com" },
  ],
  available: true,
  socials: [
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/ali-asgharr/" },
    { label: "GitHub", icon: "github", href: "https://github.com/Intelli-Ops" },
  ],
};

export const fullName = `${profile.firstName} ${profile.lastName}`;
export const initials = profile.firstName[0] + profile.lastName[0];

/** Page sections in scroll order. Section labels are numbered from this list automatically. */
export const sections = ["about", "services", "stack", "work", "testimonials", "experience", "contact"] as const;
export type SectionId = (typeof sections)[number];

/**
 * Contact form delivery. Recommended: Google Sheets. Follow the steps at the top of
 * integrations/google-sheets-form.gs, then paste the Web app URL (ends in /exec) here.
 * Every message becomes a row in your sheet (download it as Excel any time) and is emailed to you.
 * A Formspree URL (https://formspree.io/f/...) also works. While this is empty, the form opens
 * the visitor's email app with the message pre-filled instead.
 */
export const contactForm = { endpoint: "https://script.google.com/macros/s/AKfycbw_DOugXUX62HzdVFQTGTdJbrB21MxAcygUQQSSG2j2EZBwaXkqZc4CYx1QOvjAvab4gg/exec" };

// Scrolling ticker under the About section.
export const clients = ["Medical Lien Management", "Green Sense Billing", "Billgenix", "Maidan", "Finaccsol"];

export const about = {
  kicker: "Data → Decisions → Automation",
  // Inline marks (see RichText.tsx): ~text~ struck through, *text* highlighted, [text] dimmed.
  headline: "I turn ~repetitive work~ into *systems that run themselves*",
  body: [
    "I'm an AI Automation Engineer with a data science background. I start by understanding how work actually gets done, then find the steps that are slow, repetitive or easy to get wrong.",
    "Those steps become reliable systems built with Python, machine learning and modern AI, so teams spend their time on decisions instead of copy and paste.",
  ],
  // "How I work" tiles shown under the text.
  steps: [
    { title: "Map", text: "Understand the process, the data and where time is lost." },
    { title: "Model", text: "Clean, analyse and model the data behind each decision." },
    { title: "Automate", text: "Build the pipeline, agent or report that does the work." },
    { title: "Monitor", text: "Validate every run so the output can be trusted." },
  ],
};

export type Service = {
  title: string;
  blurb: string;
  /** Optional short process line shown above the tools, e.g. Understand → Build → Automate. */
  flow?: string[];
  tags: string[]; // tool names; icons are matched by name in src/data/icons.tsx
  visual: "flow" | "chart" | "ai";
};

export const services: Service[] = [
  {
    title: "Report Automation",
    blurb: "I sit with the team, map how a report or process is done today and find where the hours go. Then I build the system that runs it: data is pulled from portals and files, cleaned, checked against your business rules and delivered on schedule, without anyone touching a spreadsheet.",
    flow: ["Understand", "Build", "Automate"],
    tags: ["Python", "Power Automate", "Excel", "Office Scripts", "VBScript"],
    visual: "flow",
  },
  {
    title: "Data Analysis & BI",
    blurb: "Interactive Power BI and Excel dashboards, financial sheets and SQL analysis that give leadership one trusted view of the numbers, refreshed automatically instead of rebuilt by hand every week.",
    flow: ["Connect", "Analyse", "Visualise"],
    tags: ["Power BI", "Excel", "SQL", "Pandas", "ETL / SSIS"],
    visual: "chart",
  },
  {
    title: "AI Workflows & APIs",
    blurb: "AI that plugs into the tools you already use. It reads documents and invoices with OCR, pulls out the details, checks them against your records and updates your systems for you. It all runs behind a small API with a job queue, so it works reliably in the background every day.",
    flow: ["Read", "Validate", "Act"],
    tags: ["Python", "FastAPI", "RabbitMQ", "OCR (TrOCR)", "Claude AI", "Gemini"],
    visual: "ai",
  },
];

// Icon slugs from src/data/icons.tsx, shown as the 3D tech-stack balls.
export const techStack = [
  "python", "pandas", "numpy", "scikitlearn", "django", "fastapi", "flask", "jupyter",
  "pytorch", "huggingface", "opencv", "excel", "powerbi", "powerautomate", "sqlserver",
  "postgresql", "mysql", "rabbitmq", "selenium", "claude", "googlegemini", "nodedotjs", "git",
] as const;

/** Animated monitor screens, drawn in src/components/ProjectScreens.tsx. */
export type ScreenKind = "check" | "ocr" | "sbr" | "ar" | "weekly" | "booking" | "leads";

export type Project = {
  title: string;
  summary: string;
  tools: string[];
  /** Screenshot shown on the curved monitor, e.g. "/projects/check-posting.webp" (put files in public/projects). */
  image?: string;
  /** Ambient light colour behind the monitor. */
  glow: string;
  /** Short label shown above the title. */
  category: string;
  /** Animated screen shown on the monitor until `image` is set (see src/components/ProjectScreens.tsx). */
  screen: ScreenKind;
};

export const projects: Project[] = [
  {
    title: "AI Check Posting Automation",
    summary: "An automated document-processing workflow that uses OCR to extract patient and payment details from uploaded documents, validates them against the company database and updates patient records.",
    tools: ["Python", "FastAPI", "OCR Model", "RabbitMQ", "Claude AI", "Antigravity"],
    glow: "#ff4a1c",
    category: "Document AI",
    screen: "check",
  },
  {
    title: "OCR Document Reading Model",
    summary: "Fine-tuned Microsoft's TrOCR on company-specific documents to improve automated document reading and information extraction.",
    tools: ["Python", "Microsoft TrOCR", "Claude AI", "Antigravity"],
    glow: "#6f8cff",
    category: "Machine Learning",
    screen: "ocr",
  },
  {
    title: "SBR Operational Report Automation",
    summary: "Automated the weekly SBR report used across operations for 22 providers, applying business logic and validations across multiple datasets.",
    tools: ["Python", "Excel", "Claude AI", "Antigravity"],
    glow: "#2fd4a3",
    category: "Report Automation",
    screen: "sbr",
  },
  {
    title: "AR Reports Automation Workflow",
    summary: "A workflow that downloads, formats and consolidates daily Accounts Receivable reports from multiple company portals, with less manual work and fewer errors.",
    tools: ["Power Automate", "Python", "VBScript", "Excel", "Claude AI", "Antigravity"],
    glow: "#b36bff",
    category: "Workflow Automation",
    screen: "ar",
  },
  {
    title: "Client Weekly Report Automation",
    summary: "Automated a weekly financial client report built from multiple data sources, implementing the business rules and calculations to generate a structured report.",
    tools: ["Python", "Excel", "Claude AI", "Antigravity"],
    glow: "#ffb020",
    category: "Financial Reporting",
    screen: "weekly",
  },
  {
    title: "Maidan: Sports Facility Financial & Booking Automation",
    summary: "A reporting web app for a sports facility that automates bookings, financial tracking, revenue monitoring and operational reporting.",
    tools: ["React", "Node.js", "PostgreSQL", "Google Gemini", "Claude AI", "Antigravity"],
    glow: "#3ddc84",
    category: "Web App",
    screen: "booking",
  },
  {
    title: "Lead Scraper & Cold Email Marketing Software",
    summary: "A lead-generation tool that scrapes and organises prospect data, then runs personalised cold-email outreach campaigns from one place.",
    tools: ["Python", "Web Scraping", "Email Automation"],
    glow: "#ff5da2",
    category: "Growth Automation",
    screen: "leads",
  },
];

export type Testimonial = {
  /** *text* is highlighted, like the About headline. Keep it short and in plain words. */
  quote: string;
  name: string;
  role: string;
  company: string;
  photo: string; // square image in public/testimonials, shown as a circle
  project: string; // project title from `projects`, shown as a chip linking to Work
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ali is very professional. He helped me *shape my business idea* into a clear plan, sent proper proposals and gave honest advice: *focus on what matters and keep the scope small.* That made the whole project simple and clear.",
    name: "Burhanuddin Mustafa",
    role: "CEO",
    company: "Finaccsol",
    photo: "/testimonials/burhanuddin.webp",
    project: "Lead Scraper & Cold Email Marketing Software",
  },
];

export const experience = [
  { role: "AI Automation Engineer", company: "Appedology", period: "Nov 2025 to Present", note: "AI & data-driven automation for operations" },
  { role: "Data Science Intern", company: "10Pearls", period: "Sep to Nov 2025", note: "Preprocessing, model training & evaluation" },
  { role: "Data Analyst Intern", company: "Systems Limited", period: "May to Aug 2025", note: "SQL, ETL / SSIS and Power BI dashboards" },
];
