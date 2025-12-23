'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './HistoryTable.module.css';
import { DecodeHistoryEntry } from '@/types/history';

export default function HistoryTable() {
  const { session } = useAuth();
  const [history, setHistory] = useState<DecodeHistoryEntry[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'brand' | 'status'>('date');

  // Fetch all history once on mount
  const fetchHistory = useCallback(async () => {
    if (!session?.access_token) {
      setInitialLoading(false);
      return;
    }

    try {
      setError(null);

      const response = await fetch('/api/history', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setInitialLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    if (!session?.access_token) return;
    
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Remove from local state
      setHistory(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry');
    }
  };

  const handleClearAll = async () => {
    if (!session?.access_token) return;
    
    if (!confirm('Are you sure you want to clear all history? This cannot be undone.')) return;

    try {
      const response = await fetch('/api/history?clearAll=true', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear history');
      }

      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      alert('Failed to clear history');
    }
  };

  // Client-side filtering and sorting (instant, no loading state)
  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.model_number.toLowerCase().includes(search) ||
        entry.brand.toLowerCase().includes(search) ||
        (entry.equipment_type && entry.equipment_type.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.decoded_at).getTime() - new Date(a.decoded_at).getTime();
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [history, searchTerm, statusFilter, sortBy]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'partial':
        return '⚠️';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!session) {
    return (
      <div className={styles.historyTable}>
        <div className={styles.emptyState}>
          <p>Please log in to view your decode history.</p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className={styles.historyTable}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.historyTable}>
        <div className={styles.emptyState}>
          <p>Error: {error}</p>
          <button onClick={fetchHistory} className={styles.clearFilters}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.historyTable}>
      <div className={styles.tableHeader}>
        <h2>Decoding History</h2>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search models, brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="partial">Partial</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'brand' | 'status')}
            className={styles.sortSelect}
          >
            <option value="date">Sort by Date</option>
            <option value="brand">Sort by Brand</option>
            <option value="status">Sort by Status</option>
          </select>
          {history.length > 0 && (
            <button onClick={handleClearAll} className={styles.clearAllButton}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className={styles.totalCount}>
          Showing {filteredAndSortedHistory.length} of {history.length} entries
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Model Number</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Decoded At</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedHistory.map((entry) => (
              <tr key={entry.id} className={styles.tableRow}>
                <td className={styles.modelNumber}>{entry.model_number}</td>
                <td className={styles.brand}>{entry.brand}</td>
                <td className={styles.type}>{entry.equipment_type || '-'}</td>
                <td className={styles.date}>{formatDate(entry.decoded_at)}</td>
                <td className={styles.status}>
                  <span className={`${styles.statusBadge} ${styles[entry.status]}`}>
                    {getStatusIcon(entry.status)} {entry.status}
                  </span>
                </td>
                <td className={styles.confidence}>
                  <span className={`${styles.confidenceBadge} ${styles[entry.confidence || 'low']}`}>
                    {entry.confidence || '-'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedHistory.length === 0 && (
        <div className={styles.emptyState}>
          {searchTerm || statusFilter !== 'all' ? (
            <>
              <p>No history entries found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className={styles.clearFilters}
              >
                Clear Filters
              </button>
            </>
          ) : (
            <p>No decode history yet. Start decoding model numbers to see your history here.</p>
          )}
        </div>
      )}
    </div>
  );
}
