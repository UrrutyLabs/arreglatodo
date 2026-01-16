"use client";

import { ContactScreen } from "@/screens/contact/ContactScreen";
import { Navigation } from "@/components/presentational/Navigation";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navigation showLogin={true} showProfile={true} />
      <ContactScreen />
    </div>
  );
}
