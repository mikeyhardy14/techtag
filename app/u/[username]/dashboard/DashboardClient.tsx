'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './page.module.css';

import ProjectDrawer from '../../../components/ProjectDrawer';
import ProjectsTable, { Project } from '../../../components/ProjectsTable';
import CommunicationLogDrawer from '../../../components/CommunicationLogDrawer';
import AddCommunicationModal from '../../../components/AddCommunicationModal';
import ProjectDetailsDrawer from '../../../components/ProjectDetailsDrawer';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import DashboardKPICards from '@/components/DashboardKPICards/DashboardKPICards';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';
import useProjects from './hooks/useProjects';

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { projects, addProject, updateProject, addCommunication, isLoading } = useProjects();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communicationDrawerOpen, setCommunicationDrawerOpen] = useState(false);
  const [addCommunicationModalOpen, setAddCommunicationModalOpen] = useState(false);
  const [projectDetailsDrawerOpen, setProjectDetailsDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleViewCommunications = (project: Project) => {
    setSelectedProject(project);
    setCommunicationDrawerOpen(true);
  };

  const handleAddCommunication = (project: Project) => {
    setSelectedProject(project);
    setAddCommunicationModalOpen(true);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectDetailsDrawerOpen(true);
  };

  const handleCommunicationAdded = (projectId: string, communication: any) => {
    addCommunication(projectId, communication);
    setAddCommunicationModalOpen(false);
    setSelectedProject(null);
  };

  const closeCommunicationDrawer = () => {
    setCommunicationDrawerOpen(false);
    setSelectedProject(null);
  };

  const closeAddCommunicationModal = () => {
    setAddCommunicationModalOpen(false);
    setSelectedProject(null);
  };

  const closeProjectDetailsDrawer = () => {
    setProjectDetailsDrawerOpen(false);
    setSelectedProject(null);
  };

  // Show auth loading state
  if (loading) {
    return (
      <DashboardSidebar>
        <SkeletonLoader />
      </DashboardSidebar>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Show data loading state
  if (isLoading) {
    return (
      <DashboardSidebar>
        <DashboardHeader
          title="Projects"
          actionButton={{
            label: "CREATE PROJECT",
            icon: "➕",
            onClick: () => setDrawerOpen(true)
          }}
        />
        <div className={styles.content}>
          <SkeletonLoader />
        </div>
      </DashboardSidebar>
    );
  }

  return (
    <DashboardSidebar>
      <DashboardHeader
        title="Projects"
        actionButton={{
          label: "CREATE PROJECT",
          icon: "➕",
          onClick: () => setDrawerOpen(true)
        }}
      />
      
      <div className={styles.content}>
        {/* KPI Cards */}
        <DashboardKPICards projects={projects} />

        {/* Projects Table */}
        <div className={styles.projectsSection}>
          <ProjectsTable
            projects={projects}
            onUpdate={updateProject}
            onViewCommunications={handleViewCommunications}
            onAddCommunication={handleAddCommunication}
            onProjectClick={handleProjectClick}
          />
        </div>
      </div>

      <ProjectDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreate={addProject}
      />

      <CommunicationLogDrawer
        open={communicationDrawerOpen}
        onClose={closeCommunicationDrawer}
        project={selectedProject}
      />

      <AddCommunicationModal
        open={addCommunicationModalOpen}
        onClose={closeAddCommunicationModal}
        project={selectedProject}
        onAdd={handleCommunicationAdded}
      />

      <ProjectDetailsDrawer
        open={projectDetailsDrawerOpen}
        onClose={closeProjectDetailsDrawer}
        project={selectedProject}
        onUpdate={updateProject}
        onAddCommunication={addCommunication}
      />
    </DashboardSidebar>
  );
}
