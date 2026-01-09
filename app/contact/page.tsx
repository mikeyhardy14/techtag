'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGrid}></div>
          <div className={styles.heroGradient}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Contact Us</span>
            <h1 className={styles.heroTitle}>Let's Start a Conversation</h1>
            <p className={styles.heroDescription}>
              Have questions about TechTag? Looking for enterprise solutions? 
              Our team is here to help you decode success.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Contact Info Side */}
            <div className={styles.infoColumn}>
              <div className={styles.infoHeader}>
                <h2>Get in Touch</h2>
                <p>Choose the best way to reach us. We typically respond within 24 hours.</p>
              </div>

              <div className={styles.contactCards}>
                <div className={styles.contactCard}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <h3>Email Us</h3>
                    <p>For general inquiries and support</p>
                    <a href="mailto:support@techtag.com" className={styles.cardLink}>support@techtag.com</a>
                  </div>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <h3>Call Us</h3>
                    <p>Mon-Fri, 9AM-6PM EST</p>
                    <a href="tel:1-800-TECHTAG" className={styles.cardLink}>1-800-TECHTAG</a>
                  </div>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className={styles.cardContent}>
                    <h3>Visit Us</h3>
                    <p>Our headquarters</p>
                    <span className={styles.cardAddress}>123 Tech Street<br />Silicon Valley, CA 94000</span>
                  </div>
                </div>
              </div>

              {/* Enterprise CTA */}
              <div className={styles.enterpriseCta}>
                <div className={styles.ctaBadge}>Enterprise</div>
                <h3>Need a Custom Solution?</h3>
                <p>For API access, volume licensing, or custom integrations, our enterprise team is ready to help.</p>
                <a href="mailto:enterprise@techtag.com" className={styles.ctaButton}>
                  <span>Contact Enterprise Sales</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Form Side */}
            <div className={styles.formColumn}>
              <div className={styles.formContainer}>
                {submitted ? (
                  <div className={styles.successState}>
                    <div className={styles.successIcon}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3>Message Sent Successfully</h3>
                    <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    <button 
                      className={styles.resetButton}
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', company: '', subject: '', message: '' });
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.formHeader}>
                      <h2>Send Us a Message</h2>
                      <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.contactForm}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="name">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            placeholder="John Smith"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="email">Work Email</label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            placeholder="john@company.com"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="company">Company <span className={styles.optional}>(Optional)</span></label>
                          <input
                            type="text"
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Your company name"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="subject">Subject</label>
                          <select
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            required
                            disabled={isSubmitting}
                          >
                            <option value="">Select a topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="enterprise">Enterprise Solutions</option>
                            <option value="feedback">Product Feedback</option>
                            <option value="partnership">Partnership Opportunity</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          rows={6}
                          required
                          placeholder="Tell us how we can help you..."
                          disabled={isSubmitting}
                        />
                      </div>

                      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className={styles.spinner}></span>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
