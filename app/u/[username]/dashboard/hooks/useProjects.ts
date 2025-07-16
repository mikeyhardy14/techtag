// app/dashboard/hooks/useProjects.ts
'use client';
import { useState, useEffect } from 'react';
import { Project, CommunicationLog } from '../../../../components/ProjectsTable';

export default function useProjects() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  // Simulate loading initial data
  useEffect(() => {
    const loadProjects = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects([
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
    },
    {
      id: 'sample-6',
      name: 'Manufacturing Facility Expansion',
      client: 'TechParts LLC',
      model: 'HT024-A1C2',
      status: 'Completed',
      outcome: 'Won',
      submittalFile: 'https://example.com/submittal.pdf',
      communicationLogs: [
        {
          id: 'comm-8',
          date: '2023-12-15',
          type: 'Meeting',
          subject: 'Site survey and requirements',
          notes: 'Large manufacturing space requires industrial-grade system.',
          contactPerson: 'Mike Rodriguez'
        },
        {
          id: 'comm-9',
          date: '2024-01-05',
          type: 'Email',
          subject: 'Project completion confirmation',
          notes: 'System installed and operational. Client very satisfied with performance.',
          contactPerson: 'Mike Rodriguez'
        }
      ]
    },
    {
      id: 'sample-7',
      name: 'Regional Medical Center',
      client: 'Regional Medical Center',
      model: 'CM-750-MED',
      status: 'Completed',
      outcome: 'Lost',
      submittalFile: undefined,
      communicationLogs: [
        {
          id: 'comm-10',
          date: '2023-11-20',
          type: 'Meeting',
          subject: 'Initial consultation',
          notes: 'Hospital needs specialized HVAC for new surgical wing.',
          contactPerson: 'Dr. Patricia Lee'
        },
        {
          id: 'comm-11',
          date: '2023-12-10',
          type: 'Email',
          subject: 'Bid submission',
          notes: 'Submitted competitive bid for medical-grade HVAC system.',
          contactPerson: 'Dr. Patricia Lee'
        },
        {
          id: 'comm-12',
          date: '2024-01-08',
          type: 'Phone',
          subject: 'Bid result notification',
          notes: 'Unfortunately lost to competitor with lower bid. Feedback was positive on technical approach.',
          contactPerson: 'Dr. Patricia Lee'
        }
      ]
    },
    {
      id: 'sample-8',
      name: 'School District HVAC Modernization',
      client: 'Riverside School District',
      model: 'CM-400-SCH',
      status: 'Approved',
      outcome: undefined,
      submittalFile: 'https://example.com/school-submittal.pdf',
      communicationLogs: [
        {
          id: 'comm-13',
          date: '2024-01-25',
          type: 'Meeting',
          subject: 'District-wide HVAC assessment',
          notes: 'Multiple schools need system upgrades. Phased approach recommended.',
          contactPerson: 'Janet Thompson'
        }
      ]
    }
  ]);
      
      setIsLoading(false);
    };

    loadProjects();
  }, []);

  const addProject = (newProject: Omit<Project, 'id' | 'communicationLogs'>) => {
    const project: Project = {
      ...newProject,
      id: `project-${Date.now()}`,
      communicationLogs: []
    };
    setProjects(prev => [...prev, project]);
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
    isLoading,
    addProject,
    updateProject,
    addCommunication,
  };
}
