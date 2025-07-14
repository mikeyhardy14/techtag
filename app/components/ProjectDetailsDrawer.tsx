'use client';
import { useState, useEffect } from 'react';
import { Project, CommunicationLog } from './ProjectsTable';
import styles from './ProjectDetailsDrawer.module.css';

interface ProjectDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdate: (project: Project) => void;
  onAddCommunication: (projectId: string, communication: any) => void;
}

export default function ProjectDetailsDrawer({ 
  open, 
  onClose, 
  project, 
  onUpdate, 
  onAddCommunication 
}: ProjectDetailsDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    model: '',
    status: 'In Progress' as Project['status'],
    outcome: undefined as Project['outcome'],
    submittalFile: undefined as string | undefined,
    notes: '',
    contactPerson: '',
    estimatedValue: '',
    projectDescription: '',
  });

  const [showAddCommunication, setShowAddCommunication] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'Email' as CommunicationLog['type'],
    subject: '',
    notes: '',
    contactPerson: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        client: project.client,
        model: project.model,
        status: project.status,
        outcome: project.outcome,
        submittalFile: project.submittalFile,
        notes: '',
        contactPerson: '',
        estimatedValue: '',
        projectDescription: '',
      });
    }
  }, [project]);

  if (!open || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProject: Project = {
      ...project,
      name: formData.name.trim(),
      client: formData.client.trim(),
      model: formData.model.trim(),
      status: formData.status,
      outcome: formData.outcome,
      submittalFile: formData.submittalFile,
    };
    
    onUpdate(updatedProject);
    onClose();
  };

  const handleAddCommunication = () => {
    if (newCommunication.subject.trim() && newCommunication.notes.trim()) {
      const communication: Omit<CommunicationLog, 'id'> = {
        ...newCommunication,
        date: newCommunication.date,
      };
      
      onAddCommunication(project.id, communication);
      setNewCommunication({
        type: 'Email',
        subject: '',
        notes: '',
        contactPerson: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddCommunication(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sortedCommunications = [...project.communicationLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getEmailCommunications = () => {
    return sortedCommunications.filter(comm => comm.type === 'Email');
  };

  const getLastEmailDate = () => {
    const emailComms = getEmailCommunications();
    if (emailComms.length === 0) return 'No emails logged';
    return new Date(emailComms[0].date).toLocaleDateString();
  };

  const getEmailCount = () => {
    return getEmailCommunications().length;
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'In Progress': return styles.statusInProgress;
      case 'Submitted': return styles.statusSubmitted;
      case 'Approved': return styles.statusApproved;
      case 'Completed': return styles.statusCompleted;
      default: return styles.statusSelect;
    }
  };

  const getOutcomeClassName = (outcome: string) => {
    switch (outcome) {
      case 'Won': return styles.outcomeWon;
      case 'Lost': return styles.outcomeLost;
      default: return styles.outcomeSelect;
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>Project Details</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Project Overview */}
          <div className={styles.section}>
            <h3>Project Overview</h3>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewItem}>
                <label>Project Name</label>
                <span>{project.name}</span>
              </div>
              <div className={styles.overviewItem}>
                <label>Client</label>
                <span>{project.client}</span>
              </div>
              <div className={styles.overviewItem}>
                <label>Model</label>
                <span>{project.model}</span>
              </div>
              <div className={styles.overviewItem}>
                <label>Status</label>
                <span className={getStatusClassName(project.status)}>{project.status}</span>
              </div>
              <div className={styles.overviewItem}>
                <label>Outcome</label>
                <span className={getOutcomeClassName(project.outcome || '')}>{project.outcome || 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Email Tracking */}
          <div className={styles.section}>
            <h3>Email Tracking</h3>
            <div className={styles.emailStats}>
              <div className={styles.emailStat}>
                <label>Total Emails</label>
                <span className={styles.emailCount}>{getEmailCount()}</span>
              </div>
              <div className={styles.emailStat}>
                <label>Last Email</label>
                <span className={styles.emailDate}>{getLastEmailDate()}</span>
              </div>
            </div>
            
            <div className={styles.emailList}>
              <h4>Recent Emails</h4>
              {getEmailCommunications().slice(0, 5).map((email) => (
                <div key={email.id} className={styles.emailItem}>
                  <div className={styles.emailHeader}>
                    <strong>{email.subject}</strong>
                    <span className={styles.emailDate}>{new Date(email.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.emailMeta}>
                    {email.contactPerson && <span>Contact: {email.contactPerson}</span>}
                  </div>
                  <div className={styles.emailNotes}>{email.notes}</div>
                </div>
              ))}
              {getEmailCommunications().length === 0 && (
                <div className={styles.noEmails}>No emails logged yet</div>
              )}
            </div>
          </div>

          {/* Edit Project Details */}
          <div className={styles.section}>
            <h3>Edit Project Details</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Project Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="client">Client</label>
                  <input
                    type="text"
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="model">Model Number</label>
                  <input
                    type="text"
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status</label>
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
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="outcome">Outcome</label>
                  <select
                    id="outcome"
                    value={formData.outcome || ''}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value as Project['outcome'] })}
                    className={styles.input}
                  >
                    <option value="">Select Outcome</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.updateButton}>
                  Update Project
                </button>
              </div>
            </form>
          </div>

          {/* Quick Add Communication */}
          <div className={styles.section}>
            <div className={styles.communicationHeader}>
              <h3>Communications</h3>
              <button 
                onClick={() => setShowAddCommunication(!showAddCommunication)}
                className={styles.addCommButton}
              >
                {showAddCommunication ? 'Cancel' : '+ Add Communication'}
              </button>
            </div>

            {showAddCommunication && (
              <div className={styles.addCommunicationForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="type">Type</label>
                    <select
                      id="type"
                      value={newCommunication.type}
                      onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value as CommunicationLog['type'] })}
                      className={styles.input}
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Text">Text</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      value={newCommunication.date}
                      onChange={(e) => setNewCommunication({ ...newCommunication, date: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={newCommunication.subject}
                    onChange={(e) => setNewCommunication({ ...newCommunication, subject: e.target.value })}
                    className={styles.input}
                    placeholder="Enter subject..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="contactPerson">Contact Person</label>
                  <input
                    type="text"
                    id="contactPerson"
                    value={newCommunication.contactPerson}
                    onChange={(e) => setNewCommunication({ ...newCommunication, contactPerson: e.target.value })}
                    className={styles.input}
                    placeholder="Enter contact person..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    value={newCommunication.notes}
                    onChange={(e) => setNewCommunication({ ...newCommunication, notes: e.target.value })}
                    className={styles.textarea}
                    placeholder="Enter notes..."
                    rows={3}
                  />
                </div>
                <button onClick={handleAddCommunication} className={styles.addButton}>
                  Add Communication
                </button>
              </div>
            )}

            <div className={styles.communicationList}>
              {sortedCommunications.slice(0, 10).map((comm) => (
                <div key={comm.id} className={styles.communicationItem}>
                  <div className={styles.communicationHeader}>
                    <span className={styles.communicationType}>{comm.type}</span>
                    <span className={styles.communicationDate}>{new Date(comm.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.communicationSubject}>{comm.subject}</div>
                  {comm.contactPerson && (
                    <div className={styles.communicationContact}>Contact: {comm.contactPerson}</div>
                  )}
                  <div className={styles.communicationNotes}>{comm.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 