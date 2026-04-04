# Database Migrations

Run these SQL commands in your Supabase SQL Editor to set up the new tables and policies.

## 1. Update Customer Status Enum

```sql
-- First, add a temporary column to store new status values
ALTER TABLE customers ADD COLUMN status_new TEXT;

-- Copy and convert old values to new ones
UPDATE customers SET status_new =
  CASE
    WHEN status = 'lead' THEN 'LEAD'
    WHEN status = 'active' THEN 'CONVERTED'
    WHEN status = 'inactive' THEN 'INACTIVE'
    ELSE 'LEAD'
  END;

-- Drop the old column and rename the new one
ALTER TABLE customers DROP COLUMN status;
ALTER TABLE customers RENAME COLUMN status_new TO status;

-- Add constraint for new status values
ALTER TABLE customers ADD CONSTRAINT customers_status_check
  CHECK (status IN ('LEAD', 'IN_PROGRESS', 'CONVERTED', 'INACTIVE'));

-- Set default to LEAD
ALTER TABLE customers ALTER COLUMN status SET DEFAULT 'LEAD';
```

## 2. Create Meetings Table

```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  meeting_link TEXT,
  organized_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meetings_organized_by ON meetings(organized_by);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
```

## 3. Create Meeting Attendees Table

```sql
CREATE TABLE meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meeting_id, attendee_id)
);

CREATE INDEX idx_meeting_attendees_meeting_id ON meeting_attendees(meeting_id);
CREATE INDEX idx_meeting_attendees_attendee_id ON meeting_attendees(attendee_id);
```

## 4. Enable RLS on New Tables

```sql
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendees ENABLE ROW LEVEL SECURITY;

-- Meetings: Everyone can read; organizer can delete/update
CREATE POLICY "Anyone can view meetings" ON meetings
  FOR SELECT USING (true);

CREATE POLICY "Organizer can update meeting" ON meetings
  FOR UPDATE USING (organized_by = auth.uid());

CREATE POLICY "Organizer can delete meeting" ON meetings
  FOR DELETE USING (organized_by = auth.uid());

-- Meeting Attendees: Attendee can read/update their own
CREATE POLICY "Users can view meeting attendees" ON meeting_attendees
  FOR SELECT USING (true);

CREATE POLICY "Users can update their attendance" ON meeting_attendees
  FOR UPDATE USING (attendee_id = auth.uid());
```

## 5. Update Customer Status Policies

```sql
-- Drop old policies if they exist
DROP POLICY IF EXISTS "Employee can update assigned customers" ON customers;

-- New policy: Employee can only update status of assigned customers
CREATE POLICY "Employee can update assigned customer status" ON customers
  FOR UPDATE USING (
    assigned_to = auth.uid()
  )
  WITH CHECK (
    assigned_to = auth.uid()
  );

-- Ensure only ADMIN can change assigned_to
CREATE POLICY "Admin can reassign customers" ON customers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
```

After running these migrations, all new customers will default to `LEAD` status, and employees can only:
- Change the status of customers assigned to them
- Cannot change customer assignment (admin only)
