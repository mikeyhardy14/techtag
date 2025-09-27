'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import Hero from '@/components/Hero/Hero';
import HowItWorksSection from '@/components/HowItWorksSection/HowItWorksSection';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to their dashboard
    if (!loading && user) {
      const username = user.email?.split('@')[0] || 'user';
      router.push(`/u/${username}/dashboard`);
    }
  }, [user, loading, router]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be added later
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.1rem',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  // If user is authenticated, don't render the homepage (redirect is in progress)
  if (user) {
    return null;
  }

  return (
    <>
      
      <main className="main-content">
        <Hero />

        {/* About Us Section */}
        <section className="about-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">About TechTag</h2>
              <p className="section-description">
                TechTag is the industry's leading HVAC nomenclature decoder, trusted by professionals worldwide. 
                With years of experience and cutting-edge technology, we provide accurate, fast, and reliable 
                model number breakdowns for thousands of HVAC systems.
              </p>
            </div>
            <div className="about-visual">
              <div className="placeholder-image">
                <div className="placeholder-content">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--tech-blue)"/>
                  </svg>
                  <p>Professional Team Photo</p>
                  <span>Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Our Services Section */}
        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Services</h2>
              <p className="section-description">
                Comprehensive HVAC solutions for professionals and businesses
              </p>
            </div>
            
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">🔍</div>
                <h3 className="service-title">Model Number Decoding</h3>
                <p className="service-description">
                  Instant breakdown of any HVAC model number with detailed specifications, 
                  capacity ratings, and technical features.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">📊</div>
                <h3 className="service-title">Batch Processing</h3>
                <p className="service-description">
                  Upload multiple model numbers at once for bulk processing. 
                  Perfect for contractors and facility managers.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">🏢</div>
                <h3 className="service-title">Enterprise Solutions</h3>
                <p className="service-description">
                  Custom API integration and enterprise-grade solutions for 
                  large organizations and software developers.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">📚</div>
                <h3 className="service-title">Database Access</h3>
                <p className="service-description">
                  Access our comprehensive database of HVAC nomenclature patterns 
                  and manufacturer specifications.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">🎓</div>
                <h3 className="service-title">Training & Support</h3>
                <p className="service-description">
                  Professional training sessions and dedicated support for 
                  teams looking to maximize their HVAC knowledge.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">📱</div>
                <h3 className="service-title">Mobile App</h3>
                <p className="service-description">
                  Decode model numbers on-the-go with our mobile application. 
                  Available for iOS and Android devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="contact-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-description">
                Ready to get started? Have questions? We'd love to hear from you.
              </p>
            </div>
            
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <h3>Email</h3>
                    <p>support@techtag.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <h3>Phone</h3>
                    <p>1-800-TECHTAG</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">🏢</div>
                  <div className="contact-details">
                    <h3>Office</h3>
                    <p>
                      123 Tech Street<br />
                      Silicon Valley, CA 94000
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="your.email@company.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell us more about your needs..."
                    />
                  </div>
                  
                  <button type="submit" className="submit-button">
                    <span>Send Message</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor"/>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <h4>TechTag</h4>
                <p>
                  The industry's leading HVAC nomenclature decoder. 
                  Fast, accurate, and reliable model number breakdowns.
                </p>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/decode">Decode Now</a></li>
                <li><a href="/history">History</a></li>
                <li><a href="/subscribe">Pricing</a></li>
                <li><a href="/login">Sign In</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul className="footer-links">
                <li>support@techtag.com</li>
                <li>1-800-TECHTAG</li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#docs">Documentation</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TechTag. All rights reserved.</p>
            <div className="footer-badges">
              <span className="badge">Industry Leading</span>
              <span className="badge">ISO Certified</span>
              <span className="badge">24/7 Support</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .main-content {
          font-family: var(--font-family-primary);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Section Styles */
        .about-section,
        .services-section {
          padding: 120px 0;
          background: var(--surface);
        }

        .contact-section {
          padding: 120px 0;
          background: var(--gray-50);
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 24px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .section-description {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 0;
        }

        /* About Section */
        .about-visual {
          display: flex;
          justify-content: center;
          margin-top: 60px;
        }

        .placeholder-image {
          width: 100%;
          max-width: 600px;
          height: 400px;
          background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-50) 100%);
          border-radius: var(--radius-2xl);
          border: 2px dashed var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-normal);
        }

        .placeholder-image:hover {
          border-color: var(--tech-blue);
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .placeholder-content {
          text-align: center;
          color: var(--text-muted);
        }

        .placeholder-content p {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 16px 0 8px 0;
          color: var(--text-secondary);
        }

        .placeholder-content span {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        /* Services Section */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
        }

        .service-card {
          background: var(--surface);
          padding: 40px 32px;
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border);
          text-align: center;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, var(--tech-blue) 0%, var(--tech-indigo) 100%);
          transform: scaleX(0);
          transition: transform var(--transition-normal);
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: var(--tech-blue);
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-icon {
          font-size: 3.5rem;
          margin-bottom: 24px;
          line-height: 1;
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .service-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Contact Section */
        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px;
          align-items: start;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 24px;
          background: var(--surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          transition: all var(--transition-normal);
        }

        .contact-item:hover {
          border-color: var(--tech-blue);
          box-shadow: var(--shadow-md);
        }

        .contact-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--tech-blue) 0%, var(--tech-indigo) 100%);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-details h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .contact-details p {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        /* Contact Form */
        .contact-form-container {
          background: var(--surface);
          padding: 48px;
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea {
          padding: 16px 20px;
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          font-size: 1rem;
          font-family: inherit;
          background: var(--surface);
          color: var(--text-primary);
          transition: all var(--transition-normal);
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--tech-blue);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-muted);
        }

        .submit-button {
          background: linear-gradient(135deg, var(--tech-blue) 0%, var(--tech-indigo) 100%);
          color: white;
          border: none;
          padding: 20px 32px;
          border-radius: var(--radius-lg);
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
          background: linear-gradient(135deg, var(--tech-blue-hover) 0%, var(--tech-blue) 100%);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        /* Footer */
        .footer {
          background: var(--gray-900);
          color: white;
          padding: 80px 0 0 0;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr);
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-section h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 24px;
          color: white;
        }

        .footer-brand p {
          color: var(--gray-400);
          line-height: 1.6;
          margin: 0;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          color: var(--gray-400);
          text-decoration: none;
          transition: color var(--transition-normal);
        }

        .footer-links a:hover {
          color: var(--tech-blue);
        }

        .footer-links li:not(:has(a)) {
          color: var(--gray-400);
        }

        .footer-bottom {
          border-top: 1px solid var(--gray-700);
          padding: 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footer-bottom p {
          color: var(--gray-400);
          margin: 0;
        }

        .footer-badges {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .badge {
          background: var(--gray-800);
          color: var(--gray-300);
          padding: 8px 16px;
          border-radius: var(--radius-lg);
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid var(--gray-700);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .footer-content {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .about-section,
          .services-section,
          .contact-section {
            padding: 80px 0;
          }

          .container {
            padding: 0 16px;
          }

          .section-header {
            margin-bottom: 60px;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .service-card {
            padding: 32px 24px;
          }

          .contact-form-container {
            padding: 32px 24px;
          }

          .contact-info {
            gap: 24px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            padding: 24px 20px;
          }

          .contact-form-container {
            padding: 24px 20px;
          }

          .submit-button {
            padding: 16px 24px;
          }
        }
      `}</style>
    </>
  );
}
