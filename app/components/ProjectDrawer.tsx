'use client';
import { useState } from 'react';
import styles from './ProjectDrawer.module.css';
import { Project } from './ProjectsTable';

interface ProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: Omit<Project, 'id'>) => void;
}

export default function ProjectDrawer({ open, onClose, onCreate }: ProjectDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    model: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      status: 'In Progress',
    });
    setFormData({ name: '', client: '', model: '' });
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>New Project</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Project Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="client">Client</label>
            <input
              id="client"
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="model">Model Number</label>
            <input
              id="model"
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
              className={styles.input}
            />
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