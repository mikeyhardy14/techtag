'use client';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const chartData = {
    projects: [
      { month: 'Jan', completed: 12, won: 8, lost: 4 },
      { month: 'Feb', completed: 15, won: 11, lost: 4 },
      { month: 'Mar', completed: 18, won: 14, lost: 4 },
      { month: 'Apr', completed: 22, won: 17, lost: 5 },
      { month: 'May', completed: 25, won: 19, lost: 6 },
      { month: 'Jun', completed: 28, won: 21, lost: 7 },
    ],
    models: [
      { brand: 'Carrier', count: 145, percentage: 35 },
      { brand: 'Trane', count: 98, percentage: 24 },
      { brand: 'Lennox', count: 73, percentage: 18 },
      { brand: 'Rheem', count: 52, percentage: 13 },
      { brand: 'York', count: 41, percentage: 10 },
    ]
  };

  return (
    <DashboardSidebar>
      <DashboardHeader
        title="Analytics"
        actionButton={{
          label: "EXPORT REPORT",
          icon: "📊",
          onClick: () => console.log('Export report clicked')
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
              <div className={styles.cardTitle}>Project Success Rate</div>
            </div>
            <div className={styles.cardValue}>78%</div>
            <div className={styles.cardChange}>+5% from last month</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Average Response Time</div>
            </div>
            <div className={styles.cardValue}>2.3h</div>
            <div className={styles.cardChange}>-12min from last month</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Models Decoded</div>
            </div>
            <div className={styles.cardValue}>1,247</div>
            <div className={styles.cardChange}>+18% from last month</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.cardTitle}>Accuracy Rate</div>
            </div>
            <div className={styles.cardValue}>94.8%</div>
            <div className={styles.cardChange}>+0.3% from last month</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          {/* Project Trends Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Project Trends</h3>
              <p className={styles.chartSubtitle}>Monthly project completion and success rates</p>
            </div>
            <div className={styles.chart}>
              <div className={styles.chartContainer}>
                {chartData.projects.map((data, index) => (
                  <div key={data.month} className={styles.chartBar}>
                    <div className={styles.barGroup}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${(data.completed / 30) * 100}%`,
                          background: '#3B82F6'
                        }}
                      ></div>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${(data.won / 30) * 100}%`,
                          background: '#10B981'
                        }}
                      ></div>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${(data.lost / 30) * 100}%`,
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
                  <span>Won</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ background: '#EF4444' }}></div>
                  <span>Lost</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Brands Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Top HVAC Brands</h3>
              <p className={styles.chartSubtitle}>Most frequently decoded model brands</p>
            </div>
            <div className={styles.brandsChart}>
              {chartData.models.map((brand, index) => (
                <div key={brand.brand} className={styles.brandItem}>
                  <div className={styles.brandInfo}>
                    <span className={styles.brandName}>{brand.brand}</span>
                    <span className={styles.brandCount}>{brand.count} models</span>
                  </div>
                  <div className={styles.brandBar}>
                    <div 
                      className={styles.brandProgress}
                      style={{ width: `${brand.percentage}%` }}
                    ></div>
                  </div>
                  <span className={styles.brandPercentage}>{brand.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Activity</h3>
            <button className={styles.viewAllButton}>View All</button>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M20 5h-6v6h6V5zm-6 8h1.5v1.5H14V13zm1.5 1.5H17V16h-1.5v-1.5zm1.5 1.5v1.5H20V16h-3.5zm0 3H20v1.5h-3.5V19z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>Decoded model CM-350-TR for ABC Corporation</span>
                <span className={styles.activityTime}>2 minutes ago</span>
              </div>
            </div>
            
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>Project "Downtown Office HVAC" status updated to Submitted</span>
                <span className={styles.activityTime}>15 minutes ago</span>
              </div>
            </div>
            
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>Won project "Manufacturing Facility Expansion"</span>
                <span className={styles.activityTime}>1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  );
} 