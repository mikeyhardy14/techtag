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
      <div className={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Outcomes</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client</th>
            <th>Model</th>
            <th>Status</th>
            <th>Outcome</th>
            <th>Submittal</th>
            <th>Last Communication</th>
            <th>Communications</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>
                <button 
                  onClick={() => onProjectClick(project)}
                  className={styles.projectNameButton}
                  title="Click to view project details"
                >
                  {project.name}
                </button>
              </td>
              <td>{project.client}</td>
              <td>{project.model}</td>
              <td>
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project, e.target.value as Project['status'])}
                  className={getStatusClassName(project.status)}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <select
                  value={project.outcome || ''}
                  onChange={(e) => handleOutcomeChange(project, e.target.value as Project['outcome'])}
                  className={getOutcomeClassName(project.outcome || '')}
                >
                  <option value="">Select Outcome</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </td>
              <td>
                {project.submittalFile ? (
                  <a href={project.submittalFile} target="_blank" rel="noopener noreferrer">
                    View Submittal
                  </a>
                ) : (
                  <button className={styles.uploadButton}>Upload</button>
                )}
              </td>
              <td>{getLastCommunication(project)}</td>
              <td>
                <div className={styles.communicationActions}>
                  <button
                    onClick={() => onViewCommunications(project)}
                    className={styles.viewLogsButton}
                    title="View communication logs"
                  >
                    📋 ({project.communicationLogs.length})
                  </button>
                  <button
                    onClick={() => onAddCommunication(project)}
                    className={styles.addCommButton}
                    title="Add communication"
                  >
                    ➕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 