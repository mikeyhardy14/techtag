import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AnalyticsData, BrandStats, MonthlyStats } from '@/types/history';

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

// GET - Get user's analytics data
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getUserFromRequest(request);
    
    if (authError || !user || !supabase) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all history for this user to calculate analytics
    const { data: history, error: historyError } = await supabase
      .from('decode_history')
      .select('*')
      .eq('user_id', user.id)
      .order('decoded_at', { ascending: false });

    if (historyError) {
      console.error('Analytics fetch error:', historyError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    const entries = history || [];

    // Calculate overview stats
    const totalDecodes = entries.length;
    const successfulDecodes = entries.filter(e => e.status === 'success').length;
    const partialDecodes = entries.filter(e => e.status === 'partial').length;
    const highConfidenceDecodes = entries.filter(e => e.confidence === 'high').length;
    const uniqueBrands = new Set(entries.map(e => e.brand)).size;
    
    const successRate = totalDecodes > 0 
      ? Math.round((successfulDecodes / totalDecodes) * 100) 
      : 0;

    // Calculate average confidence
    let avgConfidence = 'N/A';
    if (totalDecodes > 0) {
      const confidenceScore = entries.reduce((acc, e) => {
        if (e.confidence === 'high') return acc + 3;
        if (e.confidence === 'medium') return acc + 2;
        if (e.confidence === 'low') return acc + 1;
        return acc;
      }, 0);
      const avgScore = confidenceScore / totalDecodes;
      if (avgScore >= 2.5) avgConfidence = 'High';
      else if (avgScore >= 1.5) avgConfidence = 'Medium';
      else avgConfidence = 'Low';
    }

    // Calculate brand stats
    const brandCounts: Record<string, number> = {};
    entries.forEach(e => {
      brandCounts[e.brand] = (brandCounts[e.brand] || 0) + 1;
    });

    const brandStats: BrandStats[] = Object.entries(brandCounts)
      .map(([brand, count]) => ({
        brand,
        count,
        percentage: totalDecodes > 0 ? Math.round((count / totalDecodes) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate monthly stats (last 6 months)
    const monthlyStats: MonthlyStats[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
      
      const monthEntries = entries.filter(e => {
        const entryDate = new Date(e.decoded_at);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });

      monthlyStats.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        completed: monthEntries.length,
        success: monthEntries.filter(e => e.status === 'success').length,
        partial: monthEntries.filter(e => e.status === 'partial').length,
        failed: monthEntries.filter(e => e.status === 'failed').length
      });
    }

    // Get recent activity (last 10 entries)
    const recentActivity = entries.slice(0, 10);

    const analyticsData: AnalyticsData = {
      overview: {
        total_decodes: totalDecodes,
        success_rate: successRate,
        average_confidence: avgConfidence,
        unique_brands: uniqueBrands
      },
      monthly_stats: monthlyStats,
      brand_stats: brandStats,
      recent_activity: recentActivity
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

