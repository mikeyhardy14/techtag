'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './HistoryKPICards.module.css';

interface AnalyticsOverview {
  total_decodes: number;
  success_rate: number;
  average_confidence: string;
  unique_brands: number;
}

interface BrandStats {
  brand: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  overview: AnalyticsOverview;
  brand_stats: BrandStats[];
}

export default function HistoryKPICards() {
  const { session } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Get top brand
  const topBrand = analytics?.brand_stats?.[0]?.brand || 'N/A';

  const kpis = [
    {
      id: 'total',
      label: 'Total Decodes',
      value: loading ? '—' : (analytics?.overview.total_decodes || 0).toLocaleString(),
      change: 'All time',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
        </svg>
      ),
      color: 'blue',
      trend: 'stable'
    },
    {
      id: 'success',
      label: 'Success Rate',
      value: loading ? '—' : `${analytics?.overview.success_rate || 0}%`,
      change: 'Successful decodes',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
      ),
      color: 'green',
      trend: (analytics?.overview.success_rate || 0) >= 70 ? 'up' : 'stable'
    },
    {
      id: 'confidence',
      label: 'Avg Confidence',
      value: loading ? '—' : (analytics?.overview.average_confidence || 'N/A'),
      change: 'Decode accuracy',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
        </svg>
      ),
      color: 'orange',
      trend: analytics?.overview.average_confidence === 'High' ? 'up' : 'stable'
    },
    {
      id: 'brands',
      label: 'Top Brand',
      value: loading ? '—' : topBrand,
      change: `${analytics?.overview.unique_brands || 0} brands total`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="currentColor"/>
        </svg>
      ),
      color: 'purple',
      trend: 'stable'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {kpis.map((kpi) => (
          <div key={kpi.id} className={`${styles.card} ${styles[kpi.color]}`}>
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer}>
                {kpi.icon}
              </div>
              <div className={`${styles.trend} ${styles[kpi.trend]}`}>
                {kpi.trend === 'up' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {kpi.trend === 'down' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.value}>{kpi.value}</div>
              <div className={styles.label}>{kpi.label}</div>
              {kpi.change && (
                <div className={styles.change}>{kpi.change}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

