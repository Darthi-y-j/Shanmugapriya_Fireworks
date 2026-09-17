-- Allow cart-page order enquiries as a distinct enquiry_type
ALTER TABLE enquiries DROP CONSTRAINT IF EXISTS enquiries_enquiry_type_check;

ALTER TABLE enquiries ADD CONSTRAINT enquiries_enquiry_type_check
  CHECK (enquiry_type IN ('cart', 'contact', 'account', 'order'));
