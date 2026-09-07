"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ContactContent, ContactField } from "@/content/contact/contact";

import styles from "./ContactExperience.module.css";

const AUTO_ADVANCE_DELAY = 380;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type ContactExperienceProps = {
  content: ContactContent;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function validateField(field: ContactField, rawValue: string): string | null {
  const value = rawValue.trim();

  if (field.required && !value) {
    return `${field.label} is required.`;
  }

  if (value.length > field.maxLength) {
    return `${field.label} is too long.`;
  }

  if (field.type === "email" && value && !EMAIL_PATTERN.test(value)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export default function ContactExperience({ content }: ContactExperienceProps) {
  const totalSteps = content.steps.length;
  const reviewIndex = totalSteps;

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [returnToReview, setReturnToReview] = useState(false);

  const advanceTimerRef = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastFocusedKeyRef = useRef<string | null>(null);

  const isReview = stepIndex === reviewIndex;
  const activeStep = isReview ? null : content.steps[stepIndex];
  const isSuccess = status === "success";

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAdvanceTimer();
    };
  }, [clearAdvanceTimer]);

  // Move focus to the new question so keyboard and screen-reader users follow
  // the change. Keyed on the actual step so the first paint never steals focus,
  // including under StrictMode's double-invoked effects.
  useEffect(() => {
    const key = `${stepIndex}:${status}`;

    if (lastFocusedKeyRef.current === key) {
      return;
    }

    const isInitial = lastFocusedKeyRef.current === null;
    lastFocusedKeyRef.current = key;

    if (!isInitial) {
      headingRef.current?.focus();
    }
  }, [stepIndex, status]);

  const goToStep = useCallback(
    (nextIndex: number) => {
      clearAdvanceTimer();
      setStepIndex(Math.max(0, Math.min(nextIndex, reviewIndex)));
    },
    [clearAdvanceTimer, reviewIndex],
  );

  const clearError = useCallback((key: string) => {
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const next = { ...current };
      delete next[key];

      return next;
    });
  }, []);

  const handleChoice = useCallback(
    (slug: string, value: string) => {
      setAnswers((current) => ({ ...current, [slug]: value }));
      clearError(slug);

      const destination = returnToReview ? reviewIndex : stepIndex + 1;
      setReturnToReview(false);
      clearAdvanceTimer();

      if (prefersReducedMotion()) {
        goToStep(destination);
        return;
      }

      advanceTimerRef.current = window.setTimeout(() => {
        advanceTimerRef.current = null;
        goToStep(destination);
      }, AUTO_ADVANCE_DELAY);
    },
    [clearAdvanceTimer, clearError, goToStep, returnToReview, reviewIndex, stepIndex],
  );

  const handleFieldChange = useCallback(
    (name: string, value: string) => {
      setAnswers((current) => ({ ...current, [name]: value }));
      clearError(name);
    },
    [clearError],
  );

  const validateActiveStep = useCallback((): boolean => {
    if (!activeStep) {
      return true;
    }

    if (activeStep.kind === "choice") {
      if (!answers[activeStep.slug]) {
        setFieldErrors((current) => ({
          ...current,
          [activeStep.slug]: "Please choose an option.",
        }));

        return false;
      }

      return true;
    }

    const nextErrors: Record<string, string> = {};

    for (const field of activeStep.fields) {
      const error = validateField(field, answers[field.name] ?? "");

      if (error) {
        nextErrors[field.name] = error;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...nextErrors }));

      return false;
    }

    return true;
  }, [activeStep, answers]);

  const handleContinue = useCallback(() => {
    if (!validateActiveStep()) {
      return;
    }

    const destination = returnToReview ? reviewIndex : stepIndex + 1;
    setReturnToReview(false);
    goToStep(destination);
  }, [goToStep, returnToReview, reviewIndex, stepIndex, validateActiveStep]);

  const handleSubmit = useCallback(async () => {
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, company: honeypot }),
      });

      const data: unknown = await response.json().catch(() => null);
      const result =
        typeof data === "object" && data !== null
          ? (data as { ok?: boolean; errors?: Record<string, string> })
          : null;

      if (!response.ok || !result?.ok) {
        if (result?.errors && Object.keys(result.errors).length > 0) {
          setFieldErrors(result.errors);
          setStatus("idle");

          const firstBadStep = content.steps.findIndex((step) =>
            step.kind === "choice"
              ? Boolean(result.errors?.[step.slug])
              : step.fields.some((field) => Boolean(result.errors?.[field.name])),
          );

          setReturnToReview(true);
          goToStep(firstBadStep >= 0 ? firstBadStep : 0);
          return;
        }

        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [answers, content.steps, goToStep, honeypot]);

  const handleReset = useCallback(() => {
    clearAdvanceTimer();
    setAnswers({});
    setFieldErrors({});
    setHoneypot("");
    setReturnToReview(false);
    setStatus("idle");
    setStepIndex(0);
  }, [clearAdvanceTimer]);

  const summaryRows = useMemo(
    () =>
      content.steps.map((step, index) => {
        if (step.kind === "choice") {
          const selected = step.choices.find(
            (choice) => choice.value === answers[step.slug],
          );

          return {
            key: step.slug,
            index,
            label: step.eyebrow,
            question: step.question,
            entries: [
              {
                key: step.slug,
                label: step.question,
                value: selected?.label ?? content.review.emptyValue,
              },
            ],
          };
        }

        return {
          key: step.slug,
          index,
          label: step.eyebrow,
          question: step.question,
          entries: step.fields.map((field) => ({
            key: field.name,
            label: field.label,
            value: answers[field.name]?.trim() || content.review.emptyValue,
          })),
        };
      }),
    [answers, content.review.emptyValue, content.steps],
  );

  const atStart = stepIndex === 0 && !isSuccess;

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        {atStart || isSuccess ? (
          <Link className={styles.back} href="/">
            <span aria-hidden className={styles.backArrow}>
              ←
            </span>
            {content.navigation.homeLabel}
          </Link>
        ) : (
          <button
            className={styles.back}
            onClick={() => {
              setReturnToReview(false);
              goToStep(stepIndex - 1);
            }}
            type="button"
          >
            <span aria-hidden className={styles.backArrow}>
              ←
            </span>
            {content.navigation.backLabel}
          </button>
        )}
      </header>

      <main className={styles.main}>
        {isSuccess ? (
          <section className={styles.panel} key="success">
            <p className={styles.eyebrow}>{content.success.eyebrow}</p>

            <h1 className={styles.question} ref={headingRef} tabIndex={-1}>
              {content.success.heading}
            </h1>

            <p className={styles.helper}>{content.success.description}</p>

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={handleReset}
                type="button"
              >
                {content.success.resetLabel}
              </button>
            </div>
          </section>
        ) : (
          <section
            className={styles.panel}
            key={activeStep ? activeStep.slug : "review"}
          >
            <p className={styles.eyebrow}>
              {activeStep ? activeStep.eyebrow : content.review.eyebrow}
            </p>

            <h1 className={styles.question} ref={headingRef} tabIndex={-1}>
              {activeStep ? activeStep.question : content.review.question}
            </h1>

            <p className={styles.helper}>
              {activeStep ? activeStep.helper : content.review.helper}
            </p>

            {activeStep?.kind === "choice" ? (
              <>
                <fieldset className={styles.choiceGroup}>
                  <legend className={styles.srOnly}>{activeStep.question}</legend>

                  {activeStep.choices.map((choice) => (
                    <label
                      className={styles.choice}
                      data-selected={answers[activeStep.slug] === choice.value}
                      key={choice.value}
                    >
                      <input
                        checked={answers[activeStep.slug] === choice.value}
                        className={styles.choiceInput}
                        name={activeStep.slug}
                        onChange={() => {
                          handleChoice(activeStep.slug, choice.value);
                        }}
                        type="radio"
                        value={choice.value}
                      />

                      <span className={styles.choiceText}>
                        <span className={styles.choiceLabel}>{choice.label}</span>
                        <span className={styles.choiceHint}>{choice.hint}</span>
                      </span>

                      <span aria-hidden className={styles.choiceMark} />
                    </label>
                  ))}
                </fieldset>

                {fieldErrors[activeStep.slug] ? (
                  <p className={styles.error} role="alert">
                    {fieldErrors[activeStep.slug]}
                  </p>
                ) : null}
              </>
            ) : null}

            {activeStep?.kind === "fields" ? (
              <div className={styles.fieldGrid}>
                {activeStep.fields.map((field) => {
                  const errorId = `${field.name}-error`;
                  const error = fieldErrors[field.name];

                  return (
                    <div
                      className={styles.field}
                      data-wide={field.type === "textarea"}
                      key={field.name}
                    >
                      <label className={styles.fieldLabel} htmlFor={field.name}>
                        {field.label}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          aria-describedby={error ? errorId : undefined}
                          aria-invalid={Boolean(error)}
                          className={styles.textarea}
                          id={field.name}
                          maxLength={field.maxLength}
                          name={field.name}
                          onChange={(event) => {
                            handleFieldChange(field.name, event.target.value);
                          }}
                          placeholder={field.placeholder}
                          rows={3}
                          value={answers[field.name] ?? ""}
                        />
                      ) : (
                        <input
                          aria-describedby={error ? errorId : undefined}
                          aria-invalid={Boolean(error)}
                          autoComplete={field.autoComplete}
                          className={styles.input}
                          id={field.name}
                          maxLength={field.maxLength}
                          name={field.name}
                          onChange={(event) => {
                            handleFieldChange(field.name, event.target.value);
                          }}
                          placeholder={field.placeholder}
                          type={field.type}
                          value={answers[field.name] ?? ""}
                        />
                      )}

                      {error ? (
                        <p className={styles.error} id={errorId} role="alert">
                          {error}
                        </p>
                      ) : null}
                    </div>
                  );
                })}

                <label className={styles.honeypot}>
                  Company
                  <input
                    autoComplete="off"
                    name="company"
                    onChange={(event) => {
                      setHoneypot(event.target.value);
                    }}
                    tabIndex={-1}
                    type="text"
                    value={honeypot}
                  />
                </label>
              </div>
            ) : null}

            {isReview ? (
              <dl className={styles.summary}>
                {summaryRows.flatMap((row) =>
                  row.entries.map((entry) => (
                    <div className={styles.summaryRow} key={entry.key}>
                      <dt className={styles.summaryTerm}>{entry.label}</dt>

                      <dd className={styles.summaryValue}>
                        <span>{entry.value}</span>

                        <button
                          className={styles.summaryEdit}
                          onClick={() => {
                            setReturnToReview(true);
                            goToStep(row.index);
                          }}
                          type="button"
                        >
                          {content.review.editLabel}
                          <span className={styles.srOnly}> {row.question}</span>
                        </button>
                      </dd>
                    </div>
                  )),
                )}
              </dl>
            ) : null}

            {status === "error" ? (
              <p className={styles.error} role="alert">
                {content.errors.submitFailed}
              </p>
            ) : null}

            <div className={styles.actions}>
              {isReview ? (
                <button
                  className={styles.primaryButton}
                  disabled={status === "submitting"}
                  onClick={handleSubmit}
                  type="button"
                >
                  {status === "submitting"
                    ? content.review.submittingLabel
                    : status === "error"
                      ? content.errors.retryLabel
                      : content.review.submitLabel}
                </button>
              ) : (
                <button
                  className={styles.primaryButton}
                  onClick={handleContinue}
                  type="button"
                >
                  {content.navigation.continueLabel}
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className={styles.studio}>
        {content.studio.details.map((detail) =>
          detail.href ? (
            <a className={styles.studioItem} href={detail.href} key={detail.slug}>
              {detail.value}
            </a>
          ) : (
            <span className={styles.studioItem} key={detail.slug}>
              {detail.value}
            </span>
          ),
        )}
      </footer>
    </div>
  );
}
