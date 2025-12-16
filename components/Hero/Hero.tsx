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
          HVAC Model Decoder
        </div>
        
        <h1 className={styles.title}>
          Decode Any Model Number <span className={styles.titleAccent}>Instantly</span>
        </h1>
        
        <p className={styles.subtitle}>
          Get accurate nomenclature breakdowns in seconds with TechTag's industry-leading decoder.
        </p>
        
        {/* Actions */}
        <div className={styles.actions}>
          <a href="/decode" className={styles.primaryButton}>
            <span>Start Decoding</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          
          <a href="/login" className={styles.secondaryButton}>
            Sign In
          </a>
        </div>
        
        {/* Trust indicators */}
        <div className={styles.trustBar}>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            10,000+ Models
          </span>
          <span className={styles.trustItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            50+ Manufacturers
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
