export interface DecodeHistoryEntry {
  id: string;
  user_id: string;
  model_number: string;
  brand: string;
  manufacturer: string;
  equipment_type: string | null;
  status: 'success' | 'partial' | 'failed';
  confidence: 'high' | 'medium' | 'low' | null;
  segments: DecodedSegment[] | null;
  unmatched_segments: UnmatchedSegment[] | null;
  decoded_at: string;
  details: string | null;
}

export interface DecodedSegment {
  position: string;
  characters: string;
  meaning: string;
  group: string;
}

export interface UnmatchedSegment {
  position: string;
  characters: string;
  group: string;
  id: string;
  attempted: string;
}

export interface DecodeHistoryCreate {
  model_number: string;
  brand: string;
  manufacturer: string;
  equipment_type?: string | null;
  status: 'success' | 'partial' | 'failed';
  confidence?: 'high' | 'medium' | 'low' | null;
  segments?: DecodedSegment[] | null;
  unmatched_segments?: UnmatchedSegment[] | null;
  details?: string | null;
}

export interface UserDecodeAnalytics {
  user_id: string;
  total_decodes: number;
  successful_decodes: number;
  partial_decodes: number;
  failed_decodes: number;
  high_confidence_decodes: number;
  unique_brands: number;
  last_decode_at: string | null;
}

export interface BrandStats {
  brand: string;
  count: number;
  percentage: number;
}

export interface MonthlyStats {
  month: string;
  completed: number;
  success: number;
  partial: number;
  failed: number;
}

export interface AnalyticsData {
  overview: {
    total_decodes: number;
    success_rate: number;
    average_confidence: string;
    unique_brands: number;
  };
  monthly_stats: MonthlyStats[];
  brand_stats: BrandStats[];
  recent_activity: DecodeHistoryEntry[];
}

