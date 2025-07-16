'use client';
import React from 'react';
import styles from './EnhancedFilters.module.css';

interface FilterChip {
  id: string;
  label: string;
  value: string;
  type: 'status' | 'outcome';
}

interface EnhancedFiltersProps {
  statusFilter: string;
  outcomeFilter: string;
  onStatusChange: (status: string) => void;
  onOutcomeChange: (outcome: string) => void;
  onClearAll: () => void;
  projectCount: number;
}

export default function EnhancedFilters({
  statusFilter,
  outcomeFilter,
  onStatusChange,
  onOutcomeChange,
  onClearAll,
  projectCount
}: EnhancedFiltersProps) {
  const activeFilters: FilterChip[] = [];
  
  if (statusFilter !== 'all') {
    activeFilters.push({
      id: 'status',
      label: `Status: ${statusFilter}`,
      value: statusFilter,
      type: 'status'
    });
  }
  
  if (outcomeFilter !== 'all') {
    activeFilters.push({
      id: 'outcome',
      label: `Outcome: ${outcomeFilter}`,
      value: outcomeFilter,
      type: 'outcome'
    });
  }

  const handleChipRemove = (chip: FilterChip) => {
    if (chip.type === 'status') {
      onStatusChange('all');
    } else if (chip.type === 'outcome') {
      onOutcomeChange('all');
    }
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className={styles.container}>
      {/* Filter Controls */}
      <div className={styles.filtersRow}>
        <div className={styles.filterGroups}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Outcome</label>
            <select
              value={outcomeFilter}
              onChange={(e) => onOutcomeChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Outcomes</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <div className={styles.filterActions}>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className={styles.clearAllButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Clear All
            </button>
          )}
          <div className={styles.projectCount}>
            <span className={styles.countNumber}>{projectCount}</span>
            <span className={styles.countLabel}>
              {projectCount === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          <div className={styles.activeFiltersLabel}>Active filters:</div>
          <div className={styles.filterChips}>
            {activeFilters.map((chip) => (
              <div key={chip.id} className={styles.filterChip}>
                <span className={styles.chipLabel}>{chip.label}</span>
                <button
                  onClick={() => handleChipRemove(chip)}
                  className={styles.chipRemove}
                  aria-label={`Remove ${chip.label} filter`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 