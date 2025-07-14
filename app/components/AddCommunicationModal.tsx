'use client';
import { useState } from 'react';
import { Project, CommunicationLog } from './ProjectsTable';
import styles from './AddCommunicationModal.module.css';

interface AddCommunicationModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onAdd: (projectId: string, communication: Omit<CommunicationLog, 'id'>) => void;
}

export default function AddCommunicationModal({ open, onClose, project, onAdd }: AddCommunicationModalProps) {
  const [formData, setFormData] = useState({
    type: 'Email' as CommunicationLog['type'],
    subject: '',
    notes: '',
    contactPerson: '',
    date: new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM format
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  if (!open || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date and time are required';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Submit the form
      onAdd(project.id, {
        type: formData.type,
        subject: formData.subject.trim(),
        notes: formData.notes.trim(),
        contactPerson: formData.contactPerson.trim() || undefined,
        date: formData.date
      });
      
      // Reset form
      setFormData({
        type: 'Email',
        subject: '',
        notes: '',
        contactPerson: '',
        date: new Date().toISOString().slice(0, 16)
      });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add Communication Log</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.projectInfo}>
          <h3>{project.name}</h3>
          <p><strong>Client:</strong> {project.client}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>
              Communication Type <span className={styles.required}>*</span>
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as CommunicationLog['type'])}
              className={styles.select}
            >
              <option value="Email">Email</option>
              <option value="Phone">Phone Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Text">Text/SMS</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Date & Time <span className={styles.required}>*</span>
            </label>
            <input
              type="datetime-local"
              id="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
            />
            {errors.date && <span className={styles.errorText}>{errors.date}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>
              Subject <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Brief description of the communication..."
              className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
            />
            {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contactPerson" className={styles.label}>
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
              placeholder="Name of person you communicated with..."
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.label}>
              Notes <span className={styles.required}>*</span>
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Detailed notes about the communication..."
              rows={4}
              className={`${styles.textarea} ${errors.notes ? styles.inputError : ''}`}
            />
            {errors.notes && <span className={styles.errorText}>{errors.notes}</span>}
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Communication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 