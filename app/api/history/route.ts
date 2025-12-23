import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DecodeHistoryEntry } from '@/types/history';

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

// GET - Get user's decode history
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getUserFromRequest(request);
    
    if (authError || !user || !supabase) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters for filtering/pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('decode_history')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('decoded_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (brand) {
      query = query.eq('brand', brand);
    }

    if (search) {
      query = query.or(`model_number.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('History fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      history: data as DecodeHistoryEntry[],
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific history entry or clear all history
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
    const clearAll = searchParams.get('clearAll') === 'true';

    if (clearAll) {
      // Delete all history for this user
      const { error } = await supabase
        .from('decode_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Clear history error:', error);
        return NextResponse.json(
          { error: 'Failed to clear history' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'History cleared successfully' });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'History entry ID is required' },
        { status: 400 }
      );
    }

    // Delete specific entry
    const { error } = await supabase
      .from('decode_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Delete history error:', error);
      return NextResponse.json(
        { error: 'Failed to delete history entry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'History entry deleted successfully' });

  } catch (error) {
    console.error('History DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

