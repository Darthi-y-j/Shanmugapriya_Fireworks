-- Track when admin has replied to / handled an enquiry
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS admin_replied BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_enquiries_admin_replied ON enquiries(admin_replied) WHERE admin_replied = FALSE;
