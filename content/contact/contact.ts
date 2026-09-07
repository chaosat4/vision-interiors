export type ContactChoice = {
  value: string;
  label: string;
  hint: string;
};

export type ContactFieldType = "text" | "email" | "tel" | "textarea";

export type ContactField = {
  name: string;
  label: string;
  type: ContactFieldType;
  placeholder: string;
  required: boolean;
  maxLength: number;
  autoComplete?: string;
};

type ContactStepBase = {
  slug: string;
  eyebrow: string;
  question: string;
  helper: string;
};

export type ContactStep =
  | (ContactStepBase & { kind: "choice"; choices: ContactChoice[] })
  | (ContactStepBase & { kind: "fields"; fields: ContactField[] });

export type ContactStudioDetail = {
  slug: string;
  label: string;
  value: string;
  href?: string;
};

export type ContactContent = {
  meta: {
    title: string;
    description: string;
  };
  steps: ContactStep[];
  review: {
    eyebrow: string;
    question: string;
    helper: string;
    submitLabel: string;
    submittingLabel: string;
    editLabel: string;
    emptyValue: string;
  };
  success: {
    eyebrow: string;
    heading: string;
    description: string;
    resetLabel: string;
    homeLabel: string;
  };
  errors: {
    submitFailed: string;
    retryLabel: string;
  };
  navigation: {
    backLabel: string;
    continueLabel: string;
    homeLabel: string;
  };
  studio: {
    details: ContactStudioDetail[];
  };
};

export const contactContent: ContactContent = {
  meta: {
    title: "Contact | Vision Interiors",
    description:
      "Share your project brief with Vision Interiors — an architecture and interior design studio shaping homes, workplaces, and hospitality spaces.",
  },
  steps: [
    {
      slug: "project-type",
      eyebrow: "The Brief",
      kind: "choice",
      question: "What kind of space are we shaping?",
      helper: "Choose the closest fit. We can refine the detail together later.",
      choices: [
        {
          value: "residence",
          label: "Residence",
          hint: "Villas, apartments, and family homes",
        },
        {
          value: "hospitality",
          label: "Hospitality",
          hint: "Hotels, restaurants, and lounges",
        },
        {
          value: "workplace",
          label: "Workplace",
          hint: "Studios, offices, and retail",
        },
        {
          value: "other",
          label: "Something Else",
          hint: "Tell us more in your message",
        },
      ],
    },
    {
      slug: "scope",
      eyebrow: "The Scope",
      kind: "choice",
      question: "How much of it should we take on?",
      helper: "This shapes the team we assemble and how we phase the work.",
      choices: [
        {
          value: "full-interior",
          label: "Full Interior",
          hint: "Concept through to final styling",
        },
        {
          value: "renovation",
          label: "Renovation",
          hint: "Reworking an existing space",
        },
        {
          value: "styling",
          label: "Styling & Furnishing",
          hint: "Materials, furniture, and finishes",
        },
        {
          value: "consultation",
          label: "Consultation",
          hint: "Direction and design guidance",
        },
      ],
    },
    {
      slug: "investment",
      eyebrow: "The Range",
      kind: "choice",
      question: "What's your investment range?",
      helper:
        "An approximate range is enough. It helps us propose something realistic from the first meeting.",
      choices: [
        { value: "under-15", label: "Under ₹15 Lakh", hint: "Focused scope" },
        { value: "15-40", label: "₹15 – 40 Lakh", hint: "Most residences" },
        { value: "40-100", label: "₹40 Lakh – 1 Crore", hint: "Full turnkey" },
        { value: "above-100", label: "Above ₹1 Crore", hint: "Large or multi-site" },
        { value: "unsure", label: "Not Sure Yet", hint: "We can guide you" },
      ],
    },
    {
      slug: "timeline",
      eyebrow: "The Timing",
      kind: "choice",
      question: "When would you like to begin?",
      helper: "We typically book design starts four to six weeks ahead.",
      choices: [
        { value: "ready", label: "Ready To Start", hint: "Site is available now" },
        { value: "3-months", label: "Within 3 Months", hint: "Planning ahead" },
        { value: "6-months", label: "3 – 6 Months", hint: "Early stage" },
        { value: "exploring", label: "Just Exploring", hint: "Gathering direction" },
      ],
    },
    {
      slug: "details",
      eyebrow: "The Introduction",
      kind: "fields",
      question: "How do we reach you?",
      helper: "We reply to every enquiry within two working days.",
      fields: [
        {
          name: "name",
          label: "Your Name",
          type: "text",
          placeholder: "Ananya Rao",
          required: true,
          maxLength: 80,
          autoComplete: "name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
          required: true,
          maxLength: 160,
          autoComplete: "email",
        },
        {
          name: "phone",
          label: "Phone (optional)",
          type: "tel",
          placeholder: "+91 98765 43210",
          required: false,
          maxLength: 32,
          autoComplete: "tel",
        },
        {
          name: "location",
          label: "Project Location (optional)",
          type: "text",
          placeholder: "Jubilee Hills, Hyderabad",
          required: false,
          maxLength: 120,
          autoComplete: "address-level2",
        },
        {
          name: "message",
          label: "Anything else we should know? (optional)",
          type: "textarea",
          placeholder:
            "Tell us about the site, how you want the space to feel, or anything already decided.",
          required: false,
          maxLength: 1200,
        },
      ],
    },
  ],
  review: {
    eyebrow: "The Summary",
    question: "Does this look right?",
    helper: "Review your brief before sending. You can revisit any step.",
    submitLabel: "Send Brief",
    submittingLabel: "Sending",
    editLabel: "Edit",
    emptyValue: "Not provided",
  },
  success: {
    eyebrow: "Received",
    heading: "Thank You. Your Brief Is With Us.",
    description:
      "One of our designers will read it personally and reply within two working days. In the meantime, feel free to keep exploring our recent work.",
    resetLabel: "Send Another Brief",
    homeLabel: "Back To Home",
  },
  errors: {
    submitFailed:
      "We could not send your brief just now. Please try again, or email us directly at studio@visioninteriors.in.",
    retryLabel: "Try Again",
  },
  navigation: {
    backLabel: "Back",
    continueLabel: "Continue",
    homeLabel: "Back To Home",
  },
  studio: {
    details: [
      {
        slug: "address",
        label: "Address",
        value: "4th Floor, Cyber Heights, Road No. 2, Banjara Hills, Hyderabad 500034",
      },
      {
        slug: "email",
        label: "Email",
        value: "studio@visioninteriors.in",
        href: "mailto:studio@visioninteriors.in",
      },
      {
        slug: "phone",
        label: "Phone",
        value: "+91 40 4855 2100",
        href: "tel:+914048552100",
      },
      {
        slug: "hours",
        label: "Hours",
        value: "Monday to Saturday, 10:00am – 6:30pm IST",
      },
    ],
  },
};
