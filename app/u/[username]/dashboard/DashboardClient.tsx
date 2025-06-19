'use client';
import { useState } from 'react';
import styles from './page.module.css';
import DecoderForm from '@/components/DecoderForm/DecoderForm';
import ProjectDrawer from '../../../components/ProjectDrawer';
import ProjectsTable from '../../../components/ProjectsTable';
import useProjects from './hooks/useProjects';

export default function DashboardClient() {
  const { projects, addProject, updateProject } = useProjects();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.container}>
      <DecoderForm />

      <div className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
          <h2>Projects</h2>
          <button
            className={styles.newBtn}
            onClick={() => setDrawerOpen(true)}
          >
            + New Project
          </button>
        </div>

        <ProjectsTable
          projects={projects}
          onUpdate={updateProject}
        />

        <ProjectDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onCreate={addProject}
        />
      </div>
    </div>
  );
}
