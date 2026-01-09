'use client';

import React, { useState, useEffect } from 'react';
import styles from './HowItWorksSection.module.css';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Enter Your Model Number',
    description: 'Input any HVAC model number from the equipment nameplate. Our system recognizes formats from major manufacturers including Carrier, Trane, Lennox, and more.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    details: ['Paste from clipboard', 'Auto-format detection', 'Multi-brand support']
  },
  {
    id: 2,
    title: 'Intelligent Pattern Matching',
    description: 'Our decoder analyzes the nomenclature structure, matching each character position against manufacturer-specific encoding patterns.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
      </svg>
    ),
    details: ['Position-based decoding', 'Confidence scoring', 'Pattern recognition']
  },
  {
    id: 3,
    title: 'Complete Specifications',
    description: 'Receive a comprehensive breakdown of your equipment including capacity, voltage, efficiency ratings, configuration, and feature codes.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    details: ['Technical specs', 'Visual breakdown', 'Saved to history']
  }
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance through steps
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => prev >= steps.length ? 1 : prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>How It Works</span>
          <h2 className={styles.title}>Decode any model number in seconds</h2>
          <p className={styles.subtitle}>
            Three simple steps to unlock the complete specifications of your HVAC equipment
          </p>
        </div>

        {/* Steps Grid */}
        <div 
          className={styles.stepsGrid}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`${styles.stepCard} ${activeStep === step.id ? styles.stepCardActive : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              {/* Step Number Badge */}
              <div className={styles.stepBadge}>
                <span className={styles.stepNumber}>{step.id}</span>
              </div>

              {/* Icon */}
              <div className={styles.stepIcon}>
                {step.icon}
              </div>

              {/* Content */}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>

              {/* Details List */}
              <ul className={styles.stepDetails}>
                {step.details.map((detail, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>

              {/* Progress Indicator for Active Step */}
              {activeStep === step.id && !isPaused && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
