import React, { useState } from "react";
import "./connect-section.css";

interface JoinFormData {
  name: string;
  email: string;
  aboutYourself: string;
  whyJoin: string;
  whyHire: string;
}

interface ContactFormData {
  subject: string;
  description: string;
  contactEmail: string;
}

interface FormErrors {
  [key: string]: string;
}

// Reduced motion support reserved for future animation features

const ConnectSection: React.FC = () => {
  // const prefersReducedMotion = usePrefersReducedMotion(); // Reserved for future animation features
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const [joinFormData, setJoinFormData] = useState<JoinFormData>({
    name: "",
    email: "",
    aboutYourself: "",
    whyJoin: "",
    whyHire: ""
  });
  
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    subject: "",
    description: "",
    contactEmail: ""
  });
  
  const [joinErrors, setJoinErrors] = useState<FormErrors>({});
  const [contactErrors, setContactErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateJoinForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!joinFormData.name.trim()) errors.name = "Name is required";
    if (!joinFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(joinFormData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!joinFormData.aboutYourself.trim()) errors.aboutYourself = "Please tell us about yourself";
    if (!joinFormData.whyJoin.trim()) errors.whyJoin = "Please tell us why you want to join";
    if (!joinFormData.whyHire.trim()) errors.whyHire = "Please tell us why we should hire you";
    if (joinFormData.whyHire.length > 140) errors.whyHire = "Maximum 140 characters";
    
    setJoinErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateContactForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!contactFormData.subject.trim()) errors.subject = "Subject is required";
    if (!contactFormData.description.trim()) errors.description = "Description is required";
    if (!contactFormData.contactEmail.trim()) {
      errors.contactEmail = "Email is required";
    } else if (!validateEmail(contactFormData.contactEmail)) {
      errors.contactEmail = "Please enter a valid email";
    }
    
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateJoinForm()) {
      console.log("Join form data:", joinFormData);
      showToastMessage("Application saved locally — backend coming soon");
      // Reset form
      setJoinFormData({
        name: "",
        email: "",
        aboutYourself: "",
        whyJoin: "",
        whyHire: ""
      });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContactForm()) {
      console.log("Contact form data:", contactFormData);
      showToastMessage("Message saved locally — backend coming soon");
      // Reset form
      setContactFormData({
        subject: "",
        description: "",
        contactEmail: ""
      });
    }
  };

  const isJoinFormValid = () => {
    return joinFormData.name.trim() && 
           joinFormData.email.trim() && 
           validateEmail(joinFormData.email) &&
           joinFormData.aboutYourself.trim() && 
           joinFormData.whyJoin.trim() && 
           joinFormData.whyHire.trim() &&
           joinFormData.whyHire.length <= 140;
  };

  const isContactFormValid = () => {
    return contactFormData.subject.trim() && 
           contactFormData.description.trim() && 
           contactFormData.contactEmail.trim() && 
           validateEmail(contactFormData.contactEmail);
  };

  return (
    <section id="connect" className="connect-section">
      <div className="connect-section__inner">
        <div className="connect-cards">
          {/* Join Us Card */}
          <div className="connect-card">
            <div className="connect-card__header">
              <div className="connect-card__icon connect-card__icon--join">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" />
                </svg>
              </div>
              <h3>Join Us</h3>
            </div>
            
            <form onSubmit={handleJoinSubmit} className="connect-form">
              <div className="form-field">
                <input
                  type="text"
                  id="join-name"
                  value={joinFormData.name}
                  onChange={(e) => setJoinFormData({...joinFormData, name: e.target.value})}
                  className={joinErrors.name ? "error" : ""}
                  aria-invalid={!!joinErrors.name}
                  aria-describedby={joinErrors.name ? "join-name-error" : undefined}
                />
                <label htmlFor="join-name">Name</label>
                {joinErrors.name && <span id="join-name-error" className="error-text">{joinErrors.name}</span>}
              </div>

              <div className="form-field">
                <input
                  type="email"
                  id="join-email"
                  value={joinFormData.email}
                  onChange={(e) => setJoinFormData({...joinFormData, email: e.target.value})}
                  className={joinErrors.email ? "error" : ""}
                  aria-invalid={!!joinErrors.email}
                  aria-describedby={joinErrors.email ? "join-email-error" : undefined}
                />
                <label htmlFor="join-email">Email</label>
                {joinErrors.email && <span id="join-email-error" className="error-text">{joinErrors.email}</span>}
              </div>

              <div className="form-field">
                <textarea
                  id="join-about"
                  rows={4}
                  value={joinFormData.aboutYourself}
                  onChange={(e) => setJoinFormData({...joinFormData, aboutYourself: e.target.value})}
                  className={joinErrors.aboutYourself ? "error" : ""}
                  aria-invalid={!!joinErrors.aboutYourself}
                  aria-describedby={joinErrors.aboutYourself ? "join-about-error" : undefined}
                />
                <label htmlFor="join-about">Tell me about yourself</label>
                {joinErrors.aboutYourself && <span id="join-about-error" className="error-text">{joinErrors.aboutYourself}</span>}
              </div>

              <div className="form-field">
                <textarea
                  id="join-why"
                  rows={4}
                  value={joinFormData.whyJoin}
                  onChange={(e) => setJoinFormData({...joinFormData, whyJoin: e.target.value})}
                  className={joinErrors.whyJoin ? "error" : ""}
                  aria-invalid={!!joinErrors.whyJoin}
                  aria-describedby={joinErrors.whyJoin ? "join-why-error" : undefined}
                />
                <label htmlFor="join-why">Why do you want to join us?</label>
                {joinErrors.whyJoin && <span id="join-why-error" className="error-text">{joinErrors.whyJoin}</span>}
              </div>

              <div className="form-field">
                <input
                  type="text"
                  id="join-hire"
                  maxLength={140}
                  value={joinFormData.whyHire}
                  onChange={(e) => setJoinFormData({...joinFormData, whyHire: e.target.value})}
                  className={joinErrors.whyHire ? "error" : ""}
                  aria-invalid={!!joinErrors.whyHire}
                  aria-describedby={joinErrors.whyHire ? "join-hire-error" : "join-hire-counter"}
                />
                <label htmlFor="join-hire">Why should we hire you? (one line)</label>
                <div id="join-hire-counter" className="char-counter">
                  {joinFormData.whyHire.length}/140
                </div>
                {joinErrors.whyHire && <span id="join-hire-error" className="error-text">{joinErrors.whyHire}</span>}
              </div>

              <button 
                type="submit" 
                className="connect-submit"
                disabled={!isJoinFormValid()}
              >
                Submit Application
              </button>
            </form>
          </div>

          {/* Contact Us Card */}
          <div className="connect-card">
            <div className="connect-card__header">
              <div className="connect-card__icon connect-card__icon--contact">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3>Contact Us</h3>
            </div>
            
            <form onSubmit={handleContactSubmit} className="connect-form">
              <div className="form-field">
                <input
                  type="text"
                  id="contact-subject"
                  value={contactFormData.subject}
                  onChange={(e) => setContactFormData({...contactFormData, subject: e.target.value})}
                  className={contactErrors.subject ? "error" : ""}
                  aria-invalid={!!contactErrors.subject}
                  aria-describedby={contactErrors.subject ? "contact-subject-error" : undefined}
                />
                <label htmlFor="contact-subject">Subject</label>
                {contactErrors.subject && <span id="contact-subject-error" className="error-text">{contactErrors.subject}</span>}
              </div>

              <div className="form-field">
                <textarea
                  id="contact-description"
                  rows={6}
                  value={contactFormData.description}
                  onChange={(e) => setContactFormData({...contactFormData, description: e.target.value})}
                  className={contactErrors.description ? "error" : ""}
                  aria-invalid={!!contactErrors.description}
                  aria-describedby={contactErrors.description ? "contact-description-error" : undefined}
                />
                <label htmlFor="contact-description">Description</label>
                {contactErrors.description && <span id="contact-description-error" className="error-text">{contactErrors.description}</span>}
              </div>

              <div className="form-field">
                <input
                  type="email"
                  id="contact-email"
                  value={contactFormData.contactEmail}
                  onChange={(e) => setContactFormData({...contactFormData, contactEmail: e.target.value})}
                  className={contactErrors.contactEmail ? "error" : ""}
                  aria-invalid={!!contactErrors.contactEmail}
                  aria-describedby={contactErrors.contactEmail ? "contact-email-error" : undefined}
                />
                <label htmlFor="contact-email">Contact Email</label>
                {contactErrors.contactEmail && <span id="contact-email-error" className="error-text">{contactErrors.contactEmail}</span>}
              </div>

              <button 
                type="submit" 
                className="connect-submit"
                disabled={!isContactFormValid()}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`connect-toast ${showToast ? 'connect-toast--visible' : ''}`}>
          <div className="connect-toast__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};

export default ConnectSection;