import type { Metadata } from "next";

import ContactExperience from "@/components/pages/contact/ContactExperience";
import { contactContent } from "@/content/contact/contact";

export const metadata: Metadata = {
  title: contactContent.meta.title,
  description: contactContent.meta.description,
};

export default function ContactPage() {
  return <ContactExperience content={contactContent} />;
}
