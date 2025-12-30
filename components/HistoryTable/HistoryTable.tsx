
'use client';

import { useState } from 'react';
import styles from './HistoryTable.module.css';

interface HistoryEntry {
  id: string;
  modelNumber: string;
  brand: string;
  type: string;
  decodedAt: string;
  status: 'success' | 'partial' | 'failed';
  details: string;
}

// Sample data for demonstration
const sampleHistory: HistoryEntry[] = [
  {
    id: '1',
    modelNumber: 'CVG120A1B2',
    brand: 'Carrier',
    type: 'Chiller',
    decodedAt: '2024-01-15 14:30',
    status: 'success',
    details: 'Complete decode with all specifications'
  },
  {
    id: '2',
    modelNumber: 'RTAA1206AXG',
    brand: 'Trane',
    type: 'Rooftop Unit',
    decodedAt: '2024-01-15 13:15',
    status: 'success',
    details: 'Full model breakdown available'
  },
  {
    id: '3',
    modelNumber: 'YMC2S0A3H',
    brand: 'York',
    type: 'Heat Pump',
    decodedAt: '2024-01-15 11:45',
    status: 'partial',
    details: 'Some specifications unavailable'
  },
  {
    id: '4',
    modelNumber: 'WP24A48-1',
    brand: 'Westinghouse',
    type: 'Package Unit',
    decodedAt: '2024-01-15 10:20',
    status: 'failed',
    details: 'Model not found in database'
  },
  {
    id: '5',
    modelNumber: 'DXAA1204BCD',
    brand: 'Daikin',
    type: 'VRF System',
    decodedAt: '2024-01-14 16:30',
    status: 'success',
    details: 'Complete decode with efficiency ratings'
  },
  {
    id: '6',
    modelNumber: 'GCE24H4A',
    brand: 'Goodman',
    type: 'Condensing Unit',
    decodedAt: '2024-01-14 15:10',
    status: 'success',
    details: 'All specifications decoded'
  },
  {
    id: '7',
    modelNumber: 'RGE75A2B',
    brand: 'Rheem',
    type: 'Furnace',
    decodedAt: '2024-01-14 14:45',
    status: 'partial',
    details: 'Efficiency data incomplete'
  },
  {
    id: '8',
    modelNumber: 'AHS36C1XA',
    brand: 'American Standard',
    type: 'Air Handler',
    decodedAt: '2024-01-14 13:20',
    status: 'success',
    details: 'Full component breakdown'
  }
];

export default function HistoryTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'brand' | 'status'>('date');

  const filteredHistory = sampleHistory.filter(entry => {
    const matchesSearch = entry.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.decodedAt).getTime() - new Date(a.decodedAt).getTime();
      case 'brand':
        return a.brand.localeCompare(b.brand);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

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

  return (
    <div className={styles.historyTable}>
      <div className={styles.tableHeader}>
        <h2>Decoding History</h2>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search models, brands, or types..."
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
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Model Number</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Decoded At</th>
              <th>Status</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((entry) => (
              <tr key={entry.id} className={styles.tableRow}>
                <td className={styles.modelNumber}>{entry.modelNumber}</td>
                <td className={styles.brand}>{entry.brand}</td>
                <td className={styles.type}>{entry.type}</td>
                <td className={styles.date}>{entry.decodedAt}</td>
                <td className={styles.status}>
                  <span className={`${styles.statusBadge} ${styles[entry.status]}`}>
                    {getStatusIcon(entry.status)} {entry.status}
                  </span>
                </td>
                <td className={styles.details}>{entry.details}</td>
                <td className={styles.actions}>
                  <button className={styles.actionButton}>View</button>
                  <button className={styles.actionButton}>Re-decode</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedHistory.length === 0 && (
        <div className={styles.emptyState}>
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
        </div>
      )}
    </div>
  );
}

