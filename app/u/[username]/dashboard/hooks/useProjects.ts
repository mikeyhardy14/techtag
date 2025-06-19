// app/dashboard/hooks/useProjects.ts
'use client';
import { useState } from 'react';
import { Project } from '../../../../components/ProjectsTable';

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = (newProject: Omit<Project, 'id'>) => {
    const project: Project = {
      ...newProject,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
    };
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  return {
    projects,
    addProject,
    updateProject,
  };
}
