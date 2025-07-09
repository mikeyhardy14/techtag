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
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#333' }}>About Us</h2>
            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
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
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
              backgroundColor: '#ffffff',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#333' }}>Our Services</h2>
            <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
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
              backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                textAlign: 'center',
            }}
          >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>Model Number Decoding</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Instant breakdown of any HVAC model number with detailed specifications, 
                capacity ratings, and technical features.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>Batch Processing</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Upload multiple model numbers at once for bulk processing. 
                Perfect for contractors and facility managers.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏢</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>Enterprise Solutions</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Custom API integration and enterprise-grade solutions for 
                large organizations and software developers.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>Database Access</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Access our comprehensive database of HVAC nomenclature patterns 
                and manufacturer specifications.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎓</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>Training & Support</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Professional training sessions and dedicated support for 
                teams looking to maximize their HVAC knowledge.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📱</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#333' }}>Mobile App</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Decode model numbers on-the-go with our mobile application. 
                Available for iOS and Android devices.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section
          style={{
            backgroundColor: '#f8f9fa',
            padding: '80px 16px',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#333' }}>Contact Us</h2>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>
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
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#333' }}>Email</h3>
                <p style={{ color: '#666' }}>support@techtag.com</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📞</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#333' }}>Phone</h3>
                <p style={{ color: '#666' }}>1-800-TECHTAG</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#333' }}>Office</h3>
                <p style={{ color: '#666' }}>
                  123 Tech Street<br />
                  Silicon Valley, CA 94000
                </p>
              </div>
            </div>

            {/* Contact Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
                      color: '#333' 
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
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
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
                      color: '#333' 
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
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
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
                      color: '#333' 
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
                      border: '1px solid #ddd',
              borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
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
                      color: '#333' 
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
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#005bb5'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0070f3'}
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
          backgroundColor: '#222',
          color: '#fff',
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
              <h4 style={{ marginBottom: '16px', color: '#fff' }}>TechTag</h4>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                The industry's leading HVAC nomenclature decoder. 
                Fast, accurate, and reliable model number breakdowns.
              </p>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '16px', color: '#fff' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/decode" style={{ color: '#ccc', textDecoration: 'none' }}>Decode Now</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/history" style={{ color: '#ccc', textDecoration: 'none' }}>History</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/subscribe" style={{ color: '#ccc', textDecoration: 'none' }}>Pricing</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '16px', color: '#fff' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#ccc' }}>support@techtag.com</span>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#ccc' }}>1-800-TECHTAG</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div
            style={{
              borderTop: '1px solid #444',
              paddingTop: '20px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: '#ccc' }}>
              &copy; {new Date().getFullYear()} TechTag. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
