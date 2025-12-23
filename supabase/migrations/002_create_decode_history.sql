-- Create decode_history table linked to user profiles
CREATE TABLE IF NOT EXISTS decode_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Model information
  model_number TEXT NOT NULL,
  brand TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  equipment_type TEXT,
  
  -- Decode result
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  segments JSONB,
  unmatched_segments JSONB,
  
  -- Metadata
  decoded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Additional details
  details TEXT
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_decode_history_user_id ON decode_history(user_id);
CREATE INDEX IF NOT EXISTS idx_decode_history_decoded_at ON decode_history(decoded_at DESC);
CREATE INDEX IF NOT EXISTS idx_decode_history_brand ON decode_history(brand);
CREATE INDEX IF NOT EXISTS idx_decode_history_model_number ON decode_history(model_number);

-- Enable Row Level Security
ALTER TABLE decode_history ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own decode history
CREATE POLICY "Users can view own decode history"
  ON decode_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own decode history
CREATE POLICY "Users can insert own decode history"
  ON decode_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own decode history
CREATE POLICY "Users can delete own decode history"
  ON decode_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create analytics aggregate view for performance
CREATE OR REPLACE VIEW user_decode_analytics AS
SELECT 
  user_id,
  COUNT(*) as total_decodes,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_decodes,
  COUNT(CASE WHEN status = 'partial' THEN 1 END) as partial_decodes,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_decodes,
  COUNT(CASE WHEN confidence = 'high' THEN 1 END) as high_confidence_decodes,
  COUNT(DISTINCT brand) as unique_brands,
  MAX(decoded_at) as last_decode_at
FROM decode_history
GROUP BY user_id;

-- Grant access to the view
ALTER VIEW user_decode_analytics OWNER TO postgres;

