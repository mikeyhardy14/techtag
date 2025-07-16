'use client';

import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <video 
        className={styles.backgroundVideo}
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/videos/hvac-background.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
      </video>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Decode Any HVAC Model Number Instantly</h1>
        <p className={styles.subtitle}>
          Get clear, accurate nomenclature breakdowns in seconds with TechTag's industry-leading decoder.
        </p>
        <a href="/decode" className={styles.button}>
          Start Decoding
        </a>
      </div>
    </section>
  );
}
