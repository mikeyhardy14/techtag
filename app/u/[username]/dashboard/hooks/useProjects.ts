// app/dashboard/hooks/useProjects.ts
'use client';
import { useState } from 'react';
import { Project, CommunicationLog } from '../../../../components/ProjectsTable';

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'sample-1',
      name: 'Downtown Office HVAC Upgrade',
      client: 'ABC Corporation',
      model: 'CM-350-TR',
      status: 'In Progress',
      outcome: undefined,
      submittalFile: undefined,
      communicationLogs: [
        {
          id: 'comm-1',
          date: '2024-01-15',
          type: 'Email',
          subject: 'Initial requirements discussion',
          notes: 'Client wants to upgrade their existing HVAC system. Building is 15,000 sq ft.',
          contactPerson: 'John Smith'
        },
        {
          id: 'comm-2',
          date: '2024-01-18',
          type: 'Phone',
          subject: 'Follow-up call',
          notes: 'Discussed timeline and budget constraints. Client needs completion by March.',
          contactPerson: 'John Smith'
        },
        {
          id: 'comm-3',
          date: '2024-01-22',
          type: 'Email',
          subject: 'Proposal submission',
          notes: 'Sent detailed proposal with CM-350-TR model recommendation.',
          contactPerson: 'John Smith'
        }
      ]
    },
    {
      id: 'sample-2',
      name: 'Retail Store Climate Control',
      client: 'MegaMart Inc',
      model: 'CM-500-CH',
      status: 'Submitted',
      outcome: undefined,
      submittalFile: undefined,
      communicationLogs: [
        {
          id: 'comm-4',
          date: '2024-01-10',
          type: 'Email',
          subject: 'New store opening project',
          notes: 'Chain store needs HVAC for 3 new locations. Standard retail setup.',
          contactPerson: 'Sarah Wilson'
        }
      ]
    },
    {
      id: 'sample-3',
      name: 'Hospital Wing Renovation',
      client: 'City General Hospital',
      model: 'CM-750-MED',
      status: 'Approved',
      outcome: undefined,
      submittalFile: undefined,
      communicationLogs: [
        {
          id: 'comm-5',
          date: '2024-01-05',
          type: 'Meeting',
          subject: 'Project kickoff meeting',
          notes: 'Medical facility requires specialized HVAC with filtration. Critical timeline.',
          contactPerson: 'Dr. Michael Brown'
        }
      ]
    },
    {
      id: 'sample-4',
      name: 'School District Modernization',
      client: 'Riverside School District',
      model: 'CM-400-EDU',
      status: 'Completed',
      outcome: 'Won',
      submittalFile: undefined,
      communicationLogs: [
        {
          id: 'comm-6',
          date: '2024-01-01',
          type: 'Email',
          subject: 'Contract awarded',
          notes: 'Successfully won the bid for 5 school buildings. Project completed on time.',
          contactPerson: 'Robert Johnson'
        }
      ]
    },
    {
      id: 'sample-5',
      name: 'Luxury Hotel Project',
      client: 'Grand Plaza Hotels',
      model: 'CM-600-LUX',
      status: 'Completed',
      outcome: 'Lost',
      submittalFile: undefined,
      communicationLogs: [
        {
          id: 'comm-7',
          date: '2023-12-20',
          type: 'Phone',
          subject: 'Project declined',
          notes: 'Client chose competitor due to lower pricing. Valuable experience gained.',
          contactPerson: 'Jennifer Davis'
        }
      ]
    }
  ]);

  const addProject = (newProject: Omit<Project, 'id' | 'communicationLogs'>) => {
    const project: Project = {
      ...newProject,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      communicationLogs: [], // Initialize with empty communication logs
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

  const addCommunication = (projectId: string, communication: Omit<CommunicationLog, 'id'>) => {
    const newCommunication: CommunicationLog = {
      ...communication,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              communicationLogs: [...project.communicationLogs, newCommunication],
            }
          : project
      )
    );
  };

  return {
    projects,
    addProject,
    updateProject,
    addCommunication,
  };
}
