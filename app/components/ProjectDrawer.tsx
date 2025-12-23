'use client';
import { useState } from 'react';
import { Project } from './ProjectsTable';
import styles from './ProjectDrawer.module.css';

interface ProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: Omit<Project, 'id' | 'communicationLogs'>) => void | Promise<void>;
}

export default function ProjectDrawer({ open, onClose, onCreate }: ProjectDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    model: '',
    status: 'In Progress' as Project['status'],
    outcome: undefined as Project['outcome'],
    submittalFile: undefined as string | undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() && formData.client.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onCreate({
          name: formData.name.trim(),
          client: formData.client.trim(),
          model: formData.model.trim(),
          status: formData.status,
          outcome: formData.outcome,
          submittalFile: formData.submittalFile,
        });
        
        // Reset form
        setFormData({
          name: '',
          client: '',
          model: '',
          status: 'In Progress',
          outcome: undefined,
          submittalFile: undefined,
        });
        
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11v6M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.headerText}>
              <h2>Create New Project</h2>
              <p>Add a new HVAC project to your pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton} disabled={isSubmitting}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Project Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name">
              <span className={styles.labelText}>Project Name</span>
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Downtown Office HVAC Upgrade"
                className={styles.input}
                required
                disabled={isSubmitting}
              />
            </div>
            <span className={styles.hint}>Give your project a descriptive name</span>
          </div>

          {/* Client */}
          <div className={styles.formGroup}>
            <label htmlFor="client">
              <span className={styles.labelText}>Client</span>
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g., ABC Corporation"
                className={styles.input}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Model Number */}
          <div className={styles.formGroup}>
            <label htmlFor="model">
              <span className={styles.labelText}>Model Number</span>
              <span className={styles.optional}>(optional)</span>
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                type="text"
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., CM-350-TR"
                className={`${styles.input} ${styles.monoInput}`}
                disabled={isSubmitting}
              />
            </div>
            <span className={styles.hint}>Enter the HVAC unit model number if known</span>
          </div>

          {/* Status */}
          <div className={styles.formGroup}>
            <label htmlFor="status">
              <span className={styles.labelText}>Initial Status</span>
            </label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                className={styles.input}
                disabled={isSubmitting}
              >
                <option value="In Progress">In Progress</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Actions */}
          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelButton} 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={isSubmitting || !formData.name.trim() || !formData.client.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} />
                  Creating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
