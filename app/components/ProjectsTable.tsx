'use client';
import { useState } from 'react';
import styles from './ProjectsTable.module.css';

export interface CommunicationLog {
  id: string;
  date: string;
  type: 'Email' | 'Phone' | 'Meeting' | 'Text' | 'Other';
  subject: string;
  notes: string;
  contactPerson?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  model: string;
  status: 'In Progress' | 'Submitted' | 'Approved' | 'Completed';
  outcome?: 'Won' | 'Lost';
  submittalFile?: string;
  lastCommunication?: string;
  communicationLogs: CommunicationLog[];
}

interface ProjectsTableProps {
  projects: Project[];
  onUpdate: (project: Project) => void;
  onViewCommunications: (project: Project) => void;
  onAddCommunication: (project: Project) => void;
  onProjectClick: (project: Project) => void;
}

export default function ProjectsTable({ projects, onUpdate, onViewCommunications, onAddCommunication, onProjectClick }: ProjectsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesOutcome = outcomeFilter === 'all' || project.outcome === outcomeFilter;
    return matchesStatus && matchesOutcome;
  });

  const handleStatusChange = (project: Project, newStatus: Project['status']) => {
    onUpdate({ ...project, status: newStatus });
  };

  const handleOutcomeChange = (project: Project, newOutcome: Project['outcome']) => {
    onUpdate({ ...project, outcome: newOutcome });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress': 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'Submitted': 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16,6 12,2 8,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'Approved': 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Completed': 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default: 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
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

  const getLastCommunication = (project: Project) => {
    if (project.communicationLogs.length === 0) {
      return 'No communication logged';
    }
    
    const lastLog = project.communicationLogs.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    const date = new Date(lastLog.date).toLocaleDateString();
    return `${lastLog.type} - ${date}`;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>Project Overview</h3>
          <p className={styles.subtitle}>Track and manage all your HVAC projects in one place</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Outcomes</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className={styles.filterSummary}>
          <span className={styles.projectCount}>
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Model</th>
              <th>Status</th>
              <th>Outcome</th>
              <th>Submittal</th>
              <th>Last Communication</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr key={project.id} className={styles.tableRow} style={{ animationDelay: `${index * 50}ms` }}>
                <td className={styles.projectCell}>
                  <button 
                    onClick={() => onProjectClick(project)}
                    className={styles.projectButton}
                    title="Click to view project details"
                  >
                    <div className={styles.projectIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={styles.projectInfo}>
                      <span className={styles.projectName}>{project.name}</span>
                    </div>
                  </button>
                </td>
                <td className={styles.clientCell}>
                  <div className={styles.clientInfo}>
                    <div className={styles.clientAvatar}>
                      {project.client.charAt(0).toUpperCase()}
                    </div>
                    <span className={styles.clientName}>{project.client}</span>
                  </div>
                </td>
                <td className={styles.modelCell}>
                  <span className={styles.modelNumber}>{project.model}</span>
                </td>
                <td className={styles.statusCell}>
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project, e.target.value as Project['status'])}
                    className={`${styles.statusSelect} ${getStatusClassName(project.status)}`}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className={styles.statusChip}>
                    <div className={styles.statusIcon}>
                      {getStatusIcon(project.status)}
                    </div>
                    <span className={styles.statusText}>{project.status}</span>
                  </div>
                </td>
                <td className={styles.outcomeCell}>
                  <select
                    value={project.outcome || ''}
                    onChange={(e) => handleOutcomeChange(project, e.target.value as Project['outcome'])}
                    className={`${styles.outcomeSelect} ${getOutcomeClassName(project.outcome || '')}`}
                  >
                    <option value="">Pending</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                  {project.outcome && (
                    <div className={`${styles.outcomeChip} ${styles[`outcome${project.outcome}`]}`}>
                      <div className={styles.outcomeIcon}>
                        {project.outcome === 'Won' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span>{project.outcome}</span>
                    </div>
                  )}
                </td>
                <td className={styles.submittalCell}>
                  {project.submittalFile ? (
                    <a href={project.submittalFile} target="_blank" rel="noopener noreferrer" className={styles.submittalLink}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View Submittal
                    </a>
                  ) : (
                    <button className={styles.uploadButton}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Upload
                    </button>
                  )}
                </td>
                <td className={styles.communicationCell}>
                  <div className={styles.communicationInfo}>
                    <span className={styles.lastCommunication}>{getLastCommunication(project)}</span>
                  </div>
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => onViewCommunications(project)}
                      className={styles.viewButton}
                      title="View communication logs"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className={styles.communicationCount}>({project.communicationLogs.length})</span>
                    </button>
                    <button
                      onClick={() => onAddCommunication(project)}
                      className={styles.addButton}
                      title="Add communication"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4 className={styles.emptyTitle}>No projects found</h4>
          <p className={styles.emptyMessage}>
            {statusFilter !== 'all' || outcomeFilter !== 'all' 
              ? 'Try adjusting your filters to see more projects.'
              : 'Get started by creating your first project.'
            }
          </p>
        </div>
      )}
    </div>
  );
} 