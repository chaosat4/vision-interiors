import { NextResponse } from "next/server";

import { contactContent } from "@/content/contact/contact";

/**
 * Contact brief intake.
 *
 * TODO: this handler validates and logs the brief but does not deliver it yet.
 * Wire an email provider (Resend, SendGrid, SES, ...) where `deliverBrief` is
 * called below, and move credentials into environment variables.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Record<string, string>;

type ChoiceStepSlug = "project-type" | "scope" | "investment" | "timeline";

const CHOICE_STEP_SLUGS: ChoiceStepSlug[] = [
  "project-type",
  "scope",
  "investment",
  "timeline",
];

function getAllowedChoices(slug: string): string[] {
  const step = contactContent.steps.find((item) => item.slug === slug);

  if (!step || step.kind !== "choice") {
    return [];
  }

  return step.choices.map((choice) => choice.value);
}

function getDetailFields() {
  const step = contactContent.steps.find((item) => item.kind === "fields");

  return step && step.kind === "fields" ? step.fields : [];
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request body." },
      { status: 400 },
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { ok: false, message: "Malformed request body." },
      { status: 400 },
    );
  }

  const body = payload as Record<string, unknown>;
  const errors: FieldErrors = {};

  // Honeypot: real users never fill this. Accept silently so bots see success.
  if (asTrimmedString(body.company).length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const choices: Record<string, string> = {};

  for (const slug of CHOICE_STEP_SLUGS) {
    const value = asTrimmedString(body[slug]);
    const allowed = getAllowedChoices(slug);

    if (!value) {
      errors[slug] = "Please choose an option.";
      continue;
    }

    if (!allowed.includes(value)) {
      errors[slug] = "That option is not recognised.";
      continue;
    }

    choices[slug] = value;
  }

  const details: Record<string, string> = {};

  for (const field of getDetailFields()) {
    const value = asTrimmedString(body[field.name]);

    if (field.required && !value) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }

    if (value.length > field.maxLength) {
      errors[field.name] = `${field.label} is too long.`;
      continue;
    }

    if (field.type === "email" && value && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = "Please enter a valid email address.";
      continue;
    }

    details[field.name] = value;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const brief = {
    receivedAt: new Date().toISOString(),
    ...choices,
    ...details,
  };

  // TODO: replace with real delivery (email provider / CRM webhook).
  console.info("[contact] brief received", brief);

  return NextResponse.json({ ok: true }, { status: 200 });
}
