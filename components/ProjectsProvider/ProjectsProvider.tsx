'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider/AuthProvider';

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

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'communicationLogs'>) => Promise<Project | null>;
  updateProject: (project: Project) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<boolean>;
  addCommunication: (projectId: string, communication: Omit<CommunicationLog, 'id'>) => Promise<CommunicationLog | null>;
  getProjectById: (id: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user, session } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    if (!session?.access_token) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.access_token]);

  // Load projects when user is authenticated
  useEffect(() => {
    if (user && session) {
      fetchProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }
  }, [user, session, fetchProjects]);

  const addProject = useCallback(async (newProject: Omit<Project, 'id' | 'communicationLogs'>): Promise<Project | null> => {
    if (!session?.access_token) return null;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      const project = data.project;
      
      setProjects(prev => [project, ...prev]);
      return project;
    } catch (err) {
      console.error('Error creating project:', err);
      return null;
    }
  }, [session?.access_token]);

  const updateProject = useCallback(async (updatedProject: Project): Promise<boolean> => {
    if (!session?.access_token) return false;

    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatedProject.id,
          name: updatedProject.name,
          client: updatedProject.client,
          model: updatedProject.model,
          status: updatedProject.status,
          outcome: updatedProject.outcome,
          submittalFile: updatedProject.submittalFile,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const data = await response.json();
      const project = data.project;

      setProjects(prev =>
        prev.map(p => p.id === project.id ? project : p)
      );
      return true;
    } catch (err) {
      console.error('Error updating project:', err);
      return false;
    }
  }, [session?.access_token]);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    if (!session?.access_token) return false;

    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(prev => prev.filter(p => p.id !== projectId));
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      return false;
    }
  }, [session?.access_token]);

  const addCommunication = useCallback(async (
    projectId: string, 
    communication: Omit<CommunicationLog, 'id'>
  ): Promise<CommunicationLog | null> => {
    if (!session?.access_token) return null;

    try {
      const response = await fetch('/api/projects/communications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          ...communication,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add communication');
      }

      const data = await response.json();
      const newCommunication = data.communication;

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                communicationLogs: [newCommunication, ...project.communicationLogs],
              }
            : project
        )
      );

      return newCommunication;
    } catch (err) {
      console.error('Error adding communication:', err);
      return null;
    }
  }, [session?.access_token]);

  const getProjectById = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  const value = {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    addCommunication,
    getProjectById,
    refreshProjects,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}

