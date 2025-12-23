'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import { AnalyticsData } from '@/types/history';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const { session } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'partial': return '⚠️';
      case 'failed': return '❌';
      default: return '🔍';
    }
  };

  if (loading) {
    return (
      <DashboardSidebar>
        <DashboardHeader title="Analytics" />
        <div className={styles.content}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </DashboardSidebar>
    );
  }

  if (!session) {
    return (
      <DashboardSidebar>
        <DashboardHeader title="Analytics" />
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <p>Please log in to view your analytics.</p>
          </div>
        </div>
      </DashboardSidebar>
    );
  }

  if (error) {
    return (
      <DashboardSidebar>
        <DashboardHeader title="Analytics" />
        <div className={styles.content}>
          <div className={styles.emptyState}>
            <p>Error: {error}</p>
            <button onClick={fetchAnalytics} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      </DashboardSidebar>
    );
  }

  // Use real data or show empty state
  const hasData = analytics && analytics.overview.total_decodes > 0;

  return (
    <DashboardSidebar>
      <DashboardHeader
        title="Analytics"
        actionButton={{
          label: "EXPORT REPORT",
          icon: "📊",
          onClick: () => { /* TODO: Implement export report functionality */ }
        }}
      />
      <div className={styles.content}>
        {/* Overview Cards */}
        <div className={styles.overviewCards}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Success Rate</div>
            </div>
            <div className={styles.cardValue}>{hasData ? `${analytics.overview.success_rate}%` : '0%'}</div>
            <div className={styles.cardChange}>Based on all decodes</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Confidence Level</div>
            </div>
            <div className={styles.cardValue}>{hasData ? analytics.overview.average_confidence : 'N/A'}</div>
            <div className={styles.cardChange}>Average decode confidence</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Total Decodes</div>
            </div>
            <div className={styles.cardValue}>{hasData ? analytics.overview.total_decodes.toLocaleString() : '0'}</div>
            <div className={styles.cardChange}>All time</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Unique Brands</div>
            </div>
            <div className={styles.cardValue}>{hasData ? analytics.overview.unique_brands : '0'}</div>
            <div className={styles.cardChange}>Brands decoded</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          {/* Monthly Trends Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Decode Trends</h3>
              <p className={styles.chartSubtitle}>Monthly decode activity and results</p>
            </div>
            <div className={styles.chart}>
              {hasData && analytics.monthly_stats.length > 0 ? (
                <>
                  <div className={styles.chartContainer}>
                    {analytics.monthly_stats.map((data) => (
                      <div key={data.month} className={styles.chartBar}>
                        <div className={styles.barGroup}>
                          <div 
                            className={styles.bar} 
                            style={{ 
                              height: `${Math.max((data.completed / Math.max(...analytics.monthly_stats.map(d => d.completed), 1)) * 100, 5)}%`,
                              background: '#3B82F6'
                            }}
                          ></div>
                          <div 
                            className={styles.bar} 
                            style={{ 
                              height: `${Math.max((data.success / Math.max(...analytics.monthly_stats.map(d => d.completed), 1)) * 100, 5)}%`,
                              background: '#10B981'
                            }}
                          ></div>
                          <div 
                            className={styles.bar} 
                            style={{ 
                              height: `${Math.max((data.failed / Math.max(...analytics.monthly_stats.map(d => d.completed), 1)) * 100, 5)}%`,
                              background: '#EF4444'
                            }}
                          ></div>
                        </div>
                        <span className={styles.chartLabel}>{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <div className={styles.legendColor} style={{ background: '#3B82F6' }}></div>
                      <span>Total</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={styles.legendColor} style={{ background: '#10B981' }}></div>
                      <span>Success</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={styles.legendColor} style={{ background: '#EF4444' }}></div>
                      <span>Failed</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.chartEmpty}>
                  <p>No decode data available yet.</p>
                  <p className={styles.chartEmptyHint}>Start decoding model numbers to see your trends here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Brands Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Top HVAC Brands</h3>
              <p className={styles.chartSubtitle}>Most frequently decoded model brands</p>
            </div>
            <div className={styles.brandsChart}>
              {hasData && analytics.brand_stats.length > 0 ? (
                analytics.brand_stats.map((brand) => (
                  <div key={brand.brand} className={styles.brandItem}>
                    <div className={styles.brandInfo}>
                      <span className={styles.brandName}>{brand.brand}</span>
                      <span className={styles.brandCount}>{brand.count} model{brand.count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className={styles.brandBar}>
                      <div 
                        className={styles.brandProgress}
                        style={{ width: `${brand.percentage}%` }}
                      ></div>
                    </div>
                    <span className={styles.brandPercentage}>{brand.percentage}%</span>
                  </div>
                ))
              ) : (
                <div className={styles.chartEmpty}>
                  <p>No brand data available yet.</p>
                  <p className={styles.chartEmptyHint}>Start decoding model numbers to see brand statistics.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Activity</h3>
            <a href="../history" className={styles.viewAllButton}>View All</a>
          </div>
          <div className={styles.activityList}>
            {hasData && analytics.recent_activity.length > 0 ? (
              analytics.recent_activity.slice(0, 5).map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityText}>
                      Decoded <strong>{activity.model_number}</strong> ({activity.brand})
                    </span>
                    <span className={styles.activityTime}>{formatTimeAgo(activity.decoded_at)}</span>
                  </div>
                  <span className={`${styles.activityStatus} ${styles[activity.status]}`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <div className={styles.activityEmpty}>
                <p>No recent activity.</p>
                <p className={styles.activityEmptyHint}>Your recent decode activity will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
}
