'use client';

import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import HowItWorksSection from '@/components/HowItWorksSection/HowItWorksSection';

export default function HomePage() {
  return (
    <>
      <main style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        <Hero />

        {/* About Us Section */}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 16px',
            backgroundColor: 'var(--white)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>About Us</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-gray)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
              TechTag is the industry's leading HVAC nomenclature decoder, trusted by professionals worldwide. 
              With years of experience and cutting-edge technology, we provide accurate, fast, and reliable 
              model number breakdowns for thousands of HVAC systems.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img 
              src="/images/about-us-team.jpg" 
              alt="Our team at TechTag" 
              style={{ 
                maxWidth: '100%', 
                height: '400px', 
                objectFit: 'cover', 
                borderRadius: '12px',
                boxShadow: 'var(--shadow-strong)'
              }} 
            />
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Our Services Section */}
        <section
            style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 16px',
              backgroundColor: 'var(--white)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Our Services</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-gray)', maxWidth: '600px', margin: '0 auto' }}>
              Comprehensive HVAC solutions for professionals and businesses
            </p>
          </div>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
            }}
          >
            <div
              style={{
              backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-neumorphic)',
                border: '1px solid var(--medium-gray)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
            }}
          >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Model Number Decoding</h3>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.6' }}>
                Instant breakdown of any HVAC model number with detailed specifications, 
                capacity ratings, and technical features.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-neumorphic)',
                border: '1px solid var(--medium-gray)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Batch Processing</h3>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.6' }}>
                Upload multiple model numbers at once for bulk processing. 
                Perfect for contractors and facility managers.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-neumorphic)',
                border: '1px solid var(--medium-gray)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏢</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Enterprise Solutions</h3>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.6' }}>
                Custom API integration and enterprise-grade solutions for 
                large organizations and software developers.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-neumorphic)',
                border: '1px solid var(--medium-gray)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Database Access</h3>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.6' }}>
                Access our comprehensive database of HVAC nomenclature patterns 
                and manufacturer specifications.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-neumorphic)',
                border: '1px solid var(--medium-gray)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎓</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Training & Support</h3>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.6' }}>
                Professional training sessions and dedicated support for 
                teams looking to maximize their HVAC knowledge.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-neumorphic)',
                border: '1px solid var(--medium-gray)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📱</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Mobile App</h3>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.6' }}>
                Decode model numbers on-the-go with our mobile application. 
                Available for iOS and Android devices.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section
          style={{
            backgroundColor: 'var(--light-gray)',
            padding: '80px 16px',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--darker-gray)' }}>Contact Us</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-gray)' }}>
                Ready to get started? Have questions? We'd love to hear from you.
              </p>
            </div>
            
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '40px',
                marginBottom: '50px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📧</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--darker-gray)' }}>Email</h3>
                <p style={{ color: 'var(--text-gray)' }}>support@techtag.com</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📞</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--darker-gray)' }}>Phone</h3>
                <p style={{ color: 'var(--text-gray)' }}>1-800-TECHTAG</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--darker-gray)' }}>Office</h3>
                <p style={{ color: 'var(--text-gray)' }}>
                  123 Tech Street<br />
                  Silicon Valley, CA 94000
                </p>
              </div>
            </div>

            {/* Contact Form */}
          <div
            style={{
              backgroundColor: 'var(--white)',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-neumorphic)',
              }}
            >
              <form>
                <div style={{ marginBottom: '20px' }}>
                  <label 
                    htmlFor="name" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500', 
                      color: 'var(--dark-gray)' 
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid var(--input-border)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label 
                    htmlFor="email" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500', 
                      color: 'var(--dark-gray)' 
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid var(--input-border)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label 
                    htmlFor="subject" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500', 
                      color: 'var(--dark-gray)' 
                    }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid var(--input-border)',
              borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
            }}
                  />
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                  <label 
                    htmlFor="message" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500', 
                      color: 'var(--dark-gray)' 
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid var(--input-border)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--primary-blue-gradient)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-light)',
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, var(--primary-blue-hover) 0%, var(--primary-blue) 100%)';
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    (e.target as HTMLButtonElement).style.boxShadow = 'var(--shadow-medium)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'var(--primary-blue-gradient)';
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = 'var(--shadow-light)';
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'var(--darkest-gray)',
          color: 'var(--white)',
          textAlign: 'center',
          padding: '40px 16px',
          fontSize: '0.9rem',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px',
              marginBottom: '30px',
              textAlign: 'left',
            }}
          >
            <div>
              <h4 style={{ marginBottom: '16px', color: 'var(--white)' }}>TechTag</h4>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.6' }}>
                The industry's leading HVAC nomenclature decoder. 
                Fast, accurate, and reliable model number breakdowns.
              </p>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '16px', color: 'var(--white)' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/decode" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Decode Now</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/history" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }}>History</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/subscribe" style={{ color: 'var(--text-gray)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Pricing</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '16px', color: 'var(--white)' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-gray)' }}>support@techtag.com</span>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-gray)' }}>1-800-TECHTAG</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div
            style={{
              borderTop: '1px solid var(--dark-gray)',
              paddingTop: '20px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: 'var(--text-gray)' }}>
              &copy; {new Date().getFullYear()} TechTag. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
