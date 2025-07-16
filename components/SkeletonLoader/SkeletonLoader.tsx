'use client';
import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  type?: 'cards' | 'table' | 'full';
  rows?: number;
}

export default function SkeletonLoader({ type = 'full', rows = 5 }: SkeletonLoaderProps) {
  if (type === 'cards') {
    return (
      <div className={styles.cardsContainer}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={styles.cardSkeleton}>
            <div className={styles.cardHeader}>
              <div className={styles.skeletonIcon}></div>
              <div className={styles.skeletonTrendIcon}></div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.skeletonValue}></div>
              <div className={styles.skeletonLabel}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className={styles.skeletonHeaderCell}></div>
          ))}
        </div>
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className={styles.tableRow}>
            {[...Array(8)].map((_, cellIndex) => (
              <div key={cellIndex} className={styles.skeletonCell}></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.fullContainer}>
      <SkeletonLoader type="cards" />
      <div className={styles.spacer}></div>
      <SkeletonLoader type="table" rows={rows} />
    </div>
  );
} 