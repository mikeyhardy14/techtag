'use client';

import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Welcome to TechTag</h1>
      <p className={styles.subtitle}>
        Decode any HVAC model number in seconds. Get clear, accurate nomenclature breakdowns instantly.
      </p>
      <a href="/decode" className={styles.button}>
        Decode a Model Number
      </a>
    </section>
  );
}
