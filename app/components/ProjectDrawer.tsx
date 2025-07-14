'use client';
import { useState } from 'react';
import { Project } from './ProjectsTable';
import styles from './ProjectDrawer.module.css';

interface ProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: Omit<Project, 'id' | 'communicationLogs'>) => void;
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

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() && formData.client.trim()) {
      onCreate({
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
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>Create New Project</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name..."
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="client">Client</label>
            <input
              type="text"
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder="Enter client name..."
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="model">Model Number</label>
            <input
              type="text"
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="Enter HVAC model number..."
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Initial Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              className={styles.input}
            >
              <option value="In Progress">In Progress</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 