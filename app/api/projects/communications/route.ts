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

// POST - Add a communication log to a project
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
    const { projectId, date, type, subject, notes, contactPerson } = body;

    if (!projectId || !type || !subject) {
      return NextResponse.json(
        { error: 'Project ID, type, and subject are required' },
        { status: 400 }
      );
    }

    // Verify the project belongs to the user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const { data: log, error } = await supabase
      .from('communication_logs')
      .insert({
        project_id: projectId,
        user_id: user.id,
        date: date || new Date().toISOString().split('T')[0],
        type,
        subject,
        notes: notes || null,
        contact_person: contactPerson || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Communication log create error:', error);
      return NextResponse.json(
        { error: 'Failed to create communication log' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      communication: {
        id: log.id,
        date: log.date,
        type: log.type,
        subject: log.subject,
        notes: log.notes || '',
        contactPerson: log.contact_person || undefined,
      }
    });

  } catch (error) {
    console.error('Communications POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a communication log
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
        { error: 'Communication log ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('communication_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Communication log delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete communication log' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Communication log deleted successfully' });

  } catch (error) {
    console.error('Communications DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

