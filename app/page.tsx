'use client';

import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';

export default function HomePage() {
  return (
    <>

      <main style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        <Hero />

        {/* Features Section */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            maxWidth: '960px',
            margin: '0 auto',
            padding: '40px 16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Fast Results</h3>
            <p style={{ color: '#555' }}>
              Get breakdowns in under a second for thousands of HVAC models.
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Accurate Data</h3>
            <p style={{ color: '#555' }}>
              Rely on public and proprietary sources to deliver precise nomenclature decoding.
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Secure &amp; Private</h3>
            <p style={{ color: '#555' }}>
              All queries are processed securely. No data is stored.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#222',
          color: '#fff',
          textAlign: 'center',
          padding: '24px 0',
          fontSize: '0.9rem',
        }}
      >
        <p>&copy; {new Date().getFullYear()} HVAC Decoder. All rights reserved.</p>
      </footer>
    </>
  );
}
