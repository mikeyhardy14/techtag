'use client';
import { useState } from 'react';
import styles from './ProjectsTable.module.css';

export interface Project {
  id: string;
  name: string;
  client: string;
  model: string;
  status: 'In Progress' | 'Submitted' | 'Approved' | 'Completed';
  outcome?: 'Won' | 'Lost';
  submittalFile?: string;
  lastCommunication?: string;
}

interface ProjectsTableProps {
  projects: Project[];
  onUpdate: (project: Project) => void;
}

export default function ProjectsTable({ projects, onUpdate }: ProjectsTableProps) {
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
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>{project.model}</td>
              <td>
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project, e.target.value as Project['status'])}
                  className={styles.statusSelect}
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
                  className={styles.outcomeSelect}
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
              <td>{project.lastCommunication || 'No communication logged'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 