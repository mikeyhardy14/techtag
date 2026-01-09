'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import Hero from '@/components/Hero/Hero';
import HowItWorksSection from '@/components/HowItWorksSection/HowItWorksSection';
import Footer from '@/components/Footer/Footer';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to the decoder
    if (!loading && user) {
      const username = user.email?.split('@')[0] || 'user';
      router.push(`/u/${username}/decode`);
    }
  }, [user, loading, router]);

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
        {/* <section className="about-section">
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
        </section> */}

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Our Services Section */}
        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Platform Capabilities</span>
              <h2 className="section-title">Built for HVAC Professionals</h2>
              <p className="section-description">
                Streamline your workflow with intelligent nomenclature decoding and comprehensive equipment insights
              </p>
            </div>
            
            <div className="services-grid">
              {/* Featured Service */}
              <div className="service-card service-card-featured">
                <div className="service-badge">Core Feature</div>
                <div className="service-icon-wrapper service-icon-primary">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="service-title">Intelligent Model Decoder</h3>
                <p className="service-description">
                  Instantly decode any HVAC model number with AI-powered analysis. Extract specifications, capacity ratings, refrigerant types, and technical features from nomenclature patterns across all major manufacturers.
                </p>
                <ul className="service-features">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    Multi-brand recognition
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    Detailed spec breakdown
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    Confidence scoring
                  </li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="service-title">Decode History</h3>
                <p className="service-description">
                  Every decode is automatically saved to your secure history. Search, filter, and reference past lookups instantly—no need to re-enter model numbers.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="service-title">Manufacturer Coverage</h3>
                <p className="service-description">
                  Comprehensive support for industry-leading brands including Carrier, Trane, Lennox, Goodman, Rheem, York, Daikin, and dozens more manufacturers.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="service-title">Secure & Private</h3>
                <p className="service-description">
                  Enterprise-grade security with encrypted data storage. Your equipment data and decode history remain confidential and protected.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon-wrapper">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="service-title">Customizable Profile</h3>
                <p className="service-description">
                  Personalize your experience with custom settings, notification preferences, and workspace configurations tailored to your workflow.
                </p>
              </div>

              <div className="service-card service-card-cta">
                <div className="service-icon-wrapper service-icon-accent">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="service-title">API Access</h3>
                <p className="service-description">
                  Integrate TechTag directly into your existing systems. RESTful API with comprehensive documentation for seamless automation.
                </p>
                <span className="service-coming-soon">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

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
        .section-eyebrow {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--tech-blue);
          margin-bottom: 16px;
          padding: 8px 16px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: var(--radius-lg);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .service-card {
          background: var(--surface);
          padding: 32px 28px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          text-align: left;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--tech-blue) 0%, var(--tech-indigo) 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-card-featured {
          grid-column: span 1;
          grid-row: span 2;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(99, 102, 241, 0.03) 100%);
          border-color: rgba(59, 130, 246, 0.2);
          padding: 40px 32px;
        }

        .service-card-featured::before {
          height: 4px;
          transform: scaleX(1);
          background: linear-gradient(90deg, var(--tech-blue) 0%, #8B5CF6 50%, var(--tech-indigo) 100%);
        }

        .service-card-featured .service-title {
          font-size: 1.5rem;
        }

        .service-card-featured .service-description {
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .service-card-cta {
          background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
          border-style: dashed;
        }

        .service-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: white;
          padding: 6px 12px;
          background: linear-gradient(135deg, var(--tech-blue) 0%, var(--tech-indigo) 100%);
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }

        .service-icon-wrapper {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-50) 100%);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .service-card:hover .service-icon-wrapper {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          color: var(--tech-blue);
        }

        .service-icon-primary {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--tech-blue) 0%, var(--tech-indigo) 100%);
          color: white;
        }

        .service-card-featured:hover .service-icon-primary {
          background: linear-gradient(135deg, var(--tech-blue) 0%, #8B5CF6 100%);
          color: white;
          transform: scale(1.05);
        }

        .service-icon-accent {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
          color: var(--tech-blue);
        }

        .service-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .service-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
          flex-grow: 1;
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 24px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .service-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .service-features li svg {
          color: var(--tech-blue);
          flex-shrink: 0;
        }

        .service-coming-soon {
          display: inline-block;
          margin-top: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          padding: 6px 14px;
          background: var(--gray-200);
          border-radius: var(--radius-md);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .service-card-featured {
            grid-column: span 2;
            grid-row: span 1;
          }
        }

        @media (max-width: 768px) {
          .about-section,
          .services-section {
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
            gap: 20px;
          }

          .service-card-featured {
            grid-column: span 1;
            grid-row: span 1;
            padding: 32px 24px;
          }

          .service-card-featured .service-title {
            font-size: 1.3rem;
          }

          .service-card-featured .service-description {
            font-size: 1rem;
          }

          .service-card {
            padding: 28px 24px;
          }

          .service-icon-primary {
            width: 56px;
            height: 56px;
          }
        }

        @media (max-width: 480px) {
          .service-card {
            padding: 24px 20px;
          }

          .service-card-featured {
            padding: 28px 20px;
          }

          .service-features {
            gap: 10px;
          }

          .service-features li {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}

