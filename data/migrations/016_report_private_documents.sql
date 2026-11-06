BEGIN;

CREATE TABLE public.report_private_documents (
  slug text PRIMARY KEY,
  chapters_html text NOT NULL CHECK (length(btrim(chapters_html)) > 0)
);

ALTER TABLE public.report_private_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.report_private_documents FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON TABLE public.report_private_documents TO service_role;

COMMIT;
