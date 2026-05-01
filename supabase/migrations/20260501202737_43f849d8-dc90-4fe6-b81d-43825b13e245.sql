CREATE TABLE public.faq_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  question text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a question
CREATE POLICY "anyone_can_submit_faq" ON public.faq_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own submissions
CREATE POLICY "users_view_own_submissions" ON public.faq_submissions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);