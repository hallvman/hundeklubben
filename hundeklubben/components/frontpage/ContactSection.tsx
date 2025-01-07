import React from "react";
import { ContactForm } from "./contact-form";

function ContactSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Contact Us</h3>
        <p className="mb-8 text-center">Ingress</p>
        <div className="max-w-md mx-auto">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
