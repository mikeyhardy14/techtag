'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import { useProjects, Project } from '@/components/ProjectsProvider/ProjectsProvider';
import styles from './page.module.css';

import ProjectDrawer from '../../../components/ProjectDrawer';
import ProjectsTable from '../../../components/ProjectsTable';
import CommunicationLogDrawer from '../../../components/CommunicationLogDrawer';
import AddCommunicationModal from '../../../components/AddCommunicationModal';
import ProjectDetailsDrawer from '../../../components/ProjectDetailsDrawer';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import DashboardKPICards from '@/components/DashboardKPICards/DashboardKPICards';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, addProject, updateProject, addCommunication, isLoading, getProjectById } = useProjects();
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

  // Handle project query param from search navigation
  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId && !isLoading && projects.length > 0) {
      const project = getProjectById(projectId);
      if (project) {
        setSelectedProject(project);
        setProjectDetailsDrawerOpen(true);
        // Clear the query param
        const username = user?.email?.split('@')[0] || 'user';
        router.replace(`/u/${username}/dashboard`, { scroll: false });
      }
    }
  }, [searchParams, isLoading, projects, getProjectById, router, user]);

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

  const handleCommunicationAdded = async (projectId: string, communication: any) => {
    await addCommunication(projectId, communication);
    setAddCommunicationModalOpen(false);
    setSelectedProject(null);
  };

  // Wrapper for creating projects (handles async)
  const handleCreateProject = async (project: Omit<Project, 'id' | 'communicationLogs'>) => {
    await addProject(project);
    setDrawerOpen(false);
  };

  // Wrapper for updating projects (handles async)
  const handleUpdateProject = async (project: Project) => {
    await updateProject(project);
    // Update selected project if it's the one being edited
    if (selectedProject?.id === project.id) {
      setSelectedProject(project);
    }
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

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      handleProjectClick(project);
    }
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
        <DashboardHeader title="Projects" />
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
        onProjectSelect={handleProjectSelect}
      />
      
      <div className={styles.content}>
        {/* KPI Cards */}
        <DashboardKPICards projects={projects} />

        {/* Projects Table */}
        <div className={styles.projectsSection}>
          <ProjectsTable
            projects={projects}
            onUpdate={handleUpdateProject}
            onViewCommunications={handleViewCommunications}
            onAddCommunication={handleAddCommunication}
            onProjectClick={handleProjectClick}
            onCreateProject={() => setDrawerOpen(true)}
          />
        </div>
      </div>

      <ProjectDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreate={handleCreateProject}
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
        onUpdate={handleUpdateProject}
        onAddCommunication={addCommunication}
      />
    </DashboardSidebar>
  );
}
