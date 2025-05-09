// app/dashboard/hooks/useProjects.ts
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

export type Status = 'In Progress' | 'Submitted' | 'Approved' | 'Completed';
export type Result = 'Won' | 'Lost' | '';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: Status;
  result: Result;
  submittalUrl?: string;
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = (p: Omit<Project, 'id'>) =>
    setProjects(curr => [...curr, { ...p, id: uuid() }]);

  const updateProject = (id: string, patch: Partial<Project>) =>
    setProjects(curr =>
      curr.map(p => (p.id === id ? { ...p, ...patch } : p))
    );

  return { projects, addProject, updateProject };
}
