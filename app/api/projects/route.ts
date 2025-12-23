import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Get user from Authorization header
async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: new Error('No authorization token') };
  }

  const token = authHeader.replace('Bearer ', '');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  
  return { user, error, supabase };
}

// Transform database row to frontend format
function transformProject(dbProject: any, communicationLogs: any[] = []) {
  return {
    id: dbProject.id,
    name: dbProject.name,
    client: dbProject.client,
    model: dbProject.model,
    status: dbProject.status,
    outcome: dbProject.outcome || undefined,
    submittalFile: dbProject.submittal_file || undefined,
    lastCommunication: dbProject.last_communication || undefined,
    communicationLogs: communicationLogs.map(log => ({
      id: log.id,
      date: log.date,
      type: log.type,
      subject: log.subject,
      notes: log.notes || '',
      contactPerson: log.contact_person || undefined,
    })),
  };
}

// GET - Get user's projects
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getUserFromRequest(request);
    
    if (authError || !user || !supabase) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch projects with stats
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Projects fetch error:', projectsError);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    // Fetch all communication logs for these projects
    const projectIds = projects?.map(p => p.id) || [];
    let communicationLogs: any[] = [];
    
    if (projectIds.length > 0) {
      const { data: logs, error: logsError } = await supabase
        .from('communication_logs')
        .select('*')
        .in('project_id', projectIds)
        .order('date', { ascending: false });

      if (logsError) {
        console.error('Communication logs fetch error:', logsError);
      } else {
        communicationLogs = logs || [];
      }
    }

    // Group logs by project
    const logsByProject = communicationLogs.reduce((acc, log) => {
      if (!acc[log.project_id]) {
        acc[log.project_id] = [];
      }
      acc[log.project_id].push(log);
      return acc;
    }, {} as Record<string, any[]>);

    // Transform projects
    const transformedProjects = (projects || []).map(project => 
      transformProject(project, logsByProject[project.id] || [])
    );

    return NextResponse.json({ projects: transformedProjects });

  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getUserFromRequest(request);
    
    if (authError || !user || !supabase) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, client, model, status, outcome, submittalFile } = body;

    if (!name || !client) {
      return NextResponse.json(
        { error: 'Name and client are required' },
        { status: 400 }
      );
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name,
        client,
        model,
        status: status || 'In Progress',
        outcome: outcome || null,
        submittal_file: submittalFile || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Project create error:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      project: transformProject(project, []) 
    });

  } catch (error) {
    console.error('Projects POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a project
export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getUserFromRequest(request);
    
    if (authError || !user || !supabase) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, client, model, status, outcome, submittalFile } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (client !== undefined) updateData.client = client;
    if (model !== undefined) updateData.model = model;
    if (status !== undefined) updateData.status = status;
    if (outcome !== undefined) updateData.outcome = outcome || null;
    if (submittalFile !== undefined) updateData.submittal_file = submittalFile || null;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Project update error:', error);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    // Fetch communication logs for this project
    const { data: logs } = await supabase
      .from('communication_logs')
      .select('*')
      .eq('project_id', id)
      .order('date', { ascending: false });

    return NextResponse.json({ 
      project: transformProject(project, logs || []) 
    });

  } catch (error) {
    console.error('Projects PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getUserFromRequest(request);
    
    if (authError || !user || !supabase) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Communication logs will be deleted automatically due to CASCADE
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Project delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Projects DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

