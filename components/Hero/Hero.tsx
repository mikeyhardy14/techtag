'use client';

import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Set playback rate to half speed
      video.playbackRate = 0.75;
    }
  }, []);

  return (
    <section className={styles.hero}>
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
