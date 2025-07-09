'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './page.module.css';
import DecoderForm from '@/components/DecoderForm/DecoderForm';
import ProjectDrawer from '../../../components/ProjectDrawer';
import ProjectsTable from '../../../components/ProjectsTable';
import useProjects from './hooks/useProjects';

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { projects, addProject, updateProject } = useProjects();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

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
