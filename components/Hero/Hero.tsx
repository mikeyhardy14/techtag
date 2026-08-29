'use client';

import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.5;
    }
  }, []);

  return (
    <section className={styles.hero}>
      {/* Video - Background texture */}
      <video 
        ref={videoRef}
        className={styles.backgroundVideo}
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto"
      >
        <source src="/videos/hvac-background.mp4" type="video/mp4" />
        <source src="/videos/hvac-background.mov" type="video/quicktime" />
      </video>
      
      <div className={styles.overlay}></div>
      <div className={styles.gradientOverlay}></div>
      
      {/* Content */}
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Enterprise HVAC Intelligence
        </div>
        
        <h1 className={styles.title}>
          The Industry Standard for <span className={styles.titleAccent}>HVAC Nomenclature</span> Intelligence
        </h1>
        
        <p className={styles.subtitle}>
          Decode commercial water-source heat pump model numbers instantly. Trusted by HVAC professionals, contractors, and enterprise teams worldwide.
        </p>
        
        {/* Actions */}
        <div className={styles.actions}>
          <a href="/decode" className={styles.primaryButton}>
            <span>Start Decoding</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          
          <a href="/signup" className={styles.secondaryButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create Free Account
          </a>
        </div>
        
        {/* Enterprise Trust indicators */}
        <div className={styles.trustBar}>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
            </svg>
            10,000+ Models
          </span>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
            </svg>
            50+ Manufacturers
          </span>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
            </svg>
            Enterprise Ready
          </span>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Free to Use
          </span>
        </div>
      </div>
    </section>
  );
}
