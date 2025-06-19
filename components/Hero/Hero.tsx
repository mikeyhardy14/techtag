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
        <h1 className={styles.title}>Welcome to TechTag</h1>
        <p className={styles.subtitle}>
          Decode any HVAC model number in seconds. Get clear, accurate nomenclature breakdowns instantly.
        </p>
        <a href="/decode" className={styles.button}>
          Decode a Model Number
        </a>
      </div>
    </section>
  );
}
