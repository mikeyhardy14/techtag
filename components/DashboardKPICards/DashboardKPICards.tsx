'use client';
import React from 'react';
import styles from './DashboardKPICards.module.css';

interface Project {
  id: string;
  name: string;
  client: string;
  model: string;
  status: 'In Progress' | 'Submitted' | 'Approved' | 'Completed';
  outcome?: 'Won' | 'Lost';
  submittalFile?: string;
  lastCommunication?: string;
  communicationLogs: any[];
}

interface DashboardKPICardsProps {
  projects: Project[];
}

export default function DashboardKPICards({ projects }: DashboardKPICardsProps) {
  // Calculate KPIs
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Submitted').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const wonProjects = projects.filter(p => p.outcome === 'Won').length;
  const lostProjects = projects.filter(p => p.outcome === 'Lost').length;
  const totalDecidedProjects = wonProjects + lostProjects;
  const winRate = totalDecidedProjects > 0 ? Math.round((wonProjects / totalDecidedProjects) * 100) : 0;
  const pendingSubmittals = projects.filter(p => !p.submittalFile && (p.status === 'In Progress' || p.status === 'Submitted')).length;

  const kpis = [
    {
      id: 'total',
      label: 'Total Projects',
      value: totalProjects,
      change: null,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" fill="currentColor"/>
        </svg>
      ),
      color: 'blue',
      trend: 'stable'
    },
    {
      id: 'active',
      label: 'Active Projects',
      value: activeProjects,
      change: null,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'orange',
      trend: 'up'
    },
    {
      id: 'winrate',
      label: 'Win Rate',
      value: `${winRate}%`,
      change: totalDecidedProjects > 0 ? `${wonProjects}/${totalDecidedProjects}` : 'No data',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
        </svg>
      ),
      color: 'green',
      trend: wonProjects > lostProjects ? 'up' : 'down'
    },
    {
      id: 'submittals',
      label: 'Pending Submittals',
      value: pendingSubmittals,
      change: null,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18v-6M9 15l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'purple',
      trend: pendingSubmittals > 0 ? 'attention' : 'stable'
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
                {kpi.trend === 'attention' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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