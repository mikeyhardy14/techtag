'use client';

import React, { useState, useEffect } from 'react';
import styles from './HowItWorksSection.module.css';

interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Enter Model Number',
    description: 'Simply type or paste your HVAC model number into our decoder field. We support thousands of different manufacturers and model formats.',
    image: '/images/step1-input.jpg',
    alt: 'Step 1: Enter model number'
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'Our advanced AI system analyzes the model number using our comprehensive database of HVAC nomenclature patterns and manufacturer specifications.',
    image: '/images/step2-process.jpg',
    alt: 'Step 2: AI processes data'
  },
  {
    id: 3,
    title: 'Get Results',
    description: 'Receive a detailed breakdown including capacity, efficiency ratings, features, and technical specifications in under a second.',
    image: '/images/step3-results.jpg',
    alt: 'Step 3: Get detailed results'
  }
];

export default function HowItWorksSection() {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const currentStep = steps.find(step => step.id === selectedStep) || steps[0];

  // Auto-advance functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setSelectedStep(prev => {
          const nextStep = prev >= steps.length ? 1 : prev + 1;
          return nextStep;
        });
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleBubble}>
            How It Works
          </div>
          <h2 className={styles.subtitle}>
            Get your HVAC model decoded in just three simple steps
          </h2>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Left Side - Timeline */}
          <div 
            className={styles.timelineContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={styles.timeline}>
              <div className={styles.timelineLine}></div>
              {steps.map((step, index) => (
                <div key={step.id} className={styles.timelineItem}>
                  <div 
                    className={`${styles.stepCircle} ${selectedStep === step.id ? styles.stepCircleActive : ''}`}
                    onClick={() => setSelectedStep(step.id)}
                  >
                    {step.id}
                  </div>
                  <div className={`${styles.stepContent} ${selectedStep === step.id ? styles.stepContentActive : ''}`}>
                    <h3 
                      className={`${styles.stepTitle} ${selectedStep === step.id ? styles.stepTitleActive : ''}`}
                      onClick={() => setSelectedStep(step.id)}
                    >
                      {step.title}
                    </h3>
                    <div className={`${styles.stepDescription} ${selectedStep === step.id ? styles.stepDescriptionExpanded : ''}`}>
                      <p>{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className={styles.imageContainer}>
            <img 
              src={currentStep.image}
              alt={currentStep.alt}
              className={styles.stepImage}
              key={currentStep.id} // Force re-render for smooth transition
            />
          </div>
        </div>
      </div>
    </section>
  );
} 