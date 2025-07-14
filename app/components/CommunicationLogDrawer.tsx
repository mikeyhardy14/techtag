'use client';
import { Project, CommunicationLog } from './ProjectsTable';
import styles from './CommunicationLogDrawer.module.css';

interface CommunicationLogDrawerProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function CommunicationLogDrawer({ open, onClose, project }: CommunicationLogDrawerProps) {
  if (!open || !project) return null;

  const sortedLogs = [...project.communicationLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Email': return styles.typeEmail;
      case 'Phone': return styles.typePhone;
      case 'Meeting': return styles.typeMeeting;
      case 'Text': return styles.typeText;
      default: return styles.typeOther;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>Communication Logs</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.projectInfo}>
          <h3>{project.name}</h3>
          <p><strong>Client:</strong> {project.client}</p>
          <p><strong>Total Communications:</strong> {project.communicationLogs.length}</p>
        </div>

        <div className={styles.logsContainer}>
          {sortedLogs.length === 0 ? (
            <div className={styles.noLogs}>
              <div className={styles.noLogsIcon}>📝</div>
              <h4>No Communications Yet</h4>
              <p>No communication logs have been recorded for this project.</p>
            </div>
          ) : (
            <div className={styles.logsList}>
              {sortedLogs.map((log) => (
                <div key={log.id} className={styles.logItem}>
                  <div className={styles.logHeader}>
                    <div className={styles.logType}>
                      <span className={`${styles.typeTag} ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                      <span className={styles.logDate}>{formatDate(log.date)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.logContent}>
                    <h4 className={styles.logSubject}>{log.subject}</h4>
                    {log.contactPerson && (
                      <p className={styles.contactPerson}>
                        <strong>Contact:</strong> {log.contactPerson}
                      </p>
                    )}
                    <p className={styles.logNotes}>{log.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 