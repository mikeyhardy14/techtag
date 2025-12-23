-- Create projects table linked to user profiles
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Project information
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Submitted', 'Approved', 'Completed')),
  outcome TEXT CHECK (outcome IS NULL OR outcome IN ('Won', 'Lost')),
  submittal_file TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create communication_logs table for project communications
CREATE TABLE IF NOT EXISTS communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Communication details
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('Email', 'Phone', 'Meeting', 'Text', 'Other')),
  subject TEXT NOT NULL,
  notes TEXT,
  contact_person TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_communication_logs_project_id ON communication_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_user_id ON communication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_date ON communication_logs(date DESC);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

-- Projects policies
-- Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Communication logs policies
-- Users can view their own communication logs
CREATE POLICY "Users can view own communication logs"
  ON communication_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own communication logs
CREATE POLICY "Users can insert own communication logs"
  ON communication_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own communication logs
CREATE POLICY "Users can update own communication logs"
  ON communication_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own communication logs
CREATE POLICY "Users can delete own communication logs"
  ON communication_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at on projects
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for projects with last communication date
CREATE OR REPLACE VIEW projects_with_stats AS
SELECT 
  p.*,
  (
    SELECT MAX(cl.date) 
    FROM communication_logs cl 
    WHERE cl.project_id = p.id
  ) as last_communication,
  (
    SELECT COUNT(*) 
    FROM communication_logs cl 
    WHERE cl.project_id = p.id
  ) as communication_count
FROM projects p;

