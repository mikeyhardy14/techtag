'use client';
import { useState } from 'react';
import styles from './page.module.css';
// import NomenclatureDecoder from '@/components/NomenclatureDecoder';
// import ProjectDrawer from './components/ProjectDrawer';
// import ProjectsTable from './components/ProjectsTable';
import useProjects from './hooks/useProjects';

export default function DashboardClient() {
  const { projects, addProject, updateProject } = useProjects();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* <NomenclatureDecoder /> */}

      <button
        className={styles.newBtn}
        onClick={() => setDrawerOpen(true)}
      >
        + New Project
      </button>

      {/* <ProjectsTable
        projects={projects}
        onUpdate={updateProject}
      />

      <ProjectDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreate={addProject}
      /> */}
    </div>
  );
}
